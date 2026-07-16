# Navbar Icon Implementation Plan

## Goal
Make all three pages (index.html, quick-entry.html, display.html) use index.html's simple `.nav-links` navbar structure, and add SVG icons to all nav links and logout buttons.

## Changes

### 1. style.css

**a) Modify `.nav a`** — add flex layout for icon+text:
```css
.nav a {
  text-decoration: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

**b) Modify `.nav-logout`** — add flex layout for icon+text:
```css
.nav-logout {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #dc2626;
  background: #fff;
  border: 1.5px solid #fecaca;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
```

**c) Add SVG icon styles** after `.nav a:not(.active):hover`:
```css
.nav a svg,
.nav-logout svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}
```

---

### 2. index.html (lines 14-21)

Replace nav block with SVG icons:

```html
    <nav class="nav">
      <div class="nav-links">
        <a href="quick-entry.html">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Quick Entry
        </a>
        <a href="index.html" class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Full Entry
        </a>
        <a href="display.html">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3v18h18"/>
            <path d="M7 16v-3"/>
            <path d="M12 16v-7"/>
            <path d="M17 16V8"/>
          </svg>
          Display
        </a>
      </div>
      <button class="nav-logout" id="logoutBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </nav>
```

---

### 3. display.html (lines 15-22)

Same as index.html but with `active` on Display link:
- `<a href="display.html" class="active">` (remove active from index link)

---

### 4. quick-entry.html

**a) Nav HTML (lines 885-924)** — Replace with nav-links structure, `active` on Quick Entry, same SVGs

**b) Inline nav CSS (lines 30-133)** — Replace old `.nav-tab`/`.nav-tabs` CSS with style.css-equivalent rules:

```css
    /* ===== Navigation ===== */
    .nav {
      max-width: 900px;
      margin: 0 auto 2rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
      margin: 0 auto;
    }

    .nav a {
      text-decoration: none;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .nav a.active {
      background: #4F46E5;
      color: #fff;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
    }

    .nav a:not(.active) {
      background: #fff;
      color: #4F46E5;
      border: 1px solid #E2E8F0;
    }

    .nav a:not(.active):hover {
      border-color: #4F46E5;
      background: #F8F7FF;
    }

    .nav a svg,
    .nav-logout svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      flex-shrink: 0;
    }

    .nav-logout {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      color: #EF4444;
      background: #fff;
      border: 1.5px solid #FCA5A5;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .nav-logout:hover {
      background: #FEF2F2;
      border-color: #EF4444;
    }
```

**c) Tablet responsive (around lines 703-731)** — Replace nav-related rules:
```css
      .nav {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .nav-links {
        flex: 1;
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav a {
        padding: 0.6rem 1.25rem;
        font-size: 0.9rem;
      }
```

**d) Mobile responsive (around lines 761-792)** — Replace nav-related rules:
```css
      .nav {
        flex-direction: column;
      }

      .nav-links {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav a {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }

      .nav-logout {
        width: 100%;
        justify-content: center;
      }
```

## Icons Used

| Link | Icon | SVG path |
|------|------|----------|
| Quick Entry | Lightning bolt | `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>` |
| Full Entry | Document | `M14 2H6a2 2 0 0 0-2 2v16...` (file + lines) |
| Display | Bar chart | `M3 3v18h18` + 3 bar paths |
| Logout | Exit door | `M9 21H5a2 2...` + arrow polyline |
