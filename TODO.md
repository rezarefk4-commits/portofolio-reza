# TODO - Clear Tailwind/PostCSS warnings

- [ ] Identify exact warning(s) from build/dev logs (Tailwind/PostCSS). (Already: build succeeds; only chunk-size + code-split advice seen.)
- [ ] Remove CSS nesting in `src/App.css` (replace `&:hover`, `.base, .framework` blocks with flat CSS) to avoid PostCSS/nesting warnings.
- [ ] Remove template-generated Tailwind delay classes in `src/App.jsx` (e.g. `delay-${...}`) or replace with fully static classes so Tailwind class scan is deterministic.
- [ ] Re-run `npm run build` and `npm run lint`.
- [ ] Ensure warnings are gone (or document remaining non-critical warnings like chunk-size limit).

