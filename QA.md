# Version 2 verification

- Local server returns HTTP 200; JavaScript syntax check passes.
- Static validator checks local assets, IDs, anchors and absence of previous-client names/URLs. SVG thumbnails parse as XML.
- New generated images visually inspected and compressed as WebP (323–445 KB each).
- Desktop opening, gallery composition and design study visually inspected.
- Comparison keyboard controls change range value and rendered split (1% and 50%).
- Lawn filter hides other cards and updates pressed state.
- Lawn photo opens detail modal; selecting it prefills Lawn memorial in enquiry.
- Inscription detail tab updates image/copy. Its CTA adds inscription note and opens step 2.
- Wizard preserves memorial choice, location and details through step 3.
- Example.com test data prepares correct encoded mailto recipient and body; no message sent. Edit returns to retained details.
- Mobile opening inspected at 390 x 844 without page horizontal overflow. Menu opens and closes on section navigation.
- Reduced-motion CSS disables animation and reveal hiding.
- No backend, uploads or live quote submission claimed.

Native mail-client launch and email delivery were not tested. Illustrative content and service scope require Nenad's approval.

## Version 3

- Framework build and TypeScript check pass after adding a raw HTML import declaration.
- Local D1 migration applied once; hosted migration remains part of publication.
- API validation: cross-origin submission 403, invalid email 400, spoofed image content 400.
- A valid local request with PNG saves, and retrying its request ID returns the same reference without duplication.
- Anonymous inbox redirects to sign-in. Anonymous photo requests return 403, including for an actual stored photo.
- Local mock administrator can review requests, retrieve photos and update status.
- Browser wizard carries a shared-memorial choice and optional budget note, accepts a WebP photo, and saves a real preview request with a receipt reference. No email is sent.
- English/Serbian toggle changes marketing copy and document language, preserves canonical select values, and restores English correctly.
- Concept-study tabs update image/sketch/story; finished-view button reveals the complete engraved concept.
- Animated still-photo story play/pause/next controls work.
- Mobile 390 x 844 layout checked without horizontal page overflow; named-image hero and comparison controls inspected.
- Three named-image edits inspected. Fictional names and sample dates are visibly disclosed as concept content.

Production inbox access requires Riki's configured account. External email delivery, actual business handoff and native mail-client launch remain outside this preview. All business offerings and translation preferences require confirmation.

## Visual polish

- Mobile opening checked at 390 x 844. Memorial image begins at about 382 CSS pixels from the document top and the full hero is 648 pixels high, fitting the engraved memorial in the first screen.
- No horizontal page overflow.
- Comparison has one compact Upright / Shared / Lawn selector and the slider; redundant Sketch / Compare / Finished buttons removed.
- Slider keyboard Home reveals the finished image; switching to Shared updates the image and resets split to 50%.
- Removed the large introductory treatment, decorative ribbon, hero seal/note, collection pitch, lily interlude and duplicate reassurance section.
- Retained enquiry uploads, protected inbox, language switching, gallery dialogs and other functional sections.
- Static source checks and JavaScript syntax check pass. Backend code unchanged.

## Hero frame correction

- Photo and frame now share one bounded container with a uniform inset, replacing the mismatched height and offsets.
- At 1920 x 950, measured photo-to-frame spacing is 14 px on all four sides.
- At 390 x 844, measured spacing is 10 px on all sides, with no horizontal overflow.
- Adjusted the image crop to keep the memorial's right edge visible. No backend changes.

Portfolio update QA: JS syntax checks passed. Browser checks at 936px and mobile 390x844: no horizontal overflow, hero and real images loaded, shared-project filtering and gallery modal worked. EN/SR toggle translated the new restoration heading and returned to English. All completed-image labels separated from illustrative concept-study labels. No backend changes or live prospect submissions.
