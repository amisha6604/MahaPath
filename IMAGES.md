# Adding Real Images to Mahapath

## Images currently wired into the site (as of this commit)

Two real, CC-licensed photos are now live:

| Location | File | License | Source page |
|---|---|---|---|
| Homepage hero background | `Triveni_Sangam.JPG` | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Triveni_Sangam.JPG |
| "Know About Mahakumbh" page hero | `Prayagraj_sangam.jpg` | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Prayagraj_sangam.jpg |

Both are loaded via Wikimedia's official `Special:FilePath` redirect (a stable, documented URL
pattern designed for exactly this kind of reuse — it always resolves to the current version of
the file without needing to know Wikimedia's internal hash-based storage path). Attribution
captions linking back to each source page are included on-page, since CC BY-SA legally requires
attribution.

**Important — please verify visually yourself before treating this as final:** the research tool
used to confirm these licenses could read Wikimedia's *text* (via search results and category
listings, which is how the license and usage info above was confirmed — `Triveni_Sangam.JPG` is
independently confirmed to be used on English Wikipedia's own "Prayagraj" and "Triveni Sangam"
articles, which is strong evidence of legitimate standing), but could not directly load and
visually inspect the *image itself* due to a domain restriction in that environment. Open both
URLs in your own browser once and confirm they show what you'd expect (a river confluence
scene) before considering this final — if anything looks wrong, tell me and I'll source
alternatives.

## Adding more images yourself

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
