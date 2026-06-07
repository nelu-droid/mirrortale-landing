#!/usr/bin/env python3
"""Generate, render, and QA MirrorTale organic social batches."""

from __future__ import annotations

import argparse
import base64
import csv
import datetime as dt
import hashlib
import html
import json
import math
import os
import random
import re
import subprocess
import sys
import textwrap
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
CONFIG_DIR = ROOT / "config"
DATA_DIR = ROOT / "data"
OUTPUT_DIR = ROOT / "output"
CACHE_DIR = ROOT / ".cache"
PERFORMANCE_MEMORY_PATH = CACHE_DIR / "performance-memory.json"

TREND_SCHEMA = "mirrortale.trend_brief.v1"
BATCH_SCHEMA = "mirrortale.social.batch.v2"
TREND_MAX_AGE_DAYS = 7
DEFAULT_TEXT_MODEL = "gpt-5.4-mini"
DEFAULT_IMAGE_MODEL = "gpt-image-2"
DEFAULT_VEO_FAST_MODEL = "veo-3.1-fast-generate-preview"
DEFAULT_VEO_FINAL_MODEL = "veo-3.1-generate-preview"
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
OFFICIAL_TREND_SOURCES = [
    "https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/mobile/en",
    "https://ads.us.tiktok.com/help/article/how-to-use-trends",
    "https://www.instagram.com/creators/",
    "https://trends.google.com/trends/",
]


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")


def utc_now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def today_iso() -> str:
    return utc_now().date().isoformat()


def env_first(*names: str) -> Optional[str]:
    for name in names:
        value = os.environ.get(name)
        if value:
            return value
    return None


def openai_text_model() -> str:
    return os.environ.get("OPENAI_TEXT_MODEL", DEFAULT_TEXT_MODEL)


def openai_image_model() -> str:
    return os.environ.get("OPENAI_IMAGE_MODEL", DEFAULT_IMAGE_MODEL)


def veo_models(auth_family: str = "gemini") -> Tuple[str, str]:
    if auth_family == "vertex":
        fast_default = "veo-3.1-fast-generate-001"
        final_default = "veo-3.1-generate-001"
    else:
        fast_default = DEFAULT_VEO_FAST_MODEL
        final_default = DEFAULT_VEO_FINAL_MODEL
    return (
        os.environ.get("VEO_FAST_MODEL", fast_default),
        os.environ.get("VEO_FINAL_MODEL", final_default),
    )


def clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(high, value))


def parse_float(value: Any, default: float = 0.0) -> float:
    if value is None or value == "":
        return default
    try:
        return float(str(value).replace("%", "").strip())
    except ValueError:
        return default


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def stable_int(*parts: str) -> int:
    digest = hashlib.sha256("|".join(parts).encode("utf-8")).hexdigest()
    return int(digest[:12], 16)


def current_week() -> str:
    today = dt.date.today()
    year, week, _ = today.isocalendar()
    return f"{year}-W{week:02d}"


def parse_week_start(week: str) -> dt.date:
    match = re.fullmatch(r"(\d{4})-W(\d{2})", week)
    if not match:
        return dt.date.today()
    return dt.date.fromisocalendar(int(match.group(1)), int(match.group(2)), 1)


def format_template(template: str, ctx: Dict[str, Any]) -> str:
    safe_ctx = {key: "" if value is None else value for key, value in ctx.items()}
    return template.format(**safe_ctx)


def load_library() -> Tuple[Dict[str, Any], List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
    brand = load_json(CONFIG_DIR / "brand.json")
    personas = load_json(DATA_DIR / "personas.json")
    routines = load_json(DATA_DIR / "routines.json")
    formats = load_json(DATA_DIR / "formats.json")
    return brand, personas, routines, formats


def trend_brief_path(week: str) -> Path:
    return OUTPUT_DIR / week / "trend-brief.json"


def split_platforms(value: str) -> List[str]:
    platforms = [part.strip().lower() for part in value.split(",") if part.strip()]
    return platforms or ["tiktok", "instagram"]


def default_trend_patterns(week: str, market: str, platforms: List[str]) -> Dict[str, Any]:
    observed = today_iso()
    expires = (dt.date.fromisoformat(observed) + dt.timedelta(days=TREND_MAX_AGE_DAYS)).isoformat()
    platform_set = set(platforms)
    trends = [
        {
            "id": "comment-to-concept-parent-pain",
            "platform": "tiktok",
            "sourceUrls": OFFICIAL_TREND_SOURCES[:2],
            "observedDate": observed,
            "hookPattern": "Open with a blunt parent thought, then flip it into a gentler story solution.",
            "visualPattern": "Fast close-up on a tired routine moment, then a satisfying book reveal.",
            "pacingAudioNotes": "0.7s problem flash, 2s reveal, 4-8s proof sequence; use native trending audio at post time.",
            "confidence": 0.62,
            "riskFlags": ["parent-pain-hook", "needs-native-audio-selection"],
            "mirrortaleMapping": "Turn repeated reminders into a personalized story starring the child.",
            "exampleAngles": [
                "I thought bedtime was the problem. It needed a plot.",
                "When the reminder becomes a book, the fight softens.",
            ],
        },
        {
            "id": "pov-transformation-reveal",
            "platform": "instagram",
            "sourceUrls": [OFFICIAL_TREND_SOURCES[2], OFFICIAL_TREND_SOURCES[3]],
            "observedDate": observed,
            "hookPattern": "POV transformation from ordinary parent input to premium finished result.",
            "visualPattern": "Upload/photo placeholder, story details, cover, interior spread, child-safe synthetic demo badge.",
            "pacingAudioNotes": "Use a clean reveal beat; keep the first visual readable without sound.",
            "confidence": 0.58,
            "riskFlags": ["avoid-real-child-proof-without-consent"],
            "mirrortaleMapping": "Show photo + interests becoming a manually checked personalized storybook.",
            "exampleAngles": [
                "POV: a 2-minute form becomes their favorite bedtime book.",
                "From one photo to a story where they are the hero.",
            ],
        },
        {
            "id": "tiny-confession-soft-cta",
            "platform": "tiktok",
            "sourceUrls": OFFICIAL_TREND_SOURCES[:2],
            "observedDate": observed,
            "hookPattern": "Tiny confession format: admit a repeated parenting struggle, then offer a non-shaming experiment.",
            "visualPattern": "Text-led first frame, warm product shot, then routine steps inside a story world.",
            "pacingAudioNotes": "Quiet voiceover or caption-first post; end with a question prompt.",
            "confidence": 0.56,
            "riskFlags": ["keep-edgy-hook-non-shaming"],
            "mirrortaleMapping": "Position MirrorTale as a gentle rehearsal tool, not a behavior fix.",
            "exampleAngles": [
                "Tiny confession: I was tired of hearing myself repeat the same thing.",
                "No more scary lessons. Just a story they can see.",
            ],
        },
        {
            "id": "premium-gift-with-purpose",
            "platform": "instagram",
            "sourceUrls": [OFFICIAL_TREND_SOURCES[2], OFFICIAL_TREND_SOURCES[3]],
            "observedDate": observed,
            "hookPattern": "Gift idea that carries an emotional second use.",
            "visualPattern": "Elegant product close-ups, page flips, dedication, cover, delivery promise.",
            "pacingAudioNotes": "Slower premium pacing for Reels and carousel covers; use save-worthy caption.",
            "confidence": 0.53,
            "riskFlags": ["avoid-overpromising-parenting-outcomes"],
            "mirrortaleMapping": "A keepsake that also rehearses a real routine or big feeling.",
            "exampleAngles": [
                "A personalized gift that does more than sit on a shelf.",
                "The birthday gift that can become tonight's bedtime script.",
            ],
        },
    ]
    filtered = [trend for trend in trends if trend["platform"] in platform_set]
    return {
        "schema": TREND_SCHEMA,
        "week": week,
        "market": market,
        "platforms": platforms,
        "createdAt": utc_now().isoformat(),
        "observedAt": observed,
        "expiresAt": expires,
        "provider": "local_seed",
        "researchMode": "source-linked-operator-brief",
        "sourceUrls": OFFICIAL_TREND_SOURCES,
        "summary": (
            "Seeded trend brief for current-batch planning. Use the linked TikTok Creative Center, "
            "Instagram creator surfaces, and Google Trends to refresh examples before final approval."
        ),
        "trends": filtered or trends,
        "guardrails": [
            "Synthetic demo children only unless documented consent exists.",
            "Use edgy hooks only for contrast, not shame.",
            "Never promise cures, therapy outcomes, or guaranteed behavior change.",
            "Select native trending audio manually at posting time.",
        ],
    }


def parse_date(value: str) -> dt.date:
    return dt.date.fromisoformat(value[:10])


def validate_trend_brief(brief: Dict[str, Any], allow_stale: bool = False, today: Optional[dt.date] = None) -> None:
    if brief.get("schema") != TREND_SCHEMA:
        raise ValueError(f"Trend brief schema must be {TREND_SCHEMA}.")
    trends = brief.get("trends")
    if not isinstance(trends, list) or not trends:
        raise ValueError("Trend brief must include at least one trend.")
    observed = parse_date(str(brief.get("observedAt") or trends[0].get("observedDate") or ""))
    today = today or utc_now().date()
    age = (today - observed).days
    if age > TREND_MAX_AGE_DAYS and not allow_stale:
        raise ValueError(
            f"Trend brief is {age} days old. Run `scout` again or pass --allow-stale-trends."
        )
    for index, trend in enumerate(trends, start=1):
        missing = [
            key
            for key in ("id", "platform", "hookPattern", "visualPattern", "pacingAudioNotes", "mirrortaleMapping")
            if not trend.get(key)
        ]
        if missing:
            raise ValueError(f"Trend {index} is missing required fields: {', '.join(missing)}")
        urls = trend.get("sourceUrls")
        if not isinstance(urls, list) or not any(str(url).startswith("http") for url in urls):
            raise ValueError(f"Trend {trend.get('id', index)} must include at least one source URL.")


def load_trend_brief(path: Path, allow_stale: bool = False) -> Dict[str, Any]:
    brief = load_json(path)
    validate_trend_brief(brief, allow_stale=allow_stale)
    return brief


def extract_json_payload(text: str) -> Any:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?", "", text).strip()
        text = re.sub(r"```$", "", text).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"(\{.*\}|\[.*\])", text, flags=re.S)
        if match:
            return json.loads(match.group(1))
        raise


def openai_responses_text(prompt: str, model: Optional[str] = None, use_web_search: bool = False) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")
    payload: Dict[str, Any] = {
        "model": model or openai_text_model(),
        "input": prompt,
        "temperature": 0.7,
    }
    if use_web_search:
        payload["tools"] = [{"type": "web_search_preview"}]
    request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=180) as response:
        parsed = json.loads(response.read().decode("utf-8"))
    if parsed.get("output_text"):
        return str(parsed["output_text"])
    chunks: List[str] = []
    for item in parsed.get("output", []):
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"} and content.get("text"):
                chunks.append(str(content["text"]))
    if chunks:
        return "\n".join(chunks)
    raise RuntimeError("OpenAI response did not include text output.")


def scout_with_openai(week: str, market: str, platforms: List[str]) -> Dict[str, Any]:
    prompt = f"""
You are researching current short-form social creative patterns for MirrorTale, a premium personalized children's book brand.

Return JSON only using this schema:
{{
  "summary": "one paragraph",
  "trends": [
    {{
      "id": "lowercase-hyphen-id",
      "platform": "tiktok or instagram",
      "sourceUrls": ["https://..."],
      "observedDate": "{today_iso()}",
      "hookPattern": "current hook pattern",
      "visualPattern": "current visual pattern",
      "pacingAudioNotes": "timing/audio/editing notes",
      "confidence": 0.0,
      "riskFlags": ["short flags"],
      "mirrortaleMapping": "how MirrorTale should adapt it safely",
      "exampleAngles": ["safe example hook 1", "safe example hook 2"]
    }}
  ]
}}

Market: {market}
Platforms: {', '.join(platforms)}
Brand constraints: synthetic child demos only, no shaming, no therapy/cure/guarantee claims, no real customer child content without consent.
Look for patterns, not posts to copy. Prefer source links from TikTok Creative Center, Instagram creator/professional resources, Google Trends, or current credible marketing coverage.
"""
    text = openai_responses_text(prompt, use_web_search=True)
    payload = extract_json_payload(text)
    trends = payload.get("trends") if isinstance(payload, dict) else payload
    if not isinstance(trends, list) or not trends:
        raise RuntimeError("OpenAI scout did not return trend entries.")
    observed = today_iso()
    brief = {
        "schema": TREND_SCHEMA,
        "week": week,
        "market": market,
        "platforms": platforms,
        "createdAt": utc_now().isoformat(),
        "observedAt": observed,
        "expiresAt": (dt.date.fromisoformat(observed) + dt.timedelta(days=TREND_MAX_AGE_DAYS)).isoformat(),
        "provider": "openai_web_search",
        "model": openai_text_model(),
        "researchMode": "live-web-search",
        "sourceUrls": OFFICIAL_TREND_SOURCES,
        "summary": payload.get("summary", "") if isinstance(payload, dict) else "",
        "trends": trends,
        "guardrails": default_trend_patterns(week, market, platforms)["guardrails"],
    }
    validate_trend_brief(brief)
    return brief


def scout_trends(args: argparse.Namespace) -> Path:
    week = args.week or current_week()
    platforms = split_platforms(args.platforms)
    provider = args.provider
    brief: Dict[str, Any]
    if provider in {"auto", "openai"} and os.environ.get("OPENAI_API_KEY"):
        try:
            brief = scout_with_openai(week, args.market, platforms)
        except Exception as error:
            if provider == "openai":
                raise
            brief = default_trend_patterns(week, args.market, platforms)
            brief["providerError"] = str(error)
    else:
        brief = default_trend_patterns(week, args.market, platforms)
    out_path = Path(args.output).resolve() if args.output else trend_brief_path(week)
    validate_trend_brief(brief)
    write_json(out_path, brief)
    print(f"Wrote trend brief: {out_path}")
    return out_path


def choose_routine(fmt: Dict[str, Any], routines: List[Dict[str, Any]], rng: random.Random, index: int) -> Dict[str, Any]:
    by_key = {routine["key"]: routine for routine in routines}
    recommended = [by_key[key] for key in fmt.get("recommendedRoutines", []) if key in by_key]
    pool = recommended or routines
    return pool[index % len(pool)] if index < len(pool) else rng.choice(pool)


def make_context(
    brand: Dict[str, Any],
    persona: Dict[str, Any],
    routine: Dict[str, Any],
    concept_id: str,
    platform: str,
) -> Dict[str, Any]:
    book_title = f"{persona['childName']} and the {routine['bookNoun']}"
    platform_config = brand["platforms"][platform]
    utm_campaign = "organic_routine_storybooks"
    utm_content = concept_id
    bio_url = (
        f"{brand['bioUrlBase']}?utm_source={platform_config['utmSource']}"
        f"&utm_medium=organic_social&utm_campaign={utm_campaign}"
        f"&utm_content={utm_content}&creative_id={concept_id}#intake"
    )
    return {
        "brand": brand["brandName"],
        "price": brand["price"],
        "delivery": brand["delivery"],
        "cta": brand["cta"],
        "child_name": persona["childName"],
        "age": persona["age"],
        "pronoun": persona["pronoun"],
        "possessive": persona["possessive"],
        "parent_role": persona["parentRole"],
        "favorite": persona["favorite"],
        "setting": persona["setting"],
        "look": persona["look"],
        "family_context": persona["familyContext"],
        "routine_label": routine["label"],
        "parent_pain": routine["parentPain"],
        "gentle_goal": routine["gentleGoal"],
        "story_skill": routine["storySkill"],
        "safe_phrase": routine["safePhrase"],
        "practice_steps": ", ".join(routine["practiceSteps"]),
        "book_title": book_title,
        "concept_id": concept_id,
        "bio_url": bio_url,
    }


def build_image_prompt(ctx: Dict[str, Any], scene: str, slide_index: int) -> str:
    return (
        "Vertical 9:16 whimsical premium children's book marketing image. "
        f"Synthetic demo child, not a real person. Subject: {ctx['child_name']}, age {ctx['age']}, "
        f"{ctx['look']}. Setting: {ctx['setting']}. Scene: {scene}. "
        f"Routine theme: {ctx['routine_label']}. Include storybook warmth, soft natural light, "
        "high-end picture book detail, safe family-friendly mood, no text, no watermark. "
        f"Slide {slide_index} of a MirrorTale slideshow."
    )


def build_caption(brand: Dict[str, Any], fmt: Dict[str, Any], ctx: Dict[str, Any], routine: Dict[str, Any]) -> str:
    caption = format_template(fmt["captionTemplate"], ctx)
    tags = []
    tags.extend(brand["hashtags"]["core"][:4])
    tags.extend([routine["key"].replace("_", ""), "gentleparenting"])
    clean_tags = []
    for tag in tags:
        tag = re.sub(r"[^A-Za-z0-9_]", "", tag)
        if tag and tag not in clean_tags:
            clean_tags.append(tag)
    return f"{caption}\n\n" + " ".join(f"#{tag}" for tag in clean_tags)


def load_performance_memory() -> Dict[str, Any]:
    if PERFORMANCE_MEMORY_PATH.exists():
        try:
            return load_json(PERFORMANCE_MEMORY_PATH)
        except json.JSONDecodeError:
            pass
    return {
        "schema": "mirrortale.performance_memory.v1",
        "updatedAt": None,
        "creatives": {},
        "patterns": {},
    }


def save_performance_memory(memory: Dict[str, Any]) -> None:
    memory["updatedAt"] = utc_now().isoformat()
    write_json(PERFORMANCE_MEMORY_PATH, memory)


def performance_key(kind: str, value: str) -> str:
    return f"{kind}:{slugify(value)}"


def memory_boost(concept: Dict[str, Any], memory: Dict[str, Any]) -> float:
    patterns = memory.get("patterns", {})
    keys = [
        performance_key("format", concept.get("formatKey", "")),
        performance_key("routine", concept.get("routineKey", "")),
        performance_key("pillar", concept.get("pillar", "")),
    ]
    for trend_ref in concept.get("trendRefs", []):
        keys.append(performance_key("trend", str(trend_ref)))
    scores = [patterns[key].get("score", 0.0) for key in keys if key in patterns]
    if not scores:
        return 0.0
    return clamp(sum(scores) / len(scores), -8.0, 12.0)


def trend_for_index(trend_brief: Dict[str, Any], index: int, platform: str) -> Dict[str, Any]:
    trends = trend_brief.get("trends") or []
    platform_trends = [trend for trend in trends if trend.get("platform") == platform]
    pool = platform_trends or trends
    return pool[index % len(pool)] if pool else {}


def local_strategy_for(
    fmt: Dict[str, Any],
    trend: Dict[str, Any],
    ctx: Dict[str, Any],
    index: int,
    risk_lane: str,
) -> Dict[str, Any]:
    edgy_hooks = [
        "I thought {routine_label} was the problem. It needed a plot.",
        "Your hardest 10 minutes of the day, but make it a story.",
        "Tiny confession: I was tired of repeating the same reminder.",
        "The parenting reminder I wish came as a picture book.",
        "POV: {child_name} becomes the hero of the routine you keep repeating.",
        "The routine hack is not a hack. It is rehearsal.",
    ]
    gentle_hooks = [
        fmt["hookTemplate"],
        "What if {routine_label} felt familiar before it began?",
        "Turn {routine_label} into a story your child can see.",
    ]
    hooks = edgy_hooks if risk_lane == "edgy-safe" else gentle_hooks
    hook_template = hooks[index % len(hooks)]
    return {
        "provider": "local_strategy",
        "hookTemplate": hook_template,
        "hypothesis": (
            f"{trend.get('hookPattern', fmt['title'])} can lift early retention when mapped to "
            f"{ctx['routine_label']} without shaming the child."
        ),
        "openingMove": trend.get("hookPattern", fmt["title"]),
        "visualMove": trend.get("visualPattern", "Warm product reveal with storybook proof."),
        "captionMove": "Save-worthy parent prompt with tracked CTA.",
    }


def openai_strategy_pool(
    brand: Dict[str, Any],
    routines: List[Dict[str, Any]],
    formats: List[Dict[str, Any]],
    trend_brief: Dict[str, Any],
    count: int,
    risk_lane: str,
) -> List[Dict[str, Any]]:
    if not os.environ.get("OPENAI_API_KEY"):
        return []
    prompt = {
        "task": "Create MirrorTale short-form strategy variants as JSON only.",
        "brand": brand,
        "routine_labels": [routine["label"] for routine in routines],
        "format_titles": [fmt["title"] for fmt in formats],
        "trend_brief": trend_brief,
        "count": min(count, 40),
        "risk_lane": risk_lane,
        "rules": [
            "Edgy means strong contrast and pattern interrupts, never shame.",
            "No cure, therapy, guaranteed behavior change, bad/naughty/unruly child language.",
            "Return concise hookTemplate strings using placeholders {child_name} and {routine_label} when useful.",
        ],
    }
    try:
        text = openai_responses_text(
            "Return JSON array of strategy objects with hookTemplate, hypothesis, openingMove, visualMove, captionMove.\n"
            + json.dumps(prompt, ensure_ascii=True),
            model=openai_text_model(),
        )
        payload = extract_json_payload(text)
        if isinstance(payload, dict):
            payload = payload.get("strategies", [])
        return [item for item in payload if isinstance(item, dict)]
    except Exception:
        return []


def build_video_prompt(concept: Dict[str, Any], trend: Dict[str, Any]) -> str:
    slide_beats = "; ".join(
        f"{slide['index']}. {slide['headline']} - {slide['scene']}" for slide in concept.get("slides", [])[:4]
    )
    return (
        "Vertical 9:16 short-form ad video for a premium personalized children's book brand. "
        "Synthetic demo family only, no real child identity, no text burned into generated footage. "
        f"Hook: {concept['hook']}. Trend pattern: {trend.get('visualPattern', '')}. "
        f"Story beats: {slide_beats}. Show a warm routine moment, a personalized storybook reveal, "
        "premium picture-book pages, parent-child reading warmth, and a clear emotional transformation. "
        "Keep it family-safe, gentle, cinematic, and suitable for TikTok/Reels."
    )


def estimate_cost(model_plan: Dict[str, Any], media_plan: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "currency": "USD",
        "mode": "rough_placeholder",
        "imageScenes": len(media_plan.get("imagePrompts", [])),
        "fastVideoSeconds": media_plan.get("fastVideoSeconds", 0),
        "finalVideoSeconds": media_plan.get("finalVideoSeconds", 0),
        "note": "Use provider calculators for exact price before high-volume generation.",
    }


def score_concept(concept: Dict[str, Any], brand: Dict[str, Any], trend: Dict[str, Any], memory: Dict[str, Any]) -> Dict[str, float]:
    text = " ".join(
        [
            concept.get("hook", ""),
            concept.get("caption", ""),
            " ".join(slide.get("headline", "") + " " + slide.get("body", "") for slide in concept.get("slides", [])),
        ]
    )
    forbidden = check_forbidden(text, brand["avoidClaims"])
    confidence = parse_float(trend.get("confidence"), 0.5)
    if confidence <= 1:
        confidence *= 100
    hook = concept.get("hook", "").lower()
    virality = 42 + confidence * 0.32
    if any(marker in hook for marker in ["pov", "tiny confession", "i thought", "hardest", "wish", "hack"]):
        virality += 12
    if "?" in hook:
        virality += 4
    if concept.get("platform") == "tiktok":
        virality += 3
    conversion = 48
    if concept.get("pillar") in {"personalization_magic", "proof_quality", "privacy_trust"}:
        conversion += 10
    if concept.get("routineKey") in {"bedtime", "potty_training", "toothbrushing", "separation"}:
        conversion += 8
    if "photo" in text.lower() or "hero" in text.lower():
        conversion += 6
    brand_fit = 88
    risk = 18 if concept.get("riskLane") == "edgy-safe" else 8
    risk += len(trend.get("riskFlags", [])) * 3
    if forbidden:
        brand_fit -= 65
        risk += 70
    boost = memory_boost(concept, memory)
    virality += boost
    conversion += boost * 0.6
    rank = virality * 0.46 + conversion * 0.28 + brand_fit * 0.22 - risk * 0.18
    return {
        "viralityScore": round(clamp(virality), 1),
        "conversionScore": round(clamp(conversion), 1),
        "brandFitScore": round(clamp(brand_fit), 1),
        "riskScore": round(clamp(risk), 1),
        "rankScore": round(clamp(rank), 1),
    }


def build_concept(
    brand: Dict[str, Any],
    personas: List[Dict[str, Any]],
    routines: List[Dict[str, Any]],
    formats: List[Dict[str, Any]],
    week: str,
    index: int,
    rng: random.Random,
    trend_brief: Optional[Dict[str, Any]] = None,
    strategy_pool: Optional[List[Dict[str, Any]]] = None,
    risk_lane: str = "edgy-safe",
    memory: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    fmt = formats[index % len(formats)]
    routine = choose_routine(fmt, routines, rng, index)
    persona = personas[(index * 5 + rng.randrange(len(personas))) % len(personas)]
    concept_id = f"mt-{week.lower().replace('-', '')}-{index + 1:03d}"
    platform = "tiktok" if index % 2 == 0 else "instagram"
    ctx = make_context(brand, persona, routine, concept_id, platform)
    trend = trend_for_index(trend_brief or {"trends": []}, index, platform)
    strategy_pool = strategy_pool or []
    strategy = strategy_pool[index % len(strategy_pool)] if strategy_pool else local_strategy_for(fmt, trend, ctx, index, risk_lane)
    hook_template = strategy.get("hookTemplate") or fmt["hookTemplate"]
    hook = format_template(hook_template, ctx)
    slides = []

    for slide_index, slide in enumerate(fmt["slides"], start=1):
        headline = format_template(slide["headline"], ctx)
        body = format_template(slide["body"], ctx)
        scene = format_template(slide["scene"], ctx)
        slides.append(
            {
                "index": slide_index,
                "headline": headline,
                "body": body,
                "scene": scene,
                "image_prompt": build_image_prompt(ctx, scene, slide_index),
                "duration_seconds": brand["visualDefaults"]["slideSeconds"],
            }
        )

    caption = build_caption(brand, fmt, ctx, routine)
    trend_ref = trend.get("id", "unscouted")
    model_plan = {
        "strategyProvider": strategy.get("provider", "openai" if strategy_pool else "local_strategy"),
        "textModel": openai_text_model(),
        "imageModel": openai_image_model(),
        "videoAuthFamily": "gemini-api-key",
        "fastVideoModel": veo_models("gemini")[0],
        "finalVideoModel": veo_models("gemini")[1],
    }
    media_plan = {
        "primaryFormat": "image_carousel",
        "aspectRatio": "9:16",
        "imagePrompts": [slide["image_prompt"] for slide in slides],
        "videoPrompt": "",
        "fastVideoSeconds": 8,
        "finalVideoSeconds": 8,
        "visualPolicy": "synthetic_demo_plus_product_assets",
        "trendVisualPattern": trend.get("visualPattern", ""),
        "pacingAudioNotes": trend.get("pacingAudioNotes", ""),
    }
    concept = {
        "id": concept_id,
        "week": week,
        "status": "draft",
        "platform": platform,
        "pillar": fmt["pillar"],
        "formatKey": fmt["key"],
        "formatTitle": fmt["title"],
        "personaKey": persona["key"],
        "routineKey": routine["key"],
        "childName": persona["childName"],
        "routineLabel": routine["label"],
        "bookTitle": ctx["book_title"],
        "hook": hook,
        "caption": caption,
        "cta": brand["cta"],
        "hypothesis": strategy.get("hypothesis", ""),
        "riskLane": risk_lane,
        "trendRefs": [trend_ref],
        "trendSourceUrls": trend.get("sourceUrls", []),
        "mediaPlan": media_plan,
        "modelPlan": model_plan,
        "costEstimate": estimate_cost(model_plan, media_plan),
        "utm": {
            "source": brand["platforms"][platform]["utmSource"],
            "medium": "organic_social",
            "campaign": "organic_routine_storybooks",
            "content": concept_id,
            "creative_id": concept_id,
            "url": ctx["bio_url"],
        },
        "compliance": {
            "visualSource": "synthetic_demo",
            "claimsMode": "routine_support_not_therapy",
            "aiDisclosure": "Use platform AI/synthetic label when visuals are AI-generated or realistic.",
            "forbiddenPublicAngle": "Do not say fix bad behavior, naughty, unruly, cure, therapy, or guaranteed.",
        },
        "slides": slides,
        "export": {},
    }
    concept["mediaPlan"]["videoPrompt"] = build_video_prompt(concept, trend)
    concept.update(score_concept(concept, brand, trend, memory or load_performance_memory()))
    return concept


def assign_schedule(batch: Dict[str, Any], brand: Dict[str, Any]) -> None:
    start = parse_week_start(batch["week"])
    times = brand["schedule"]["dailyTimes"]
    timezone = brand["schedule"]["timezone"]
    weekly_slots = 7 * len(times)
    for index, concept in enumerate(batch["concepts"]):
        if index >= weekly_slots:
            concept["status"] = "reserve"
            concept["scheduledFor"] = None
            concept["timezone"] = timezone
            continue
        day = start + dt.timedelta(days=index // len(times))
        time = times[index % len(times)]
        concept["scheduledFor"] = f"{day.isoformat()}T{time}:00"
        concept["timezone"] = timezone


def generate_batch(args: argparse.Namespace) -> Path:
    brand, personas, routines, formats = load_library()
    week = args.week or current_week()
    trend_path = Path(args.trend_brief).resolve() if getattr(args, "trend_brief", None) else trend_brief_path(week)
    if not trend_path.exists():
        raise RuntimeError(f"Missing trend brief. Run `scout --week {week}` first.")
    trend_brief = load_trend_brief(trend_path, allow_stale=getattr(args, "allow_stale_trends", False))
    memory = load_performance_memory()
    rng = random.Random(args.seed or stable_int(week, str(args.count)))
    strategy_pool: List[Dict[str, Any]] = []
    provider = getattr(args, "strategy_provider", "auto")
    if provider in {"auto", "openai"}:
        strategy_pool = openai_strategy_pool(
            brand,
            routines,
            formats,
            trend_brief,
            args.count,
            getattr(args, "risk_lane", "edgy-safe"),
        )
        for strategy in strategy_pool:
            strategy.setdefault("provider", "openai")
        if provider == "openai" and not strategy_pool:
            raise RuntimeError("OpenAI strategy generation failed or returned no strategies.")
    concepts = [
        build_concept(
            brand,
            personas,
            routines,
            formats,
            week,
            i,
            rng,
            trend_brief=trend_brief,
            strategy_pool=strategy_pool,
            risk_lane=getattr(args, "risk_lane", "edgy-safe"),
            memory=memory,
        )
        for i in range(args.count)
    ]
    concepts = sorted(concepts, key=lambda item: (-float(item.get("rankScore", 0)), item["id"]))
    batch = {
        "schema": BATCH_SCHEMA,
        "week": week,
        "createdAt": utc_now().isoformat(),
        "goal": "Generate review-gated, trend-aware TikTok and Instagram assets for MirrorTale.",
        "postingCadence": "3 per day",
        "trendBrief": str(trend_path.relative_to(ROOT)).replace("\\", "/") if trend_path.is_relative_to(ROOT) else str(trend_path),
        "strategyProvider": "openai" if strategy_pool else "local_strategy",
        "riskLane": getattr(args, "risk_lane", "edgy-safe"),
        "concepts": concepts,
    }
    assign_schedule(batch, brand)
    out_dir = OUTPUT_DIR / week
    batch_path = out_dir / "batch.json"
    write_json(batch_path, batch)
    write_review_brief(out_dir, batch)
    print(f"Generated {len(concepts)} concepts: {batch_path}")
    return batch_path


def write_review_brief(out_dir: Path, batch: Dict[str, Any]) -> None:
    lines = [
        f"# MirrorTale Weekly Batch {batch['week']}",
        "",
        "Review the ranked concepts, approve the best assets, and post with the tracked links.",
        "",
        "| Rank | ID | Platform | Viral | Conv | Risk | Routine | Hook | Scheduled |",
        "| --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |",
    ]
    for rank, concept in enumerate(batch["concepts"], start=1):
        lines.append(
            "| {rank} | {id} | {platform} | {viral} | {conv} | {risk} | {routine} | {hook} | {scheduled} |".format(
                rank=rank,
                id=concept["id"],
                platform=concept["platform"],
                viral=concept.get("viralityScore", ""),
                conv=concept.get("conversionScore", ""),
                risk=concept.get("riskScore", ""),
                routine=concept["routineLabel"],
                hook=concept["hook"].replace("|", "/"),
                scheduled=concept["scheduledFor"],
            )
        )
    (out_dir / "review-brief.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def hex_to_rgb(value: str) -> Tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


PALETTES = [
    ("#17223B", "#F8C76C", "#F5F0E8", "#6DAA9F"),
    ("#263B3E", "#E8A15E", "#FFF7EA", "#C96868"),
    ("#40314F", "#F1C36D", "#F7F2F9", "#76A5AF"),
    ("#1F3148", "#E9B872", "#F4F8FB", "#D77A61"),
    ("#24382F", "#F2C66D", "#F7F4EA", "#7F9F80"),
]


def find_font(candidates: Iterable[str], size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size=size)
            except OSError:
                continue
    try:
        return ImageFont.truetype("arial.ttf", size=size)
    except OSError:
        return ImageFont.load_default()


def font_stack(size: int, bold: bool = False, serif: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    windows = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
    if serif:
        candidates = [windows / "georgiab.ttf", windows / "georgia.ttf"]
    elif bold:
        candidates = [windows / "arialbd.ttf", windows / "seguisb.ttf", windows / "segoeuib.ttf"]
    else:
        candidates = [windows / "arial.ttf", windows / "segoeui.ttf"]
    return find_font([str(path) for path in candidates], size)


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> Tuple[int, int]:
    if not text:
        return 0, 0
    box = draw.multiline_textbbox((0, 0), text, font=font, spacing=8)
    return box[2] - box[0], box[3] - box[1]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> str:
    words = text.split()
    lines: List[str] = []
    line = ""
    for word in words:
        candidate = word if not line else f"{line} {word}"
        if text_size(draw, candidate, font)[0] <= max_width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return "\n".join(lines)


def draw_gradient(image: Image.Image, top: Tuple[int, int, int], bottom: Tuple[int, int, int]) -> None:
    draw = ImageDraw.Draw(image)
    width, height = image.size
    for y in range(height):
        t = y / max(1, height - 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        draw.line([(0, y), (width, y)], fill=color)


def rounded(draw: ImageDraw.ImageDraw, xy: Tuple[int, int, int, int], radius: int, fill: Any, outline: Any = None, width: int = 1) -> None:
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def crop_cover(source: Image.Image, size: Tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    source = source.convert("RGB")
    ratio = max(target_w / source.width, target_h / source.height)
    resized = source.resize((int(source.width * ratio), int(source.height * ratio)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - target_w) // 2)
    top = max(0, (resized.height - target_h) // 2)
    return resized.crop((left, top, left + target_w, top + target_h))


def paste_rounded(canvas: Image.Image, image: Image.Image, box: Tuple[int, int, int, int], radius: int) -> None:
    x1, y1, x2, y2 = box
    image = crop_cover(image, (x2 - x1, y2 - y1))
    mask = Image.new("L", image.size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle((0, 0, image.width, image.height), radius=radius, fill=255)
    canvas.paste(image, (x1, y1), mask)


def draw_storybook_art(
    canvas: Image.Image,
    draw: ImageDraw.ImageDraw,
    box: Tuple[int, int, int, int],
    concept: Dict[str, Any],
    slide: Dict[str, Any],
    palette: Tuple[str, str, str, str],
    scene_asset: Optional[Path] = None,
) -> None:
    x1, y1, x2, y2 = box
    navy, gold, paper, accent = [hex_to_rgb(color) for color in palette]
    w = x2 - x1
    h = y2 - y1
    if scene_asset and scene_asset.exists():
        with Image.open(scene_asset) as scene_image:
            paste_rounded(canvas, scene_image, box, 40)
        overlay = Image.new("RGBA", (w, h), (255, 250, 238, 72))
        mask = Image.new("L", (w, h), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle((0, 0, w, h), radius=40, fill=255)
        canvas.paste(overlay, (x1, y1), mask)
        draw.rounded_rectangle(box, radius=40, outline=gold, width=4)
    else:
        rounded(draw, box, 40, tuple(min(255, c + 8) for c in paper), outline=gold, width=4)

    # Open book
    book_y = y1 + int(h * 0.38)
    book_h = int(h * 0.34)
    left = (x1 + int(w * 0.14), book_y, x1 + int(w * 0.50), book_y + book_h)
    right = (x1 + int(w * 0.50), book_y, x1 + int(w * 0.86), book_y + book_h)
    rounded(draw, left, 22, (255, 252, 240), outline=(220, 200, 160), width=3)
    rounded(draw, right, 22, (255, 252, 240), outline=(220, 200, 160), width=3)
    draw.line((x1 + int(w * 0.50), book_y + 8, x1 + int(w * 0.50), book_y + book_h - 8), fill=(205, 184, 144), width=5)

    # Child hero head/body
    cx = x1 + int(w * 0.31)
    cy = book_y + int(book_h * 0.42)
    skin = (194, 132, 92) if stable_int(concept["personaKey"]) % 3 == 0 else (222, 172, 128)
    hair = (55, 38, 32) if stable_int(concept["personaKey"], "hair") % 2 == 0 else (118, 73, 39)
    draw.ellipse((cx - 58, cy - 72, cx + 58, cy + 44), fill=skin, outline=navy, width=3)
    draw.pieslice((cx - 70, cy - 92, cx + 70, cy + 26), 180, 360, fill=hair)
    draw.arc((cx - 25, cy - 12, cx + 25, cy + 28), 20, 160, fill=navy, width=3)
    draw.ellipse((cx - 28, cy - 18, cx - 18, cy - 8), fill=navy)
    draw.ellipse((cx + 18, cy - 18, cx + 28, cy - 8), fill=navy)
    draw.rounded_rectangle((cx - 70, cy + 46, cx + 70, cy + 150), radius=28, fill=accent, outline=navy, width=3)

    # Magical routine icons
    step_font = font_stack(25, bold=True)
    steps = [step.strip() for step in str(slide.get("body", "")).split(",") if step.strip()]
    if len(steps) < 2:
        steps = concept.get("routineLabel", "routine").split()
    for idx in range(4):
        px = x1 + int(w * (0.58 + 0.13 * (idx % 2)))
        py = book_y + int(book_h * (0.28 + 0.34 * (idx // 2)))
        draw.ellipse((px - 44, py - 44, px + 44, py + 44), fill=gold, outline=navy, width=3)
        label = str(idx + 1)
        tw, th = text_size(draw, label, step_font)
        draw.text((px - tw / 2, py - th / 2 - 2), label, font=step_font, fill=navy)

    # Top decorative moon/sparkle
    moon_x = x1 + int(w * 0.78)
    moon_y = y1 + int(h * 0.18)
    draw.ellipse((moon_x - 56, moon_y - 56, moon_x + 56, moon_y + 56), fill=gold)
    draw.ellipse((moon_x - 24, moon_y - 66, moon_x + 76, moon_y + 36), fill=tuple(min(255, c + 8) for c in paper))
    for idx in range(16):
        angle = (idx / 16) * math.tau
        sx = x1 + int(w * 0.17) + int(math.cos(angle) * (70 + idx * 3))
        sy = y1 + int(h * 0.16) + int(math.sin(angle) * (45 + idx * 2))
        draw.ellipse((sx - 4, sy - 4, sx + 4, sy + 4), fill=gold)


def render_slide_local(
    concept: Dict[str, Any],
    slide: Dict[str, Any],
    out_path: Path,
    brand: Dict[str, Any],
    scene_asset: Optional[Path] = None,
) -> None:
    width = brand["visualDefaults"]["width"]
    height = brand["visualDefaults"]["height"]
    palette = PALETTES[stable_int(concept["id"]) % len(PALETTES)]
    navy, gold, paper, accent = [hex_to_rgb(color) for color in palette]
    image = Image.new("RGB", (width, height), paper)
    draw_gradient(image, paper, tuple(max(0, c - 24) for c in paper))
    draw = ImageDraw.Draw(image)

    margin = 74
    brand_font = font_stack(42, bold=True)
    badge_font = font_stack(28, bold=True)
    headline_font = font_stack(74, bold=True, serif=True)
    body_font = font_stack(42)
    small_font = font_stack(26)

    # Header
    draw.text((margin, 58), "MirrorTale", font=brand_font, fill=navy)
    badge = brand["visualDefaults"]["syntheticBadge"]
    badge_w, badge_h = text_size(draw, badge, badge_font)
    rounded(draw, (width - margin - badge_w - 36, 56, width - margin, 56 + badge_h + 26), 24, gold)
    draw.text((width - margin - badge_w - 18, 68), badge, font=badge_font, fill=navy)

    # Art panel
    art_box = (margin, 180, width - margin, 1120)
    draw_storybook_art(image, draw, art_box, concept, slide, palette, scene_asset)

    # Copy block
    copy_box = (margin, 1170, width - margin, 1736)
    rounded(draw, copy_box, 34, (255, 252, 244), outline=(225, 207, 168), width=3)
    headline = wrap_text(draw, slide["headline"], headline_font, copy_box[2] - copy_box[0] - 72)
    body = wrap_text(draw, slide["body"], body_font, copy_box[2] - copy_box[0] - 72)
    draw.multiline_text((copy_box[0] + 36, copy_box[1] + 38), headline, font=headline_font, fill=navy, spacing=10)
    headline_h = text_size(draw, headline, headline_font)[1]
    draw.multiline_text((copy_box[0] + 36, copy_box[1] + 70 + headline_h), body, font=body_font, fill=(44, 55, 67), spacing=10)

    # Footer
    footer = f"{concept['bookTitle']} | {concept['routineLabel']}"
    footer = wrap_text(draw, footer, small_font, width - 2 * margin)
    draw.multiline_text((margin, 1790), footer, font=small_font, fill=navy, spacing=8)
    slide_num = f"{slide['index']}/{len(concept['slides'])}"
    sw, _ = text_size(draw, slide_num, small_font)
    draw.text((width - margin - sw, 1790), slide_num, font=small_font, fill=navy)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(out_path, "PNG", optimize=True)


def generate_openai_image(prompt: str, out_path: Path) -> None:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")

    payload = {
        "model": openai_image_model(),
        "prompt": prompt,
        "size": "1024x1536",
        "quality": "medium",
    }
    request = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            parsed = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI image request failed: {error.code} {detail}") from error

    data = parsed.get("data") or []
    if not data:
        raise RuntimeError("OpenAI image response did not include image data.")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    first = data[0]
    if first.get("b64_json"):
        out_path.write_bytes(base64.b64decode(first["b64_json"]))
        return
    if first.get("url"):
        with urllib.request.urlopen(first["url"], timeout=120) as response:
            out_path.write_bytes(response.read())
        return
    raise RuntimeError("OpenAI image response did not include b64_json or url data.")


def ffmpeg_executable() -> Optional[str]:
    env_path = os.environ.get("FFMPEG_PATH")
    if env_path and Path(env_path).exists():
        return env_path
    try:
        import imageio_ffmpeg  # type: ignore

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass
    try:
        completed = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True, check=False)
        if completed.returncode == 0:
            return "ffmpeg"
    except FileNotFoundError:
        pass
    return None


def write_video(slide_paths: List[Path], concept_dir: Path, concept: Dict[str, Any], brand: Dict[str, Any]) -> Optional[Path]:
    ffmpeg = ffmpeg_executable()
    if not ffmpeg:
        return None
    duration = float(brand["visualDefaults"]["slideSeconds"])
    concat_path = concept_dir / "slides.ffconcat"
    lines = ["ffconcat version 1.0"]
    for path in slide_paths:
        lines.append(f"file '{path.resolve().as_posix()}'")
        lines.append(f"duration {duration:.2f}")
    lines.append(f"file '{slide_paths[-1].resolve().as_posix()}'")
    concat_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    video_path = concept_dir / f"{concept['id']}.mp4"
    cmd = [
        ffmpeg,
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_path),
        "-vf",
        "fps=30,format=yuv420p",
        "-movflags",
        "+faststart",
        str(video_path),
    ]
    completed = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or "FFmpeg failed to render video.")
    return video_path


def ranked_concepts(batch: Dict[str, Any]) -> List[Dict[str, Any]]:
    return sorted(batch["concepts"], key=lambda item: (-float(item.get("rankScore", 0)), item["id"]))


def gemini_api_key() -> Optional[str]:
    return env_first("GEMINI_API_KEY", "GOOGLE_API_KEY")


def extract_video_uri(status: Dict[str, Any]) -> Optional[str]:
    candidates = [
        ("response", "generateVideoResponse", "generatedSamples", 0, "video", "uri"),
        ("response", "generatedVideos", 0, "video", "uri"),
        ("response", "generated_videos", 0, "video", "uri"),
    ]
    for path in candidates:
        value: Any = status
        for part in path:
            if isinstance(part, int):
                if not isinstance(value, list) or len(value) <= part:
                    value = None
                    break
                value = value[part]
            else:
                if not isinstance(value, dict) or part not in value:
                    value = None
                    break
                value = value[part]
        if isinstance(value, str) and value:
            return value
    return None


def generate_gemini_veo_video(prompt: str, out_path: Path, model: str, duration_seconds: int = 8) -> Dict[str, Any]:
    api_key = gemini_api_key()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY or GOOGLE_API_KEY is not set.")
    payload = {
        "instances": [{"prompt": prompt}],
        "parameters": {
            "aspectRatio": "9:16",
            "durationSeconds": str(duration_seconds),
        },
    }
    request = urllib.request.Request(
        f"{GEMINI_BASE_URL}/models/{model}:predictLongRunning",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "x-goog-api-key": api_key,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        operation = json.loads(response.read().decode("utf-8"))
    operation_name = operation.get("name")
    if not operation_name:
        raise RuntimeError("Gemini Veo response did not include an operation name.")
    status: Dict[str, Any] = {}
    for _ in range(90):
        status_request = urllib.request.Request(
            f"{GEMINI_BASE_URL}/{operation_name}",
            headers={"x-goog-api-key": api_key},
            method="GET",
        )
        with urllib.request.urlopen(status_request, timeout=60) as response:
            status = json.loads(response.read().decode("utf-8"))
        if status.get("done"):
            break
        import time

        time.sleep(10)
    if not status.get("done"):
        raise RuntimeError("Gemini Veo generation timed out.")
    if status.get("error"):
        raise RuntimeError("Gemini Veo generation failed: " + json.dumps(status["error"], ensure_ascii=True))
    video_uri = extract_video_uri(status)
    if not video_uri:
        raise RuntimeError("Gemini Veo status did not include a video URI.")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    download_request = urllib.request.Request(video_uri, headers={"x-goog-api-key": api_key}, method="GET")
    with urllib.request.urlopen(download_request, timeout=180) as response:
        out_path.write_bytes(response.read())
    return {"operation": operation_name, "status": "generated", "model": model, "videoUri": video_uri}


def render_veo_for_concept(
    concept: Dict[str, Any],
    concept_dir: Path,
    tier: str,
    model: str,
    strict: bool,
) -> Dict[str, Any]:
    prompt = concept.get("mediaPlan", {}).get("videoPrompt") or build_video_prompt(concept, {})
    prompt_path = concept_dir / f"veo-{tier}-prompt.txt"
    prompt_path.parent.mkdir(parents=True, exist_ok=True)
    prompt_path.write_text(prompt + "\n", encoding="utf-8")
    out_path = concept_dir / f"{concept['id']}-veo-{tier}.mp4"
    metadata = {
        "tier": tier,
        "provider": "gemini-veo",
        "model": model,
        "aspectRatio": "9:16",
        "durationSeconds": 8,
        "promptFile": prompt_path.name,
        "status": "placeholder",
        "mp4": None,
    }
    if not gemini_api_key():
        metadata["note"] = "Missing GEMINI_API_KEY or GOOGLE_API_KEY; prompt placeholder written."
        if strict:
            raise RuntimeError(metadata["note"])
        return metadata
    try:
        provider_meta = generate_gemini_veo_video(prompt, out_path, model=model, duration_seconds=8)
        metadata.update(provider_meta)
        metadata["mp4"] = out_path.name
    except Exception as error:
        metadata["status"] = "error"
        metadata["error"] = str(error)
        if strict:
            raise
    return metadata


def render_batch(args: argparse.Namespace) -> Path:
    brand, _, _, _ = load_library()
    batch_path = Path(args.batch).resolve()
    batch = load_json(batch_path)
    batch_dir = batch_path.parent
    image_limit = (
        args.image_limit
        if getattr(args, "image_limit", None) is not None
        else (args.limit if getattr(args, "limit", None) is not None else len(batch["concepts"]))
    )
    concepts_for_images = ranked_concepts(batch)[:image_limit]
    provider = args.image_provider
    rendered = 0

    for concept in concepts_for_images:
        concept_dir = batch_dir / "exports" / concept["id"]
        carousel_dir = concept_dir / "carousel"
        slide_paths: List[Path] = []
        for slide in concept["slides"]:
            slide_path = carousel_dir / f"slide-{slide['index']:02d}.png"
            if provider == "openai":
                scene_path = concept_dir / "ai-scenes" / f"scene-{slide['index']:02d}.png"
                try:
                    generate_openai_image(slide["image_prompt"], scene_path)
                    render_slide_local(concept, slide, slide_path, brand, scene_asset=scene_path)
                    slide["image_source_asset"] = str(scene_path.relative_to(batch_dir)).replace("\\", "/")
                    slide["image_provider_status"] = "generated"
                except Exception as error:
                    if getattr(args, "strict_providers", False):
                        raise
                    render_slide_local(concept, slide, slide_path, brand)
                    slide["image_provider_status"] = "fallback_local"
                    slide["image_provider_error"] = str(error)
            else:
                render_slide_local(concept, slide, slide_path, brand)
            slide["asset"] = str(slide_path.relative_to(batch_dir)).replace("\\", "/")
            slide_paths.append(slide_path)

        cover_path = concept_dir / f"{concept['id']}-cover.png"
        if slide_paths:
            cover_path.write_bytes(slide_paths[0].read_bytes())
        concept["export"] = {
            "carouselDir": str(carousel_dir.relative_to(batch_dir)).replace("\\", "/"),
            "coverImage": str(cover_path.relative_to(batch_dir)).replace("\\", "/"),
            "renderedAt": utc_now().isoformat(),
            "imageProvider": provider,
        }
        if args.video and slide_paths:
            video_path = write_video(slide_paths, concept_dir, concept, brand)
            concept["export"]["mp4"] = (
                str(video_path.relative_to(batch_dir)).replace("\\", "/") if video_path else None
            )
            if not video_path:
                concept["export"]["mp4Note"] = "FFmpeg unavailable. Install imageio-ffmpeg or set FFMPEG_PATH."
        rendered += 1

    video_provider = getattr(args, "video_provider", "none")
    if video_provider == "gemini-veo":
        fast_model, final_model = veo_models("gemini")
        for concept in ranked_concepts(batch)[: getattr(args, "fast_video_limit", 0)]:
            concept_dir = batch_dir / "exports" / concept["id"]
            concept.setdefault("export", {})
            concept["export"]["veoFast"] = render_veo_for_concept(
                concept,
                concept_dir,
                "fast",
                fast_model,
                getattr(args, "strict_providers", False),
            )
        for concept in ranked_concepts(batch)[: getattr(args, "finalist_limit", 0)]:
            concept_dir = batch_dir / "exports" / concept["id"]
            concept.setdefault("export", {})
            concept["export"]["veoFinal"] = render_veo_for_concept(
                concept,
                concept_dir,
                "final",
                final_model,
                getattr(args, "strict_providers", False),
            )

    write_json(batch_path, batch)
    write_gallery(batch_dir, batch, image_limit)
    write_dashboard(batch_dir, batch, image_limit)
    print(f"Rendered {rendered} concepts into {batch_dir / 'exports'}")
    return batch_path


def write_gallery(batch_dir: Path, batch: Dict[str, Any], limit: int) -> None:
    cards = []
    for concept in ranked_concepts(batch)[:limit]:
        cover = concept.get("export", {}).get("coverImage")
        if not cover:
            continue
        cards.append(
            f"""
      <article>
        <img src="{cover}" alt="{concept['id']} cover" />
        <h2>{concept['hook']}</h2>
        <p><strong>{concept['routineLabel']}</strong> | {concept['pillar']} | {concept['platform']} | rank {concept.get('rankScore', '')}</p>
        <p>{concept['caption']}</p>
        <code>{concept['utm']['url']}</code>
      </article>"""
        )
    html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MirrorTale Batch {batch['week']}</title>
  <style>
    body {{ margin: 0; font-family: Arial, sans-serif; background: #f4f0e8; color: #17223b; }}
    header {{ padding: 32px; background: #17223b; color: #f8c76c; }}
    main {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; padding: 24px; }}
    article {{ background: white; border: 1px solid #ddcfb5; border-radius: 8px; padding: 16px; }}
    img {{ width: 100%; border-radius: 6px; display: block; }}
    h2 {{ font-size: 20px; line-height: 1.2; }}
    p {{ line-height: 1.45; }}
    code {{ display: block; white-space: normal; overflow-wrap: anywhere; font-size: 12px; background: #f4f0e8; padding: 8px; }}
  </style>
</head>
<body>
  <header>
    <h1>MirrorTale Batch {batch['week']}</h1>
    <p>Review-gated organic slideshow concepts.</p>
  </header>
  <main>
    {''.join(cards)}
  </main>
</body>
</html>
"""
    (batch_dir / "review-gallery.html").write_text(html, encoding="utf-8")


def write_dashboard(batch_dir: Path, batch: Dict[str, Any], limit: Optional[int] = None) -> Path:
    concepts = ranked_concepts(batch)
    if limit:
        concepts = concepts[:limit]
    cards = []
    for rank, concept in enumerate(concepts, start=1):
        export = concept.get("export", {})
        cover = export.get("coverImage")
        image_html = f'<img src="{html.escape(cover)}" alt="{html.escape(concept["id"])} cover" />' if cover else "<div class=\"placeholder\">Not rendered</div>"
        trend_links = " ".join(
            f'<a href="{html.escape(url)}" target="_blank" rel="noreferrer">source</a>'
            for url in concept.get("trendSourceUrls", [])[:3]
        )
        veo_bits = []
        for key, label in (("veoFast", "Fast"), ("veoFinal", "Final")):
            if key in export:
                meta = export[key]
                status = html.escape(str(meta.get("status", "")))
                model = html.escape(str(meta.get("model", "")))
                mp4 = meta.get("mp4")
                link = f' · <a href="{html.escape(str(mp4))}">mp4</a>' if mp4 else ""
                veo_bits.append(f"{label}: {status} {model}{link}")
        cards.append(
            f"""
      <article class="card" data-id="{html.escape(concept['id'])}">
        <div class="media">{image_html}</div>
        <div class="body">
          <div class="eyebrow">#{rank} · {html.escape(concept['platform'])} · {html.escape(concept['pillar'])}</div>
          <h2>{html.escape(concept['hook'])}</h2>
          <div class="scores">
            <span>Rank {concept.get('rankScore', '')}</span>
            <span>Viral {concept.get('viralityScore', '')}</span>
            <span>Conv {concept.get('conversionScore', '')}</span>
            <span>Risk {concept.get('riskScore', '')}</span>
          </div>
          <p><strong>{html.escape(concept['routineLabel'])}</strong> · {html.escape(concept.get('riskLane', ''))}</p>
          <p>{html.escape(concept.get('hypothesis', ''))}</p>
          <p>{html.escape(concept.get('caption', ''))}</p>
          <code>{html.escape(concept['utm']['url'])}</code>
          <p class="links">{trend_links}</p>
          <p class="model">Image: {html.escape(concept.get('modelPlan', {}).get('imageModel', ''))} · Fast video: {html.escape(concept.get('modelPlan', {}).get('fastVideoModel', ''))}</p>
          <p class="model">{html.escape(' | '.join(veo_bits))}</p>
          <div class="actions">
            <button data-action="approve">Approve</button>
            <button data-action="reject">Reject</button>
            <button data-action="reserve">Reserve</button>
          </div>
        </div>
      </article>"""
        )
    doc = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MirrorTale Viral Dashboard {html.escape(batch['week'])}</title>
  <style>
    :root {{ color-scheme: light; --ink:#17223b; --paper:#f7f2ea; --line:#ddcfb5; --gold:#f0bd56; --green:#2f7d68; --red:#b54b4b; }}
    * {{ box-sizing: border-box; }}
    body {{ margin:0; font-family: Arial, sans-serif; background:var(--paper); color:var(--ink); }}
    header {{ position:sticky; top:0; z-index:2; padding:22px 28px; background:#17223b; color:#fff7e8; border-bottom:4px solid var(--gold); }}
    h1 {{ margin:0 0 6px; font-size:28px; }}
    main {{ display:grid; gap:18px; padding:22px; }}
    .card {{ display:grid; grid-template-columns:minmax(160px, 260px) 1fr; gap:18px; background:white; border:1px solid var(--line); border-radius:8px; padding:14px; }}
    .media img, .placeholder {{ width:100%; aspect-ratio:9/16; border-radius:6px; object-fit:cover; background:#efe4d2; display:grid; place-items:center; color:#7a6a55; }}
    .eyebrow {{ font-size:12px; text-transform:uppercase; letter-spacing:0; color:#6f6251; font-weight:700; }}
    h2 {{ margin:6px 0 10px; font-size:24px; line-height:1.15; }}
    p {{ line-height:1.42; margin:8px 0; }}
    code {{ display:block; white-space:normal; overflow-wrap:anywhere; padding:8px; background:#f4f0e8; border-radius:6px; font-size:12px; }}
    .scores {{ display:flex; flex-wrap:wrap; gap:8px; margin:8px 0; }}
    .scores span {{ padding:5px 8px; border-radius:999px; background:#f4f0e8; border:1px solid var(--line); font-size:12px; font-weight:700; }}
    .model, .links {{ font-size:12px; color:#6f6251; }}
    .actions {{ display:flex; gap:8px; margin-top:12px; }}
    button {{ border:1px solid var(--line); border-radius:6px; padding:8px 10px; background:#fff; color:var(--ink); font-weight:700; cursor:pointer; }}
    .card[data-decision="approve"] {{ outline:3px solid var(--green); }}
    .card[data-decision="reject"] {{ opacity:.58; outline:3px solid var(--red); }}
    .card[data-decision="reserve"] {{ outline:3px solid var(--gold); }}
    @media (max-width: 760px) {{ .card {{ grid-template-columns:1fr; }} .media {{ max-width:240px; }} }}
  </style>
</head>
<body>
  <header>
    <h1>MirrorTale Viral Dashboard {html.escape(batch['week'])}</h1>
    <div>Review-gated. Decisions are stored in this browser only; export captions/UTMs from the batch JSON.</div>
  </header>
  <main>{''.join(cards)}</main>
  <script>
    const key = "mirrortale-decisions-{html.escape(batch['week'])}";
    const saved = JSON.parse(localStorage.getItem(key) || "{{}}");
    document.querySelectorAll(".card").forEach(card => {{
      const id = card.dataset.id;
      if (saved[id]) card.dataset.decision = saved[id];
      card.addEventListener("click", event => {{
        const button = event.target.closest("button[data-action]");
        if (!button) return;
        saved[id] = button.dataset.action;
        card.dataset.decision = button.dataset.action;
        localStorage.setItem(key, JSON.stringify(saved));
      }});
    }});
  </script>
</body>
</html>
"""
    path = batch_dir / "review-dashboard.html"
    path.write_text(doc, encoding="utf-8")
    return path


def dashboard_batch(args: argparse.Namespace) -> Path:
    batch_path = Path(args.batch).resolve()
    batch = load_json(batch_path)
    path = write_dashboard(batch_path.parent, batch, args.limit)
    print(f"Wrote dashboard: {path}")
    return path


def check_forbidden(text: str, forbidden: List[str]) -> List[str]:
    lower = text.lower()
    return [term for term in forbidden if term.lower() in lower]


def qa_batch(args: argparse.Namespace) -> Path:
    brand, _, _, _ = load_library()
    batch_path = Path(args.batch).resolve()
    batch = load_json(batch_path)
    report_lines = [
        f"# QA Report - {batch['week']}",
        "",
        "| ID | Status | Rank | Risk | Notes |",
        "| --- | --- | ---: | ---: | --- |",
    ]
    metrics_path = batch_path.parent / "metrics-template.csv"
    metrics_fields = [
        "creative_id",
        "platform",
        "posted_at",
        "views",
        "impressions",
        "routine",
        "format",
        "hook",
        "3s_hold_rate",
        "avg_watch_time",
        "completion_rate",
        "swipes_or_saves",
        "shares",
        "comments",
        "profile_clicks",
        "intake_starts",
        "orders",
        "revenue_eur",
        "decision",
        "notes",
    ]

    with metrics_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=metrics_fields)
        writer.writeheader()
        limit = args.limit or len(batch["concepts"])
        for concept in batch["concepts"][:limit]:
            issues: List[str] = []
            text = " ".join(
                [
                    concept.get("hook", ""),
                    concept.get("caption", ""),
                    " ".join(slide.get("headline", "") + " " + slide.get("body", "") for slide in concept["slides"]),
                ]
            )
            forbidden = check_forbidden(text, brand["avoidClaims"])
            if forbidden:
                issues.append("Forbidden phrasing: " + ", ".join(forbidden))
            if concept["compliance"].get("visualSource") != "synthetic_demo":
                issues.append("Visual source is not synthetic_demo")
            for slide in concept["slides"]:
                if len(slide.get("headline", "")) > 84:
                    issues.append(f"Slide {slide['index']} headline may be too long")
                if len(slide.get("body", "")) > 170:
                    issues.append(f"Slide {slide['index']} body may be too long")
            if not concept.get("utm", {}).get("url"):
                issues.append("Missing tracked URL")
            if concept.get("export", {}).get("mp4") is None and args.require_video:
                issues.append("Missing MP4 export")
            if concept.get("brandFitScore", 100) < 50 or concept.get("riskScore", 0) >= 75:
                issues.append("High brand/compliance risk")
            status = "PASS" if not issues else ("BLOCKED" if forbidden else "REVIEW")
            report_lines.append(
                f"| {concept['id']} | {status} | {concept.get('rankScore', '')} | {concept.get('riskScore', '')} | "
                f"{'; '.join(issues) if issues else 'Ready for review'} |"
            )
            writer.writerow(
                {
                    "creative_id": concept["id"],
                    "platform": concept["platform"],
                    "routine": concept["routineLabel"],
                    "format": concept["formatKey"],
                    "hook": concept["hook"],
                    "decision": "pending",
                }
            )

    report_path = batch_path.parent / "qa-report.md"
    report_path.write_text("\n".join(report_lines) + "\n", encoding="utf-8")
    print(f"Wrote QA report: {report_path}")
    print(f"Wrote metrics template: {metrics_path}")
    return report_path


def score_metrics_row(row: Dict[str, Any]) -> float:
    views = parse_float(row.get("views") or row.get("impressions"))
    hold = parse_float(row.get("3s_hold_rate"))
    completion = parse_float(row.get("completion_rate"))
    saves = parse_float(row.get("swipes_or_saves") or row.get("saves"))
    shares = parse_float(row.get("shares"))
    comments = parse_float(row.get("comments"))
    clicks = parse_float(row.get("profile_clicks"))
    starts = parse_float(row.get("intake_starts"))
    orders = parse_float(row.get("orders"))
    revenue = parse_float(row.get("revenue_eur"))
    view_score = min(25.0, math.log10(max(views, 1)) * 5)
    engagement = min(25.0, saves * 0.25 + shares * 0.8 + comments * 0.35)
    funnel = min(35.0, clicks * 0.35 + starts * 2.5 + orders * 8 + revenue * 0.05)
    retention = min(25.0, hold * 0.18 + completion * 0.22)
    return round(clamp(view_score + engagement + funnel + retention, -20, 100), 2)


def update_pattern(memory: Dict[str, Any], key: str, score: float) -> None:
    if not key or key.endswith(":"):
        return
    pattern = memory.setdefault("patterns", {}).setdefault(key, {"count": 0, "score": 0.0})
    count = int(pattern.get("count", 0))
    old_score = float(pattern.get("score", 0.0))
    pattern["count"] = count + 1
    pattern["score"] = round((old_score * count + score) / (count + 1), 2)


def ingest_metrics(args: argparse.Namespace) -> Path:
    metrics_path = Path(args.metrics).resolve()
    memory = load_performance_memory()
    batch_by_id: Dict[str, Dict[str, Any]] = {}
    if getattr(args, "batch", None):
        batch = load_json(Path(args.batch).resolve())
        batch_by_id = {concept["id"]: concept for concept in batch.get("concepts", [])}
    with metrics_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            creative_id = (row.get("creative_id") or row.get("id") or "").strip()
            if not creative_id:
                continue
            score = score_metrics_row(row)
            creative = memory.setdefault("creatives", {}).setdefault(creative_id, {"history": []})
            creative["latestScore"] = score
            creative["latestMetrics"] = row
            creative["history"].append({"ingestedAt": utc_now().isoformat(), "score": score, "metrics": row})
            concept = batch_by_id.get(creative_id, {})
            update_pattern(memory, performance_key("format", row.get("format") or concept.get("formatKey", "")), score)
            update_pattern(memory, performance_key("routine", row.get("routine") or concept.get("routineKey", "")), score)
            update_pattern(memory, performance_key("pillar", concept.get("pillar", "")), score)
            for trend_ref in concept.get("trendRefs", []):
                update_pattern(memory, performance_key("trend", str(trend_ref)), score)
    save_performance_memory(memory)
    print(f"Updated performance memory: {PERFORMANCE_MEMORY_PATH}")
    return PERFORMANCE_MEMORY_PATH


def all_steps(args: argparse.Namespace) -> None:
    trend_path = Path(args.trend_brief).resolve() if getattr(args, "trend_brief", None) else trend_brief_path(args.week)
    if not trend_path.exists():
        scout_args = argparse.Namespace(
            week=args.week,
            market=getattr(args, "market", "english-global"),
            platforms=getattr(args, "platforms", "tiktok,instagram"),
            provider=getattr(args, "scout_provider", "auto"),
            output=str(trend_path),
        )
        scout_trends(scout_args)
    args.trend_brief = str(trend_path)
    batch_path = generate_batch(args)
    render_args = argparse.Namespace(
        batch=str(batch_path),
        limit=args.render_limit,
        image_limit=getattr(args, "image_limit", None),
        video=args.video,
        image_provider=args.image_provider,
        video_provider=getattr(args, "video_provider", "none"),
        fast_video_limit=getattr(args, "fast_video_limit", 0),
        finalist_limit=getattr(args, "finalist_limit", 0),
        strict_providers=getattr(args, "strict_providers", False),
    )
    render_batch(render_args)
    qa_args = argparse.Namespace(batch=str(batch_path), require_video=args.video, limit=args.render_limit or args.count)
    qa_batch(qa_args)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="MirrorTale organic social factory")
    sub = parser.add_subparsers(dest="command", required=True)

    scout = sub.add_parser("scout", help="Create a fresh trend brief for the week")
    scout.add_argument("--week", default=current_week())
    scout.add_argument("--market", default="english-global")
    scout.add_argument("--platforms", default="tiktok,instagram")
    scout.add_argument("--provider", choices=["auto", "openai", "local"], default="auto")
    scout.add_argument("--output", default=None)
    scout.set_defaults(func=scout_trends)

    generate = sub.add_parser("generate", help="Generate a weekly concept manifest")
    generate.add_argument("--week", default=current_week())
    generate.add_argument("--count", type=int, default=80)
    generate.add_argument("--seed", type=int, default=None)
    generate.add_argument("--trend-brief", default=None)
    generate.add_argument("--allow-stale-trends", action="store_true")
    generate.add_argument("--risk-lane", choices=["edgy-safe", "conservative"], default="edgy-safe")
    generate.add_argument("--strategy-provider", choices=["auto", "openai", "local"], default="auto")
    generate.set_defaults(func=generate_batch)

    render = sub.add_parser("render", help="Render carousel slides and optional MP4s")
    render.add_argument("--batch", required=True)
    render.add_argument("--limit", type=int, default=None)
    render.add_argument("--image-limit", type=int, default=None)
    render.add_argument("--video", action="store_true")
    render.add_argument("--image-provider", choices=["local", "openai"], default="local")
    render.add_argument("--video-provider", choices=["none", "gemini-veo"], default="none")
    render.add_argument("--fast-video-limit", type=int, default=0)
    render.add_argument("--finalist-limit", type=int, default=0)
    render.add_argument("--strict-providers", action="store_true")
    render.set_defaults(func=render_batch)

    qa = sub.add_parser("qa", help="Run child-safety and claim QA")
    qa.add_argument("--batch", required=True)
    qa.add_argument("--require-video", action="store_true")
    qa.add_argument("--limit", type=int, default=None)
    qa.set_defaults(func=qa_batch)

    dashboard = sub.add_parser("dashboard", help="Write the local review dashboard")
    dashboard.add_argument("--batch", required=True)
    dashboard.add_argument("--limit", type=int, default=None)
    dashboard.set_defaults(func=dashboard_batch)

    metrics = sub.add_parser("ingest-metrics", help="Ingest manual platform performance metrics")
    metrics.add_argument("--metrics", required=True)
    metrics.add_argument("--batch", default=None)
    metrics.set_defaults(func=ingest_metrics)

    all_cmd = sub.add_parser("all", help="Generate, render, and QA in one pass")
    all_cmd.add_argument("--week", default=current_week())
    all_cmd.add_argument("--count", type=int, default=80)
    all_cmd.add_argument("--render-limit", type=int, default=None)
    all_cmd.add_argument("--image-limit", type=int, default=24)
    all_cmd.add_argument("--seed", type=int, default=None)
    all_cmd.add_argument("--trend-brief", default=None)
    all_cmd.add_argument("--allow-stale-trends", action="store_true")
    all_cmd.add_argument("--market", default="english-global")
    all_cmd.add_argument("--platforms", default="tiktok,instagram")
    all_cmd.add_argument("--scout-provider", choices=["auto", "openai", "local"], default="auto")
    all_cmd.add_argument("--risk-lane", choices=["edgy-safe", "conservative"], default="edgy-safe")
    all_cmd.add_argument("--strategy-provider", choices=["auto", "openai", "local"], default="auto")
    all_cmd.add_argument("--video", dest="video", action="store_true", default=True)
    all_cmd.add_argument("--no-video", dest="video", action="store_false")
    all_cmd.add_argument("--image-provider", choices=["local", "openai"], default="local")
    all_cmd.add_argument("--video-provider", choices=["none", "gemini-veo"], default="none")
    all_cmd.add_argument("--fast-video-limit", type=int, default=8)
    all_cmd.add_argument("--finalist-limit", type=int, default=2)
    all_cmd.add_argument("--strict-providers", action="store_true")
    all_cmd.set_defaults(func=all_steps)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        result = args.func(args)
        if isinstance(result, Path):
            return 0
        return 0
    except Exception as error:
        print(f"error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
