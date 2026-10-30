# Bible Guess Who

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
