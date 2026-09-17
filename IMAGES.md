# Adding Real Images to Mahapath

I didn't hardcode photos scraped from random websites into the codebase — most are copyrighted,
and photos of identifiable people at a religious gathering carry privacy considerations even when
licensed. Here's how to add real images properly, in about 10-15 minutes:

## Legitimate free sources

1. **Wikimedia Commons** (best for factual/historical Mahakumbh photos, most are CC-BY or CC-BY-SA
   with clear attribution requirements listed on each image page):
   https://commons.wikimedia.org/wiki/Category:Kumbh_Mela

2. **Unsplash** (great for generic, high-quality "temple", "river", "diya lamp", "Indian festival"
   style imagery — free to use, no attribution legally required though appreciated):
   https://unsplash.com/s/photos/kumbh-mela

3. **Pexels** (similar to Unsplash):
   https://www.pexels.com/search/ganges%20river/

**Rule of thumb:** if a photo shows identifiable people up close, prefer wide/crowd shots, official
press-kit imagery, or illustrative/generic religious imagery over close-up candid photos of individuals.

## Where to add the URLs in Mahapath

- **Nearby Places**: `/nearby/edit/:id` (admin) → paste a URL into the "Image URL" field.
  Used on the homepage scroller, `/nearby` grid, and the place detail page hero.
- **Homepage hero background**: currently `/mahakumbh-bg.jpg` in `public/images/` — replace that
  file directly (keep the same filename) with a real, properly licensed image, sized around
  1920×1080 for good quality without a huge file size.
- **About Mahakumbh page**: currently has no images — if you want to add some, I can wire up
  `imageUrl` fields there too; just ask.

## If you download instead of hotlinking

Downloading and self-hosting (into `public/images/`) is actually **more reliable** than hotlinking
external URLs — no risk of the source site changing/removing the image later, and it loads faster.
Just keep a note of the source + license for each image you use, in case you're ever asked.
