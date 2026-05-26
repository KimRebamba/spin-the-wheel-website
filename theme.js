(function () {
    const STORAGE_KEY = "theme";

    function getCssStringVar(varName, fallback) {
        const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        if (!raw) return fallback;
        return raw.replace(/^['"]|['"]$/g, "");
    }

    function getStoredTheme() {
        const value = localStorage.getItem(STORAGE_KEY);
        return value === "dark" || value === "light" ? value : null;
    }

    function getInitialTheme() {
        const stored = getStoredTheme();
        if (stored) return stored;
        return "light";
    }

    function setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(STORAGE_KEY, theme);

        const toggle = document.getElementById("themeToggle");
        if (!toggle) return;

         
        const iconLight = getCssStringVar("--theme-icon-light", "☾");
        const iconDark = getCssStringVar("--theme-icon-dark", "☀");
        toggle.textContent = theme === "dark" ? iconDark : iconLight;
        toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");

         
        window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
    }

    function toggleTheme() {
        const current = document.documentElement.dataset.theme || "light";
        setTheme(current === "dark" ? "light" : "dark");
    }

     
    document.addEventListener("DOMContentLoaded", function () {
        setTheme(getInitialTheme());

        const toggle = document.getElementById("themeToggle");
        if (toggle) toggle.addEventListener("click", toggleTheme);
    });
})();
