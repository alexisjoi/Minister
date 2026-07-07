import { useState, useEffect } from "react";
import { Sensitivity } from "@/services/scriptureSearchService";

export interface LiveSettings {
  /** How permissive Scripture matching is during live listening. */
  sensitivity: Sensitivity;
  /** How many of the most recent spoken words are searched (20-40). */
  windowSize: number;
  /** Search more aggressively right after "the Bible says", "it is written", etc. */
  triggerMode: boolean;
  /** Recognize ministry/teaching/prayer/exhortation patterns and lean in. */
  voiceCoachMode: boolean;
}

export const DEFAULT_LIVE_SETTINGS: LiveSettings = {
  sensitivity: "Medium",
  windowSize: 30,
  triggerMode: true,
  voiceCoachMode: false,
};

const STORAGE_KEY = "minister-live-settings";
const VALID_SENSITIVITY: Sensitivity[] = ["Low", "Medium", "High"];
const VALID_WINDOW = [20, 30, 40];

// Coerce anything read from localStorage back into a valid settings object so a
// stale or hand-edited value can never put the live engine into a bad state.
function sanitize(raw: unknown): LiveSettings {
  const r = (raw ?? {}) as Partial<LiveSettings>;
  return {
    sensitivity: VALID_SENSITIVITY.includes(r.sensitivity as Sensitivity)
      ? (r.sensitivity as Sensitivity)
      : DEFAULT_LIVE_SETTINGS.sensitivity,
    windowSize: VALID_WINDOW.includes(r.windowSize as number)
      ? (r.windowSize as number)
      : DEFAULT_LIVE_SETTINGS.windowSize,
    triggerMode:
      typeof r.triggerMode === "boolean" ? r.triggerMode : DEFAULT_LIVE_SETTINGS.triggerMode,
    voiceCoachMode:
      typeof r.voiceCoachMode === "boolean"
        ? r.voiceCoachMode
        : DEFAULT_LIVE_SETTINGS.voiceCoachMode,
  };
}

export function useLiveSettings() {
  const [settings, setSettings] = useState<LiveSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return sanitize(JSON.parse(saved));
      } catch {
        return DEFAULT_LIVE_SETTINGS;
      }
    }
    return DEFAULT_LIVE_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = <K extends keyof LiveSettings>(key: K, value: LiveSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, update };
}
