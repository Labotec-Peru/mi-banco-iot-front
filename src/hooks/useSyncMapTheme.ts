// hooks/useSyncMapTheme.ts
import { useEffect, useState } from 'react';
import { useTheme } from './useTheme';

export const useSyncMapTheme = () => {
  const { theme } = useTheme();
  const [mapStyle, setMapStyle] = useState(
    () => {
      const saved = localStorage.getItem("map-style");
      if (saved) return saved;
      
      return theme === 'dark' 
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";
    }
  );

  const isLightOrDark = (style: string) => {
    return style === "mapbox://styles/mapbox/light-v11" || 
           style === "mapbox://styles/mapbox/dark-v11";
  };

  useEffect(() => {
    if (isLightOrDark(mapStyle)) {
      const newMapStyle = theme === 'dark' 
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";
      
      if (mapStyle !== newMapStyle) {
        setMapStyle(newMapStyle);
        localStorage.setItem("map-style", newMapStyle);
      }
    }
  }, [theme, mapStyle]);

  return { mapStyle, setMapStyle };
};