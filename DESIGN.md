# Design: pen-and-wash storybook

Ground: the Sweet Publishing pictures are pen line with soft watercolour wash.
The app should feel like the page those pictures sit on, read on a sofa by
small boys and their family on a games night.

## Tokens (6)

| Name    | Hex     | Use                                              |
|---------|---------|--------------------------------------------------|
| Lapis   | #1E3557 | The night-time page. Flat, no gradient.          |
| Vellum  | #F3E6C8 | Paper for pictures, the menu hero, boards, cards |
| Ink     | #2B2117 | Pen line: borders, text on vellum                |
| Saffron | #E3A23B | Titles and the one action button on a screen     |
| Olive   | #5E6B2F | Good things: helps, right answers                |
| Pom     | #9B2C45 | Setbacks: dangers, wrong answers                 |

Linen #FAF3E3 stays as body text on lapis only.

Type: one system book serif (Iowan Old Style, Palatino, Georgia). Big sizes
for reading across a room: 20px body, 48–60px titles. Sentence case, no
all-caps labels, no eyebrows. Italic for small source labels such as
"From The Pilgrim's Progress".

## Principles

1. One bold thing: the menu's frontispiece, a real Sweet Publishing picture in
   a thick ink frame on vellum. Everything else stays quiet.
2. Lists, not card kits. Games are a contents page with ink rules.
3. Ink borders, not shadows. Square or slightly rounded corners.
4. Motion only answers a tap (flip, roll). Nothing moves on its own; reduced
   motion is honoured globally.
5. Plain separators in meta text: commas and full stops, not middle dots.
6. Touch targets at least 48px, 56px for main actions. Text under 80 chars a line.
7. Boards are drawn maps on vellum, in pen and wash, never scary.

## Immersive pass
- Game logos: `GameLogo.vue`, one family of lapis roundels with an ink rim, saffron inner ring and a vellum glyph drawn with a 2.5 ink line. Used on the menu and in every game header.
- Pilgrim's Way: AI-generated pen-and-wash place pictures in `public/places` (96px medallions on the board, 240px on the help/danger card, lazy). Counters are small upright objects on a coloured plinth with a cast shadow; helps are shaded stepping stones that grow as they rise; dangers are sunken muddy tracks. Shared gradients live in `PilgrimDefs.vue`.
- Motion only follows a roll (token glide, a glow on the mover's square, and a pan on phone) and is off under reduced motion.
