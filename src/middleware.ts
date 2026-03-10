import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (_, next) => {
  const response = await next();
  response.headers.set(
    "X-Robots-Tag",
    "noindex, nofollow, noarchive, nosnippet, noimageindex"
  );
  return response;
};
