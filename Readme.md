# Smart Todo List

A single-page todo list built with vanilla JavaScript, HTML, and CSS. Add tasks, toggle their completion state, switch between filters, and keep everything in sync via `localStorage`.

## Features
- Keyboard-friendly input with Enter-to-add support
- Filters for all, active, and completed tasks
- Bulk "clear completed" control
- Automatic persistence in the browser via `localStorage`
- Light/dark theme toggle with saved preference

## Getting Started
1. Clone or download this repository.
2. Open `index.html` in your preferred browser.
3. Optionally, serve the directory with any static server (e.g. `python -m http.server 8000`).

Once loaded, enter a task description and press `Enter` or click **Add**. Toggle items via their checkbox, delete with the ✕ control, and clear completed items using the toolbar button.

## Project Structure
```
index.html   # Markup and component skeleton
styles.css   # Visual design and layout rules
app.js       # Todo list interactions and persistence logic
```
