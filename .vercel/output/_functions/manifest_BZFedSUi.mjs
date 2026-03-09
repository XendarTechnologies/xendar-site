import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_oiWRjXm6.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Cat90pkT.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///mnt/d/dev/xendar-site/","cacheDir":"file:///mnt/d/dev/xendar-site/node_modules/.astro/","outDir":"file:///mnt/d/dev/xendar-site/dist/","srcDir":"file:///mnt/d/dev/xendar-site/src/","publicDir":"file:///mnt/d/dev/xendar-site/public/","buildClientDir":"file:///mnt/d/dev/xendar-site/dist/client/","buildServerDir":"file:///mnt/d/dev/xendar-site/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"services/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services","isIndex":false,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contact","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contact\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contact.ts","pathname":"/api/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/mnt/d/dev/xendar-site/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/mnt/d/dev/xendar-site/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/mnt/d/dev/xendar-site/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/mnt/d/dev/xendar-site/src/pages/services.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/contact@_@ts":"pages/api/contact.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/services@_@astro":"pages/services.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BZFedSUi.mjs","/mnt/d/dev/xendar-site/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_5HR85Q05.mjs","/mnt/d/dev/xendar-site/src/pages/contact.astro?astro&type=script&index=0&lang.ts":"_astro/contact.astro_astro_type_script_index_0_lang.CdgXa3sA.js","/mnt/d/dev/xendar-site/src/components/NavBar.astro?astro&type=script&index=0&lang.ts":"_astro/NavBar.astro_astro_type_script_index_0_lang.BrqfVEcK.js","/mnt/d/dev/xendar-site/src/components/Intro.astro?astro&type=script&index=0&lang.ts":"_astro/Intro.astro_astro_type_script_index_0_lang.Cg9BEaYC.js","/mnt/d/dev/xendar-site/src/components/MapPanel.astro?astro&type=script&index=0&lang.ts":"_astro/MapPanel.astro_astro_type_script_index_0_lang.HYllOBXI.js","/mnt/d/dev/xendar-site/src/components/Features.astro?astro&type=script&index=0&lang.ts":"_astro/Features.astro_astro_type_script_index_0_lang.B_Q6Ug3_.js","/mnt/d/dev/xendar-site/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/mnt/d/dev/xendar-site/src/pages/contact.astro?astro&type=script&index=0&lang.ts","const r=()=>{const a=document.getElementById(\"contact-form\"),e=document.getElementById(\"contact-submit\"),t=document.getElementById(\"contact-status\");if(!(a instanceof HTMLFormElement)||!(e instanceof HTMLButtonElement)||!(t instanceof HTMLParagraphElement))return;const d=()=>{t.classList.add(\"hidden\"),t.classList.remove(\"text-red-600\",\"text-teal\"),t.textContent=\"\"};a.addEventListener(\"submit\",async c=>{c.preventDefault(),d(),e.disabled=!0,e.classList.add(\"opacity-70\",\"cursor-not-allowed\"),e.textContent=\"Enviando...\";try{const n=new FormData(a),o=await fetch(\"/api/contact\",{method:\"POST\",body:n,headers:{Accept:\"application/json\"}}),s=await o.json().catch(()=>({}));if(!o.ok){const i=typeof s?.error==\"string\"?s.error:typeof s?.detail==\"string\"?s.detail:\"No se pudo enviar el mensaje.\";throw new Error(i)}a.reset(),t.textContent=\"Mensaje enviado. Te vamos a responder a la brevedad.\",t.classList.remove(\"hidden\"),t.classList.add(\"text-teal\")}catch(n){const o=n instanceof Error?n.message:typeof n==\"string\"?n:\"Error al enviar. Intentá nuevamente.\";t.textContent=o,t.classList.remove(\"hidden\"),t.classList.add(\"text-red-600\")}finally{e.disabled=!1,e.classList.remove(\"opacity-70\",\"cursor-not-allowed\"),e.textContent=\"Enviar mensaje\"}})};document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",r,{once:!0}):r();document.addEventListener(\"astro:page-load\",r);"],["/mnt/d/dev/xendar-site/src/components/NavBar.astro?astro&type=script&index=0&lang.ts","const a=()=>{const i=window;typeof i.__xendarMobileNavCleanup==\"function\"&&i.__xendarMobileNavCleanup();const e=document.getElementById(\"mobile-menu-btn\"),n=document.getElementById(\"mobile-menu\");if(!(e instanceof HTMLButtonElement)||!(n instanceof HTMLElement)){i.__xendarMobileNavCleanup=null;return}const o=()=>{n.classList.add(\"hidden\"),e.setAttribute(\"aria-expanded\",\"false\")},d=()=>{n.classList.toggle(\"hidden\");const t=e.getAttribute(\"aria-expanded\")===\"true\";e.setAttribute(\"aria-expanded\",String(!t))},l=()=>{window.innerWidth>=1024&&o()};e.addEventListener(\"click\",d),n.querySelectorAll(\"a\").forEach(t=>{t.addEventListener(\"click\",o)}),window.addEventListener(\"resize\",l),i.__xendarMobileNavCleanup=()=>{e.removeEventListener(\"click\",d),n.querySelectorAll(\"a\").forEach(t=>{t.removeEventListener(\"click\",o)}),window.removeEventListener(\"resize\",l)}};document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",a,{once:!0}):a();document.addEventListener(\"astro:page-load\",a);"],["/mnt/d/dev/xendar-site/src/components/Intro.astro?astro&type=script&index=0&lang.ts","const e=()=>{const n=Array.from(document.querySelectorAll(\".intro-video-el\"));n.length&&n.forEach(t=>{t instanceof HTMLVideoElement&&(t.muted=!0,t.playsInline=!0,t.loop=!0,t.setAttribute(\"muted\",\"\"),t.setAttribute(\"playsinline\",\"\"),t.load(),t.play().catch(()=>{}))})};document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",e,{once:!0}):e();document.addEventListener(\"astro:page-load\",e);document.addEventListener(\"visibilitychange\",()=>{document.visibilityState===\"visible\"&&e()});"],["/mnt/d/dev/xendar-site/src/components/MapPanel.astro?astro&type=script&index=0&lang.ts","const i=()=>{const e=window;typeof e.__mapScrollFillCleanup==\"function\"&&e.__mapScrollFillCleanup();const n=document.querySelector(\"[data-scroll-fill-map]\");if(!(n instanceof HTMLElement)){e.__mapScrollFillCleanup=null;return}const o=Array.from(n.querySelectorAll(\".scroll-fill-word\"));if(window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches){o.forEach(r=>r.classList.add(\"is-filled\")),e.__mapScrollFillCleanup=null;return}let l=!1;const s=()=>{l=!1;const r=n.getBoundingClientRect(),a=window.innerHeight||document.documentElement.clientHeight,c=a*.88,d=a*.28,u=(c-r.top)/(c-d),m=Math.max(0,Math.min(1,u)),p=Math.floor(m*o.length);o.forEach((f,w)=>{f.classList.toggle(\"is-filled\",w<p)})},t=()=>{l||(l=!0,window.requestAnimationFrame(s))};window.addEventListener(\"scroll\",t,{passive:!0}),window.addEventListener(\"resize\",t),s(),e.__mapScrollFillCleanup=()=>{window.removeEventListener(\"scroll\",t),window.removeEventListener(\"resize\",t)}};document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",i,{once:!0}):i();document.addEventListener(\"astro:page-load\",i);"],["/mnt/d/dev/xendar-site/src/components/Features.astro?astro&type=script&index=0&lang.ts","const s=()=>{const t=Array.from(document.querySelectorAll(\".feature-reveal\"));if(!t.length)return;const o=window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches,a=window.location.hash===\"#features\";if(o||a||!(\"IntersectionObserver\"in window)){t.forEach(e=>e.classList.add(\"is-visible\"));return}const n=new IntersectionObserver(e=>{e.forEach(r=>{r.target.classList.toggle(\"is-visible\",r.isIntersecting)})},{threshold:.15,rootMargin:\"0px 0px -8% 0px\"});t.forEach(e=>n.observe(e)),window.addEventListener(\"hashchange\",()=>{window.location.hash===\"#features\"&&t.forEach(e=>e.classList.add(\"is-visible\"))})};document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",s,{once:!0}):s();document.addEventListener(\"astro:page-load\",s);"]],"assets":["/_astro/about.JoWFNUi4.css","/_astro/index.BKm22bPJ.css","/Background1.png","/Background2.png","/Xendar-Logo-DarkMode.svg","/Xendar-Logo.svg","/favicon.ico","/favicon.svg","/logo.png","/mapa-nocturno.png","/video-intro.mp4","/fonts/montserrat-400.woff2","/fonts/montserrat-500.woff2","/fonts/montserrat-600.woff2","/fonts/montserrat-700.woff2","/fonts/montserrat-800.woff2","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js.br","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js.gz","/about/index.html","/contact/index.html","/services/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"9WJQdxIsLRaowZO6uPK4pDFSnK1StD/0N1cl9WZS9Yw="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
