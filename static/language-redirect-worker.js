addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const languages = ["de", "en", "es", "fi", "fr"];

  for (const lang of languages) {
    if (acceptLanguage.includes(lang)) {
      return Response.redirect(`https://howtoaskquestions.com/${lang}`, 302);
    }
  }

  return Response.redirect("https://howtoaskquestions.com/en", 302);
}
