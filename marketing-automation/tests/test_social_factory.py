import datetime as dt
import importlib.util
import os
import unittest
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[2]
MODULE_PATH = ROOT / "marketing-automation" / "scripts" / "social_factory.py"
spec = importlib.util.spec_from_file_location("social_factory", MODULE_PATH)
social_factory = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(social_factory)


class SocialFactoryTests(unittest.TestCase):
    def test_validate_trend_brief_rejects_stale_sources(self):
        brief = social_factory.default_trend_patterns("2026-W22", "english-global", ["tiktok"])
        old_date = (dt.date.today() - dt.timedelta(days=12)).isoformat()
        brief["observedAt"] = old_date
        for trend in brief["trends"]:
            trend["observedDate"] = old_date

        with self.assertRaises(ValueError):
            social_factory.validate_trend_brief(brief, today=dt.date.today())

    def test_forbidden_claim_blocking(self):
        brand, _, _, _ = social_factory.load_library()
        text = "This guaranteed therapy book will cure bad behavior."
        forbidden = social_factory.check_forbidden(text, brand["avoidClaims"])

        self.assertIn("guaranteed", forbidden)
        self.assertIn("therapy", forbidden)
        self.assertIn("cure", forbidden)

    def test_provider_model_defaults_for_gemini_and_vertex(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertEqual(
                social_factory.veo_models("gemini"),
                ("veo-3.1-fast-generate-preview", "veo-3.1-generate-preview"),
            )
            self.assertEqual(
                social_factory.veo_models("vertex"),
                ("veo-3.1-fast-generate-001", "veo-3.1-generate-001"),
            )

    def test_utm_generation_uses_creative_id(self):
        brand, personas, routines, _ = social_factory.load_library()
        ctx = social_factory.make_context(brand, personas[0], routines[0], "mt-test-001", "tiktok")

        self.assertIn("utm_source=tiktok", ctx["bio_url"])
        self.assertIn("creative_id=mt-test-001", ctx["bio_url"])
        self.assertTrue(ctx["bio_url"].endswith("#intake"))

    def test_ranked_concepts_orders_by_rank_score(self):
        batch = {
            "concepts": [
                {"id": "b", "rankScore": 20},
                {"id": "a", "rankScore": 90},
                {"id": "c", "rankScore": 90},
            ]
        }

        ranked = social_factory.ranked_concepts(batch)

        self.assertEqual([item["id"] for item in ranked], ["a", "c", "b"])


if __name__ == "__main__":
    unittest.main()
