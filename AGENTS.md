# Dev Days Quiz: agent instructions

## Project rules
- Use plain JavaScript, HTML, and CSS; do not add frameworks, build tools, or npm dependencies.
- Keep pure quiz logic in `src/quiz.js`, export it with `module.exports`, and keep it usable by the browser.
- Keep DOM access and event handling in `src/app.js`; question data belongs in `src/questions.js`.
- Test pure logic with Node's built-in `node:test` and `node:assert/strict`; run tests with `npm test`.
- Define colors only as CSS custom properties in `:root` in `src/style.css`; reference them with `var()`.
- Use buttons for actions, preserve visible keyboard focus, and use `aria-live` for changing messages.