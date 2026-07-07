---
name: Scripture search engine (Minister)
description: Why Minister's KJV verse search is a hybrid (Fuse + IDF + curated known-phrase index) and not pure fuzzy; how to verify ranking.
---

# Minister Scripture search

Source of truth: `artifacts/minister/src/services/scriptureSearchService.ts`. Data: `src/data/kjv.json` (KJV only, public domain; ~6MB — never cat it).

## The rule
Verse search must blend three signals, in priority order: (1) curated known-phrase index, (2) Fuse.js fuzzy, (3) IDF-weighted token overlap. After any change to the engine, re-verify that every founder demo phrase ranks #1.

**Why:** Pure Fuse fuzzy over-weights common words — "no weapon formed against us" matched verses on "against us" and missed Isaiah 54:17 entirely, because the distinctive words "weapon"/"formed" were drowned out. IDF token overlap fixes distinctive-word misquotes but regresses contiguous exact phrases ("seek and ye shall find" → Matthew 7:7). Neither alone passes all cases; the 50/50 blend + a substring bonus does. Some required phrases are modern paraphrases whose exact words are NOT in the KJV ("anxious"→KJV "careful", "hidden"→"hid", and "door" never appears in Matthew 7:7) — lexical matching cannot resolve these at all, so a curated phrase→reference index is layered on top to guarantee them. The real long-term fix is a semantic/embedding layer (precompute per-verse embeddings, rank by cosine); the curated list is the interim guarantee.

**Performance:** Never run Fuse over the full 31,102-verse corpus per query — that costs ~1s and freezes the live page. Build an inverted index (token→verse ids) + IDF once at module load, narrow to candidate verses sharing query tokens, cap to top ~400 by IDF, then build a *scoped* Fuse over only those candidates. This drops a search from ~999ms to ~15ms. Live mode also debounces transcription updates (~350ms) so a search isn't fired on every interim callback.

## Live-mode tuning decisions

- **Confidence tiers are derived from score, not separate logic:** Exact (curated/substring or ≥90), Strong (≥72), Possible (≥55), Theme (rest). Keep tier thresholds and the engine's 90/89 split aligned — if you re-scale scores, re-check that curated hits stay "Exact".
- **Sensitivity is a score floor, not a different algorithm:** Low/Medium/High map to a minimum-score cutoff (stricter→looser). The same ranked results are simply filtered. **Why:** ministers wanted one dial to trade precision for recall without changing what "best match" means.
- **Reduce-repeats is a per-reference time cooldown, not last-N dedup.** A slowly sliding transcript window re-matches the same verse for many seconds; a short last-N window let repeats slip back in. A timestamp-per-ref cooldown is the robust fix.
- **Trigger/Voice-Coach modes only nudge recall:** detecting a quote cue ("the Bible says") or a ministry/prayer/teaching pattern bumps sensitivity one notch and strips the cue words before scoring (the cue can appear mid-sentence, so strip anywhere, not just the prefix — otherwise its common words dilute the real query). They never override ranking.

**How to apply:** Known phrases score 90–99 (always top); engine results are capped at 89 so a curated hit always wins. Known-phrase matching requires an exact substring OR an ordered token subsequence (not unordered overlap) to avoid false positives like "i know the still waters" wrongly hitting "be still and know". Keep the curated list in sync with the founder's demo/known phrases. Verify with a Node snippet that imports `fuse.js` + `kjv.json` and asserts each test phrase returns its expected ref at index 0. Test set that must all rank #1: "seek and ye shall find"→Matthew 7:7, "no weapon formed against us"→Isaiah 54:17, "life and death are in the power"→Proverbs 18:21, "all things work together for good"→Romans 8:28, "be anxious for nothing"→Philippians 4:6, "I can do all things"→Philippians 4:13, "be still and know"→Psalms 46:10, "train up a child"→Proverbs 22:6, "the joy of the Lord"→Nehemiah 8:10, "my grace is sufficient"→2 Corinthians 12:9, "perfect love casts out fear"→1 John 4:18, "faith comes by hearing"→Romans 10:17, "knock and the door"→Matthew 7:7, "hidden in my heart"→Psalms 119:11.
