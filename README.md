# Bible Game Night

Bible stories to play on one screen with the people on your sofa. 35 family games, a dealt game night that ends in a blessing, and Bible verses quoted from the Berean Standard Bible. No accounts, no tracking, no server: it's a static site that also works offline once it has loaded.

Live: https://danielpaulwilkinson.github.io/bible-game-night/

## How a night works

- **Who's playing?** Pick "Little ones with us" (big pictures, few words) or "Grown-ups and friends" (more reading, more bluffing). The menu keeps only the games that suit them and remembers your choice.
- **Play now** deals tonight's three short games: one to get moving, one to laugh and one calm one. The Blessing Round always comes last. "Deal tonight's games again" gives you a fresh set and never repeats a game.
- **The next-game flow.** When a game in tonight's lineup finishes, an in-between screen shows the result (and the family scores in the scored Game Night) along with the night's road: every stop, with a star at the current one. "Next game" is the big button at the bottom. You can also choose "Play this again", "Skip to …" or "End game night". Then comes a "Hand the phone to the next host" screen. The last game leads to the Blessing Round (Numbers 6:24–26, said together, never scored), and then "Night complete". The lineup is kept in session storage, so it survives moving between pages.
- **Game Night** (`#/gamenight`) is the scored version: three rounds in about 15 minutes, with the last round worth double, ending with the Blessing. Old `#/scores` links redirect there. Unknown links show "That page isn't here" with a way back to all games.

Prayer and worship are never scored, and there are no points or streaks for Bible knowledge.

## The games, by mood

- **Get up and move:** Walls of Jericho, Simon Peter Says, Act It Out, Freeze, Lot's Wife!, Noah's Animal Noises, Freeze Frame, Feed the 5,000, Hide the Lost Sheep, Bible Charades
- **Make us laugh:** Forbidden Words, Bible Balderdash, Real or Made Up?, Sketch It, Draw It, Bible Alphabet, Guess Who, Quiz Night, Bible Top Trumps, Who Am I? Clue by Clue, Pilgrim's Way, Out of Egypt, Bible Bingo, Who said or wrote it?
- **Think together:** Fill the Verse, The Big Story Timeline, Verse Builder, Where in the World?, Journey Map, Story Order, Pairs, Church History Passport, Ark Rescue
- **Quiet and worship:** Thankful Together, Finish the Line, Catechism Drill, plus the Blessing Round

Each game has a hash route (for example `#/guess`, `#/jericho`, `#/blessing`) and shows age, time and "From the Book of" badges.

## Stack

Vue 3 + TypeScript, Vite, Tailwind CSS and Vitest (jsdom). Hash routing with `base: './'`, so it runs from any folder, including GitHub Pages. It installs as an app (`public/manifest.webmanifest`, icons in `public/icons/`). A small service worker (`sw-plugin.ts` writes `dist/sw.js` at build time) precaches every built file under a versioned cache name. Each deploy gets a new version, pages are fetched network-first, and old caches are deleted, so updates show on the next load.

## Run, test and build

```sh
npm install
npm run dev        # local dev server
npm test           # full Vitest suite
npx vue-tsc --noEmit   # type check
npm run build      # type check + production build into dist/
npm run preview    # serve dist/ locally
```

## Deploy (GitHub Pages)

Master holds the source. The `gh-pages` branch holds only the built site.

```sh
npm test && npm run build
touch dist/.nojekyll
cd dist && git init -q -b gh-pages && git add -A && git commit -qm "Deploy <master hash>"
git push -f <origin url> gh-pages
gh api -X POST repos/DanielPaulWilkinson/bible-game-night/pages/builds
gh api repos/DanielPaulWilkinson/bible-game-night/pages/builds/latest --jq '.status'   # wait for "built"
```

Never force-push master.

## Scripture

Every verse is quoted from the **Berean Standard Bible (BSB)**, which is public domain. Quotes are checked word for word against `tests/bsb-fixture.txt`, and every fact, quiz answer, board verse and story card carries a BSB reference with a phrase the tests check (`tests/games2.test.ts`). No modern worship lyrics are used.

## Credits

Pictures: illustrations by Jim Padgett, courtesy of **Sweet Publishing**, licensed CC BY-SA 3.0 and cropped for this game; the crops are shared under CC BY-SA 3.0 (see the in-app Credits page, `#/credits`). `tools/sweet_crop.py` rebuilds them from `tools/picks.json`. Pilgrim's Way follows John Bunyan's *The Pilgrim's Progress* (1678, public domain); its place pictures are AI-generated pen-and-wash illustrations (`public/places`).
