declare module "$env/static/public" {
  /**
   * Public env vars exposed to client code
   * Add any PUBLIC_* values you reference in your code here.
   */
  export const PUBLIC_BASE_URL: string;
  export const PUBLIC_TITLE: string;
  export const PUBLIC_TAGLINE: string;
  export const PUBLIC_RELEASE_VERSION: string;
  export const PUBLIC_RELEASE_PUBLISHED_AT: string;
  export const PUBLIC_RELEASE_CREATED_AT: string;

  /**
   * Public env vars used within Vite preprocessing plugins
   */
  // export const VITE_DV_KEY: string;
}
