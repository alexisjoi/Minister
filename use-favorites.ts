import { useState, useEffect } from "react";
import { Verse } from "@/services/scriptureSearchService";

export interface FavoriteItem {
  id: string; // unique ID
  verse: Verse;
  dateSaved: string;
  sourceMode: "live" | "manual";
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem("minister-favorites");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("minister-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (verse: Verse, sourceMode: "live" | "manual") => {
    setFavorites(prev => {
      // Avoid duplicate saves
      const isDuplicate = prev.some(f => 
        f.verse.book === verse.book && 
        f.verse.chapter === verse.chapter && 
        f.verse.verse === verse.verse &&
        f.verse.translation === verse.translation
      );
      if (isDuplicate) return prev;

      const newItem: FavoriteItem = {
        id: `${verse.book}-${verse.chapter}-${verse.verse}-${verse.translation}-${Date.now()}`,
        verse,
        dateSaved: new Date().toISOString(),
        sourceMode
      };
      return [newItem, ...prev];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return { favorites, addFavorite, removeFavorite };
}
