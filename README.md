# Bible Games

Six small games for young children (about 3 to 7) using 24 people from the Bible. Static site, no server, hash routing (`#/guess`, `#/pairs`, `#/quotes`, `#/order`, `#/bingo`, `#/map`, `#/credits`).

- **Guess Who**: the original game, on two devices or passing one device.
- **Pairs**: match a person to a thing from their story (6 or 10 pairs). Object pictures are hand-drawn SVG.
- **Who said or wrote it?**: 10 rounds of short Berean Standard Bible (public domain) quotes, 3 picture choices. Every quote is checked word for word against `tests/bsb-fixture.txt`, which is itself checked against the full BSB in `../bible-companion` when present.
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

## More games (one screen, no accounts, no network)

Play together:
- **Bible Charades** (`#/charades`): picture + one word, 60-second timer, Got it / Pass, team scores.
- **Real or Made Up?** (`#/real`): 5 real facts and 5 silly fakes; reveal shows the real answer and reference.
- **Draw It** (`#/draw`): tap to reveal the secret word, touch/mouse canvas, colours, undo, clear, 90-second timer.
- **Quiz Night** (`#/quiz`): 2 to 4 teams, 3 rounds of 5, big scoreboard for a TV.

Board games:
- **Pilgrim's Way** (`#/snakes`): snakes and ladders on an old map of Christian's road in John Bunyan's The Pilgrim's Progress (1678, public domain). Helps carry you up and dangers send you back, each with a short story caption and a BSB verse. Counters are story items: burden, scroll, key of Promise, shield and staff. The fourteen place pictures are AI-generated pen-and-wash illustrations (public/places).
- **Out of Egypt** (`#/exodus`): 30-space route from Egypt to the Jordan with 10 story cards.
- **Ark Rescue** (`#/ark`): cooperative; load 8 pairs before the rain meter reaches 6.
- **Bible Top Trumps** (`#/trumps`): 24 cards with Faith, Courage, Kindness, Wisdom; versus computer or pass-and-play.

Every fact, quiz answer, board verse and story card carries a BSB verse and a phrase that the tests check appears in it (`tests/games2.test.ts`). Screenshots: `node tools/games2-shots.mjs` (writes `preview/games2/`).
