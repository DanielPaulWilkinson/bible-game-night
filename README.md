# Bible Games

Six small games for young children (about 3 to 7) using 24 people from the Bible. Static site, no server, hash routing (`#/guess`, `#/pairs`, `#/quotes`, `#/order`, `#/bingo`, `#/map`, `#/credits`).

- **Guess Who**: the original game, on two devices or passing one device.
- **Pairs**: match a person to a thing from their story (6 or 10 pairs). Object pictures are hand-drawn SVG.
- **Who Said It?**: 10 rounds of short King James Version quotes, 3 picture choices. Every quote is checked word for word against KJV text in `tests/kjv-fixture.txt`.
- **Story Order**: tap (or drag) Sweet Publishing scenes of Noah, Jonah and Joseph into order.
- **Bible Bingo**: 4x4 card on screen or printed (4 cards), plus a caller screen.
- **Journey Map**: simplified SVG map of Abraham (Ur to Canaan) and Paul's first journey, stop by stop with references.

Game logic lives in `src/games.ts` and `src/game.ts`, tested in `tests/`. Scene pictures come from `tools/sweet_scenes.py`.


Guess Who with 24 people from the Bible, for two devices in the same room. Questions are asked out loud.

- Tap a face to flip it down; tap again to bring it back. Hold a card, or press its "i", to read a one-line fact with its Bible reference.
- Your secret person is pinned at the top and hidden until you press "Show my person".
- No accounts, no server, no tracking. Two modes: "Two devices" (one board each) or "Pass the device" (two players share one device).
- Pictures: illustrations by Jim Padgett, courtesy of Sweet Publishing, licensed CC BY-SA 3.0, cropped for this game; the crops are shared under CC BY-SA 3.0. See the in-app credits page. `tools/sweet_crop.py` rebuilds them from `tools/picks.json`.

```
npm install
npm test
npm run build && npm run preview
```
Design notes: DESIGN.md. Picture sources: src/credits.json (fetched by tools/fetch.py).
