# Atomic Design Component Structure

This directory follows **Atomic Design** principles by Brad Frost.

## Component Levels

### `atom/`
Single-purpose wrappers of an HTML element or base component.
- Examples: Icon, Link, Button
- Use when wrapping a single element with consistent styling/behavior

### `molecule/`
Combination of 2+ atoms with one specific function.
- Examples: InputField (Input + Label + Error), Pagination
- Use when combining atoms for a cohesive purpose

### `organism/`
Complex sections that may contain business logic and state.
- Examples: Header, SideNav, FormCancel
- Use for distinct interface sections with logic

### `templates/`
Page-level layout structures without specific content.
- Examples: Layout, Page, TileGrid
- Use for arranging organisms and defining page structure

## Rules

1. **Feature pages are NOT components** — they live in `src/app/pages/`
2. **Reuse existing atoms/molecules** before creating new ones
3. **Place components at the right level** based on complexity
4. **Keep page-specific one-offs** next to the page, not in shared folders
