# MirrorTale Marketing Automation

This folder is a local content factory for organic TikTok and Instagram posts.
It generates review-gated, trend-aware weekly batches for personalized
storybook marketing, with a special focus on gentle routine-support angles such as bedtime,
potty training, toothbrushing, sharing, tantrums, morning routines,
separation anxiety, screen-time transitions, and listening.

The system is intentionally manifest-first:

- `config/brand.json` defines MirrorTale voice, CTA, claims, and compliance rules.
- `data/personas.json` defines reusable synthetic demo children and parent contexts.
- `data/routines.json` defines routine-support angles and safe phrasing.
- `data/formats.json` defines repeatable short-video and slideshow formats.
- `scripts/social_factory.py` scouts trends, generates scored concepts, renders
  images/videos, writes the review dashboard, ingests metrics, and runs QA.

Generated batches go to `marketing-automation/output/` and are ignored by git.

## Quick Start

Use the bundled Codex Python runtime or any Python with Pillow installed:

```powershell
python marketing-automation/scripts/social_factory.py scout --week 2026-W22 --market english-global --platforms tiktok,instagram
python marketing-automation/scripts/social_factory.py all --week 2026-W22 --count 80 --image-limit 24
```

Useful commands:

```powershell
python marketing-automation/scripts/social_factory.py generate --week 2026-W22 --trend-brief marketing-automation/output/2026-W22/trend-brief.json --count 80 --risk-lane edgy-safe
python marketing-automation/scripts/social_factory.py render --batch marketing-automation/output/2026-W22/batch.json --image-provider openai --video-provider gemini-veo --image-limit 24 --fast-video-limit 8 --finalist-limit 2
python marketing-automation/scripts/social_factory.py dashboard --batch marketing-automation/output/2026-W22/batch.json
python marketing-automation/scripts/social_factory.py qa --batch marketing-automation/output/2026-W22/batch.json
python marketing-automation/scripts/social_factory.py ingest-metrics --metrics marketing-automation/output/2026-W22/metrics-template.csv --batch marketing-automation/output/2026-W22/batch.json
```

## OpenAI Image Generation

By default, the renderer creates clean local storyboard slides so you can review
concepts immediately. Each slide also includes an `image_prompt` in the batch
manifest for AI image generation.

When `OPENAI_API_KEY` is configured, individual slides can be generated through
the optional OpenAI provider. The generated scene image is placed inside the
same branded slide layout, so text, badges, UTMs, and review metadata stay
consistent:

```powershell
$env:OPENAI_API_KEY="..."
python marketing-automation/scripts/social_factory.py render --batch marketing-automation/output/2026-W20/batch.json --image-provider openai --limit 3
```

The image model defaults to `gpt-image-2` and can be overridden with
`OPENAI_IMAGE_MODEL`. Strategy generation defaults to `OPENAI_TEXT_MODEL`
or `gpt-5.4-mini`.

## Gemini Veo Video Generation

For rapid 9:16 TikTok/Reel experiments, set `GEMINI_API_KEY` or
`GOOGLE_API_KEY` and render with:

```powershell
python marketing-automation/scripts/social_factory.py render --batch marketing-automation/output/2026-W22/batch.json --video-provider gemini-veo --fast-video-limit 8 --finalist-limit 2
```

Gemini API defaults:

- `VEO_FAST_MODEL=veo-3.1-fast-generate-preview`
- `VEO_FINAL_MODEL=veo-3.1-generate-preview`

If the engine moves to Vertex AI credentials later, use the Vertex aliases
`veo-3.1-fast-generate-001` and `veo-3.1-generate-001` through the same
environment variables.

Without provider keys, the renderer writes prompts and local placeholders
instead of failing unless `--strict-providers` is passed.

The safest production workflow is still review-gated: generate assets, inspect
the dashboard, approve the best candidates, then schedule or post manually/native.

## Posting Rhythm

Default schedule: 3 posts per day at 08:00, 13:00, and 20:30 Europe/Brussels.

Recommended rotation:

- Routine support
- Emotional gift
- Proof and quality
- Privacy and trust
- Personalization magic

## Guardrails

Do:

- Say "help your child practice a routine."
- Say "turn the lesson into a story."
- Say "rehearse expectations in a warm, familiar way."
- Mark generated child/family visuals as synthetic demos.

Do not:

- Promise cures, guaranteed behavior change, therapy outcomes, or diagnosis help.
- Publicly call a child "bad," "naughty," or "unruly."
- Use real customer child content without documented consent.
- Repost duplicate templates without changing hook, persona, routine, and visuals.
