export const THEME_STORAGE_KEY = "hey-theme";
export const NIGHT_STORAGE_KEY = "hey-night";
export const FLAVOUR_THEMES = ["pataka", "malai", "jaadu", "pehelwan"] as const;
export type FlavourTheme = (typeof FLAVOUR_THEMES)[number];
export const DEFAULT_THEME: FlavourTheme = "pataka";

/**
 * Runs before hydration, blocking, in <head>. Must stay a plain string so
 * Next.js can inline it with no bundling step — do not import this into
 * client components.
 */
export function themeInitScript() {
  return `(function(){try{
    var t=localStorage.getItem('${THEME_STORAGE_KEY}');
    var n=localStorage.getItem('${NIGHT_STORAGE_KEY}');
    var valid=${JSON.stringify(FLAVOUR_THEMES)};
    var root=document.documentElement;
    if(t&&valid.indexOf(t)>-1) root.setAttribute('data-theme',t);
    if(n==='true') root.setAttribute('data-night','true');
  }catch(e){}})();`;
}
