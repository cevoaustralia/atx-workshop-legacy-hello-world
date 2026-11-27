# Visual Regression Testing (Docker-based)

This document outlines the visual regression testing approach for the design system.

## Overview

Visual regression testing ensures that UI changes are intentional and don't introduce unexpected visual bugs. This project uses a **Docker-based, CI-authoritative** approach with **Git LFS** for baseline storage.

## Status

🚧 **Visual regression testing infrastructure is planned but not yet implemented.**

## Planned Architecture

### CI-Authoritative Baselines

- **Source of Truth:** CI environment (Linux + Chromium)
- **Storage:** Git LFS for baseline images
- **Workflow:** GitHub Actions workflow triggers baseline updates

### Local Development

Developers can run visual tests locally but baselines are **always** generated in CI for consistency.

```bash
# Run visual regression tests (compare against CI baselines)
npm run test:visual

# DO NOT update baselines locally - use CI workflow instead
```

### CI Workflow

Intentional UI changes should trigger the **"Update Visual Regression Baselines"** workflow:

1. Push your branch with UI changes
2. Trigger the workflow from GitHub Actions
3. Workflow runs in Docker (Linux + Chromium)
4. New baselines are committed via Git LFS
5. Review the baseline diff in the PR

## Test Suites (Planned)

### Application Suite

Tests full application pages and user flows.

```bash
npm run test:visual:app
```

### Design System Suite

Tests individual design system components in isolation (Storybook).

```bash
npm run test:visual:design-system
```

### Combined

Run both suites:

```bash
npm run test:visual
```

## Storybook Integration (Planned)

Storybook provides isolated component testing:

```bash
npm run storybook
```

Visual regression tests will capture Storybook stories for:
- Button variants and states
- Card compositions
- Typography scales
- Color palettes
- Responsive breakpoints

## Baseline Update Process

### Never Blindly Update

❌ **DON'T:**
```bash
# This is wrong - baselines must come from CI
npm run test:visual:update
```

✅ **DO:**
1. Make intentional UI changes
2. Push to your branch
3. Trigger "Update Visual Regression Baselines" workflow in GitHub Actions
4. Review the diff in the PR
5. Approve and merge if the changes are correct

### When to Update Baselines

- **Intentional UI changes** - New designs, token updates, component refactors
- **Design system changes** - Color palette, typography, spacing changes
- **New components** - Adding new components or variants

### When NOT to Update Baselines

- **Build errors** - Fix the error, don't mask it
- **Flaky tests** - Investigate flakiness, don't hide it
- **Unintended changes** - Revert the change, don't accept it

## Git LFS

Baseline images are stored in Git LFS to keep the repository size manageable.

### Setup (For Contributors)

```bash
# Install Git LFS
git lfs install

# Pull LFS objects
git lfs pull
```

### Storage Location

```
tests/visual/baselines/
├── app/
│   ├── home-page.png
│   ├── greeting-detail.png
│   └── about-page.png
└── design-system/
    ├── button-variants.png
    ├── card-compositions.png
    └── typography.png
```

## Implementation Checklist

When implementing visual regression testing:

- [ ] Install Playwright or similar testing framework
- [ ] Configure Docker-based test environment
- [ ] Set up Git LFS for baseline storage
- [ ] Create GitHub Actions workflow for baseline updates
- [ ] Set up Storybook for component isolation
- [ ] Add visual regression test scripts to package.json
- [ ] Document exact Docker + browser versions
- [ ] Add visual regression gate to CI/CD pipeline
- [ ] Create baseline update workflow documentation

## Browser and Environment

Visual regression tests must run in a consistent environment:

- **OS:** Linux (Docker container)
- **Browser:** Chromium (specific version locked)
- **Viewport Sizes:** Mobile (375x667), Tablet (768x1024), Desktop (1920x1080)

## Troubleshooting (Future)

### Baseline Mismatches

If you see unexpected diffs:

1. **Check your changes** - Are they intentional?
2. **Run tests in CI** - Local environments may differ
3. **Review the diff** - Inspect pixel-by-pixel changes
4. **Update if correct** - Use the CI workflow

### Flaky Tests

If tests are flaky:

1. **Wait for animations** - Ensure all animations complete
2. **Stabilize data** - Use fixed mock data
3. **Check timings** - Add appropriate waits
4. **Report the issue** - Document flaky tests

## Resources

- **Playwright Docs:** https://playwright.dev
- **Git LFS Docs:** https://git-lfs.com
- **Storybook Docs:** https://storybook.js.org
- **Design System Guidelines:** `docs/design-system-guidelines.md`

---

## Summary

Visual regression testing is a **gate** for design system changes:

- Baselines are **CI-authoritative** (Linux + Chromium)
- Storage is **Git LFS**
- Updates via **GitHub Actions workflow**
- **Never** blindly update to pass tests
- Inspect diffs, verify intentional changes, then update

When implemented, visual regression testing will ensure design system consistency and catch unintended UI changes.
