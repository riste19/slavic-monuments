# Slavic Monuments preview

Vinext / Cloudflare Worker website preview. Source HTML is in `site/index.html`, browser assets in `public`, API handlers in `app/api`, and storage helpers in `server`. Run `npm run dev -- --port 8772 --hostname 127.0.0.1`. Version 3 combines the cinematic opening, multiple comparison studies, gallery, animated photo story, service cards, quote-scope guide, cemetery lookup, language demo and direct photo enquiries.

Verified: Nenad Petrovic replied from slavicmonuments@gmail.com. Slavic Monuments is on Metropolitan Memorial Parks' list dated 4 March 2026, with 0405 700 444 and the same email.

No original project photos, portrait, exact services, prices or timeframes were supplied. Hero and gallery use AI-generated illustrative imagery. Original SVG memorial thumbnails are concept illustrations, not a product catalogue. The comparison is an outline-to-atmosphere design study, not restoration proof. Labels are present in the UI. No fabricated reviews or results. No previous client's name, contact, project photographs, testimonial or specific service claims were reused. The botanical image is a reusable illustrative asset.

The enquiry form saves consented preview requests to D1 and up to 3 JPG/PNG/WebP photos to R2 (5 MB each). Riki can review them at `/review-inbox`; inbox and photo retrieval require a signed-in identity matching the server-side `QUOTE_ADMIN_EMAIL` setting. Nenad is not notified automatically. Email-draft and clipboard alternatives remain available. Contact buttons use verified public phone/email. Site remains owner-private.

Images generated with the built-in image generation tool. Optimized assets are in `public/assets`: hero-named.webp, detail.webp, shared-named.webp, lawn-named.webp and lilies.webp. Source PNGs are preserved under source-images.
Prompt: photorealistic architectural garden photograph of a blank, light-grey upright granite memorial on the right, eucalyptus and cypress backdrop, warm morning light, dark foliage negative space on the left, no names, inscriptions, people, logos or watermarks. Illustrative website concept, not completed business work.

Additional prompt set: (1) tactile architectural close-up of pale grey granite with a gently arched bevel catching warm light, dark cypress backdrop; (2) blank wide dark granite shared memorial, wave-shaped top and a garden setting; (3) low inclined light granite lawn memorial in a landscaped garden. All photographs are illustrative, without names, inscriptions, people, logos or business-work claims. PNG-to-WebP compression preserves the compositions.

Named-image edit prompt set: preserve each original photograph's camera, silhouette, perspective and environment; change only the memorial face by adding realistic incised sample inscriptions. Upright: Alexander Morgan, 1946–2023, Forever in our hearts. Shared: Morgan, Alexander 1946–2023 and Evelyn 1949–2024, Together, always. Lawn: Evelyn Morgan 1949–2024, Always in our hearts. All names and dates are explicitly fictional samples. Images and comparison labels disclose this.

The animated photo story is an opt-in sequence of generated stills, not authentic workshop footage. English/Serbian translations are a reviewable demonstration, not a claim about Nenad's spoken languages. No published prices, discounts, service radius, customer reviews or actual completed projects are invented.

Local validation: `python scripts/verify-static.py`, `node --check public/app.js`, `node --check public/extras.js`, `node --check public/languages.js`, `npx tsc --noEmit`. `scripts/test-inquiries.py` tests only loopback API validation, idempotency, photo protection and administrator review. `.dev.vars` holds only local mock-admin configuration and is ignored.

## Nenad-approved portfolio update — 2 November 2026

Nenad’s email supplied IMG_6171.png and directed Riki to @slavicmonuments for project photographs. Original logo used unaltered. Real project images are locally hosted, optimized WebP assets; no Instagram player or tracking is embedded.

Sources: https://www.instagram.com/slavicmonuments/ ; hero DdBXJhDBl13; olive-green shared memorial DdtATgRoGHA; restoration DRbHaR-gYuL; community tribute DdTPQhJASE4. Captions were inspected in the browser. Restoration images both show completed work and are not described as a before/after pair. The separate fictional sketch studies remain explicitly illustrative.

The quote inbox, uploads and notification behavior are unchanged. Slavic custom domain is active with active SSL. Preview audience remains public.

Unique portfolio assignment: hero real-hero; gallery upright-gallery / real-shared / real-single; restoration-finish / restoration-detail; story-architecture / story-foundations / story-shared; details detail-form / detail-words / detail-finish; personal real-community. Thirteen different photographs, no image reused across sections. Gallery modal enlarges its selected photograph. Source posts and original downloads recorded in the working asset manifest.
