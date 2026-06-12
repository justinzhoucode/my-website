# Justin Zhou — Personal Website

Personal portfolio for a student / software engineer. Built with React + Vite,
with a subtle dark greyscale animated background (`Iridescence`, powered by
`ogl`).

## Tech

- [React 19](https://react.dev/)
- [Vite 6](https://vite.dev/)
- [ogl](https://github.com/oframe/ogl) — WebGL background shader

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Build for production into `dist/`     |
| `npm run preview` | Preview the production build locally  |

## Structure

```
src/
  components/
    Iridescence.jsx   # WebGL background (dark greyscale variant)
    Iridescence.css
  sections/
    Nav.jsx           # Sticky top navigation
    Hero.jsx          # Intro / landing
    About.jsx         # Bio + tools
    Projects.jsx      # Project cards (edit with your work)
    Contact.jsx       # Contact links
  App.jsx             # Layout: background + sections
  main.jsx            # Entry point
  index.css           # Global styles / theme tokens
```

## Customizing

- Update copy in the `src/sections/*.jsx` files.
- Replace placeholder projects in `src/sections/Projects.jsx`.
- Update email / social links in `src/sections/Contact.jsx`.
- Theme colors live as CSS variables in `src/index.css`.
- Background subtlety is controlled by the `color`, `speed`, and `amplitude`
  props passed to `<Iridescence />` in `src/App.jsx`, plus the `.background-veil`
  gradient in `src/App.css`.
