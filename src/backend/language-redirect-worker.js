addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const supportedLanguages = ["de", "en", "es", "fi", "fr"];
const defaultLanguage = "en";

function parseAcceptLanguage(header) {
  return header
    .split(",")
    .map((lang) => {
      const parts = lang.trim().split(";q=");
      return {
        lang: parts[0].split("-")[0],
        q: parts[1] ? parseFloat(parts[1]) : 1.0,
      };
    })
    .sort((a, b) => b.q - a.q)
    .map((obj) => obj.lang);
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Check if the URL already contains a supported language
  if (supportedLanguages.some((lang) => pathname.startsWith(`/${lang}`))) {
    return fetch(request);
  }

  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const preferredLanguages = parseAcceptLanguage(acceptLanguage);

  // Find the first supported language that matches the user's preferences
  const matchedLanguage =
    preferredLanguages.find((lang) => supportedLanguages.includes(lang)) ||
    defaultLanguage;

  url.pathname = `/${matchedLanguage}${pathname}`;
  return Response.redirect(url.toString(), 302);
}
