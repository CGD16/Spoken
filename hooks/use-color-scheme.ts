// hooks/use-color-scheme.ts
import { useState, useEffect } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useColorScheme() {
  const systemScheme = useRNColorScheme() === "dark" ? "dark" : "light";
  const [mode, setMode] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("@setting_dark_mode").then((val) => {
      if (val !== null) {
        setMode(JSON.parse(val) ? "dark" : "light");
      } else {
        setMode(systemScheme);
      }
    });
  }, [systemScheme]);

  return mode ?? systemScheme;
}