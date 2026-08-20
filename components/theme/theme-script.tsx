const themeScript = `
(() => {
  const key = "cactus-theme";
  let theme = "system";

  try {
    const stored = localStorage.getItem(key);
    if (stored === "light" || stored === "dark" || stored === "system") {
      theme = stored;
    }
  } catch {}

  const isDark = theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = theme;
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
