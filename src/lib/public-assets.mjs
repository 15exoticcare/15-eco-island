// Keep manual public URLs aligned with the GitHub Pages build path.
export function assetUrl(url){return (process.env.NEXT_PUBLIC_BASE_PATH||'')+url;}
