"use client";
import { createContext, useContext } from "react";
const LoadingIconContext = createContext("");
export function PublicSettingsProvider({
  loadingIconUrl,
  children,
}: {
  loadingIconUrl: string;
  children: React.ReactNode;
}) {
  return (
    <LoadingIconContext.Provider value={loadingIconUrl}>
      {children}
    </LoadingIconContext.Provider>
  );
}
export function useLoadingIcon() {
  return useContext(LoadingIconContext);
}
