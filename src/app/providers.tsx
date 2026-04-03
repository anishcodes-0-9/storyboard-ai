import { useEffect, type PropsWithChildren } from "react";

import { useStoryboardStore } from "../store/use-storyboard-store";

export function AppProviders({ children }: PropsWithChildren) {
  const hydrateFromStorage = useStoryboardStore(
    (state) => state.hydrateFromStorage,
  );
  const saveToStorage = useStoryboardStore((state) => state.saveToStorage);
  const hydrated = useStoryboardStore((state) => state.hydrated);
  const prompt = useStoryboardStore((state) => state.prompt);
  const activeTemplate = useStoryboardStore((state) => state.activeTemplate);
  const sections = useStoryboardStore((state) => state.sections);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timeout = window.setTimeout(() => {
      saveToStorage();
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [hydrated, prompt, activeTemplate, sections, saveToStorage]);

  return children;
}
