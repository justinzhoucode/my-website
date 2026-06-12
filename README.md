# Justin Zhou — Personal Website

Personal site / portfolio for a student & software engineer. It's a single
centered card that switches between pages (about, work, projects, hobbies,
dudu), sitting over a subtle dark greyscale animated background (`Iridescence`,
powered by `ogl`). The background is purely decorative.

## Tech

- [React 19](https://react.dev/)
- [Vite 6](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [ogl](https://github.com/oframe/ogl) — WebGL background shader

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173). The dev server
has hot reload — saving a file updates the browser instantly. Restart only after
changing `vite.config.ts`, the `tsconfig.*.json` files, or installing packages.

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the dev server (hot reload)        |
| `npm run build`   | Type-check (`tsc -b`) + build to `dist/` |
| `npm run preview` | Preview the production build locally     |

## Structure

```
public/
  favicon-16.png / favicon-32.png / apple-touch-icon.png   # favicons (dudu)
  dudu.png            # high-res square crop of the favicon photo
  dudu/dudu-1..6.png  # collage photos for the dudu page
  axl.png             # work entry logo
  uwaterloo-seal.png  # about page logo
src/
  components/
    Iridescence.tsx   # WebGL background (dark greyscale variant of React Bits)
    Panel.tsx         # Rounded, blurred card surface
  App.tsx             # Everything: background + card + in-card page switching
  main.tsx            # Entry point
  index.css           # Tailwind import, theme tokens, animations, scrollbar
index.html            # Title + favicon links
```

## How it works

- **Pages** are defined in the `pages` array at the top of `src/App.tsx`. The
  in-card nav and the active page content are both driven by it.
- **Page content** is rendered conditionally on the active page id inside the
  scrollable content area (`about`, `work`, `projects`, `hobbies`, `dudu`).
- **The card** is a fixed size (`min(94vw, 720px)` × `min(86vh, 640px)`) and
  content scrolls inside it, so the layout stays put no matter how much you add.

## Customizing

- **Add / rename pages:** edit the `pages` array in `src/App.tsx`.
- **Edit page content:** update the matching `active === '...'` block in
  `src/App.tsx`.
- **Links / handles:** GitHub, LinkedIn, and email live in the persistent links
  row near the bottom of `App.tsx` (inline SVGs, no icon library).
- **Theme:** colors and fonts are CSS variables in the `@theme` block of
  `src/index.css`. Reusable bits there: `text-readable`, the `fade-up`
  animation, and the `scroll-dark` scrollbar.
- **Background:** tune the `color`, `speed`, and `amplitude` props on
  `<Iridescence />` in `src/App.tsx` (greyscale; raise `color` for a lighter
  background).
- **Favicon / images:** files live in `public/` and are referenced from the
  site root (e.g. `/dudu/dudu-1.png`).
