# Bible Guess Who: design plan

Audience: Daniel, Jonah and Elijah at the kitchen table, two devices, questions asked out loud.
Job: show 24 faces clearly, make flipping one down feel like turning a tile, and keep the secret person safe from a peeking brother.

## Direction: "Tissot's sketchbook on a lapis tent cloth"
All pictures are James Tissot's Bible watercolours (1896–1902), so the board borrows their world: dusty
Near-Eastern daylight, linen, saffron and lapis. Not cream-and-terracotta, not a SaaS card grid.

## Colour
- Lapis `#1E3557`: the table cloth (page background)
- Linen `#FAF3E3`: card faces
- Saffron `#E3A23B`: the one accent (secret card frame, focus ring, New game)
- Ink `#2B2117`: text on linen
- Olive `#5E6B2F` / Pomegranate `#9B2C45`: small Old / New Testament corner marks (a real clue, so they earn their place)

## Type
One serif family (Iowan Old Style / Palatino / Georgia system stack, no web font download) at three sizes:
names 15-17px semibold, headings 28px, facts 18px with 1.5 line height. Sentence case everywhere.

## Layout
```
desktop/tablet                      phone
+---------------------------------+ +-----------------+
| [secret: portrait | Show/Hide]  | | [secret | Hide] |
| [New game]  18 of 24 still up   | | [New game] 18/24|
| [][][][][][]                    | | [][][][]        |
| [][][][][][]   6 x 4            | | [][][][]  4 x 6 |
| [][][][][][]                    | | ...             |
| [][][][][][]                    | |                 |
| Picture credits                 | | credits         |
+---------------------------------+ +-----------------+
```
Left-aligned controls, centred board, max width ~1100px.

## Principles
- The one bold thing: the secret card, framed in saffron like a gilded icon, covered by a lapis "seal" when hidden.
- Flipped-down cards go sepia-grey and sink slightly (a turned tile); that is the only motion, and it answers a tap.
- Testament corner marks are the only decoration, because they are a clue.
- Big targets (cards ≥ 72px wide on phones), visible focus, reduced motion respected, no tracking, no server.

## Review against the brief
First draft used a cream background with a terracotta accent; that is the generic default, so the background
moved to lapis (from Tissot's skies) and the accent to saffron.
