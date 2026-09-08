# harfialpharaby.github.io

Personal site of **Ainur Harfi Alfaraby** — Frontend Web Developer at Sekolahmu.

**Live:** <https://harfialpharaby.github.io/>

A single page in a terminal visual language, with a light/dark toggle and a working
command line. Hand-written HTML, CSS and JavaScript — no framework, no dependencies,
no build step.

## Files

    index.html              the entire site
    sources/css/style.css   design tokens + layout
    sources/js/main.js      theme toggle, typewriter, scroll reveal, floating terminal
    sources/img/            portrait + school logos
    exp.html                ─┐
    competency.html          ├─ redirect stubs, so links to the old 2019 site still resolve
    edu.html                ─┘

## Editing it

Open `index.html` in a browser and refresh as you edit — that is genuinely all this needs.

If you would rather serve it over `http://` (closer to how GitHub Pages runs it, and
`localStorage` gets a normal origin instead of a `file://` one), any static file server
works. `python3 -m http.server 8080` is just the one that needs nothing installed on
macOS — **this is not a Python project**. `npx serve` does the same job.

## Deploying

GitHub Pages serves this repository as-is from `master`. Pushing to `master` publishes.
There is nothing to build and no action to wait on.

## Notes for future me

- **Theming.** Every colour is a custom property, defined three times: on bare `:root`
  (light), under `@media (prefers-color-scheme: dark)` guarded by
  `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]` so an
  explicit toggle wins in both directions. **Miss the third and the toggle silently
  falls back to the light value** — that bug already happened once with the portrait shadow.
- A small blocking script in `<head>` applies the stored theme before first paint, so
  there is no flash of the wrong theme.
- **The terminal** is the button in the bottom-right. It opens a draggable window;
  minimise keeps the session, close resets it, and its position persists in
  `localStorage`. Drag it by the title bar, or focus the bar and use the arrow keys.
- Motion (typewriter, scroll reveal) is disabled under `prefers-reduced-motion`.
- The page works fine with JavaScript off — the terminal simply never appears.
- `sources/img/harfi.jpg` is both the portrait and the social preview image. Any
  replacement should be re-encoded to strip EXIF: the previous photo shipped with GPS
  coordinates in it.
- `Profile.pdf` (LinkedIn export) is gitignored on purpose — it contains a home address
  and phone number.
