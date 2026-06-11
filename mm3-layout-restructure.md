# HavenQuest — MM3 Layout Restructure Brief
**Date:** June 5, 2026  
**Prepared by:** Claude (COO)  
**Executed by:** Claude Code  
**Branch:** main  

---

## Overview

Restructure the MM3 Discover page layout to create a cleaner information hierarchy:
- **Left panel:** All financial controls in one place (Financial Picture + collapsible financial calculator)
- **Right panel:** Live City Rankings (no change)
- **Below both panels:** Priority Summary + priority selector grid

This is a layout reorganization only. Do not change any data, scoring logic, or existing copy unless explicitly specified below.

---

## Current Layout (for reference)

```
[ LEFT PANEL                    ] [ RIGHT PANEL                ]
[ YOUR FINANCIAL PICTURE        ] [ LIVE CITY RANKINGS         ]
[ Financial summary cards       ] [ Metro tabs                 ]
[ Stretched/Comfortable alert   ] [ City ranking cards         ]
[ ----------------------------- ] [                            ]
[ PRIORITY SUMMARY              ] [                            ]
[ Must Have / Important / Nice  ] [                            ]
[ Lock my financials button     ] [                            ]

[ ADJUST YOUR FINANCIAL PICTURE — full width below both panels ]
[ Down payment / Home sale proceeds / Rate / Loan term         ]

[ ADJUST YOUR PRIORITIES — full width below                    ]
[ Counter bar                                                  ]
[ Icon-in-circle priority selector grid                        ]
```

---

## Target Layout

```
[ LEFT PANEL                    ] [ RIGHT PANEL                ]
[ YOUR FINANCIAL PICTURE        ] [ LIVE CITY RANKINGS         ]
[ Financial summary cards       ] [ Metro tabs                 ]
[ Stretched/Comfortable alert   ] [ City ranking cards         ]
[ ----------------------------- ] [                            ]
[ ADJUST YOUR FINANCIAL PICTURE ] [                            ]
[ (collapsible — open by def.)  ] [                            ]
[ Down payment dropdown         ] [                            ]
[ Home sale proceeds dropdown   ] [                            ]
[ Rate slider                   ] [                            ]
[ Loan term toggle              ] [                            ]
[ ----------------------------- ] [                            ]
[ Lock my financials button     ] [                            ]

[ BELOW BOTH PANELS — full width                               ]
[ WHAT SHAPED YOUR RANKINGS                                    ]
[ Priority Summary display                                     ]
[ (Must Have / Important / Nice To Have tags — read only here) ]

[ ADJUST YOUR PRIORITIES — full width below                    ]
[ Counter bar                                                  ]
[ Icon-in-circle priority selector grid                        ]
```

---

## Detailed Instructions

### Step 1 — Move Priority Summary out of left panel

Remove the Priority Summary block (MUST HAVE / IMPORTANT / NICE TO HAVE tag display) from the left panel entirely.

Do not delete the component — it will be reused below the panels in Step 3.

### Step 2 — Move financial calculator into left panel (collapsible)

Take the "ADJUST YOUR FINANCIAL PICTURE" section that currently sits full-width below both panels and move it into the left panel, positioned between the financial summary cards and the Lock button.

**Make it collapsible:**
- Default state: expanded (open)
- Add a toggle header: "ADJUST YOUR FINANCIAL PICTURE" with a chevron icon (ChevronDown when open, ChevronRight when closed)
- When collapsed: only the header row is visible, calculator fields are hidden
- When expanded: all fields visible (down payment dropdown + exact amount field, home sale proceeds dropdown + exact amount field, rate slider, loan term toggle)
- Use a smooth CSS transition for open/close (max-height transition or similar)
- Store collapsed/expanded state in React local state (not sessionStorage)

The Lock button stays at the bottom of the left panel, below the collapsible calculator section.

Left panel bottom order:
1. Financial summary cards (down payment, est. mortgage, property tax, total housing)
2. Affordability alert (Stretched / Comfortable / Moderate)
3. Collapsible "ADJUST YOUR FINANCIAL PICTURE" section
4. "Lock my financials" button

### Step 3 — Add Priority Summary below panels with new header

Below both panels (full width), add a new section in this order:

**Section A — What Shaped Your Rankings**

```
Section label (gold, uppercase, small tracking):
WHAT SHAPED YOUR RANKINGS

Body copy (dark gray, normal weight):
These are the priorities you set. They're what drove your city rankings above. Adjust them below and watch your results update instantly.
```

Below that copy, render the existing Priority Summary tag display — the read-only view showing Must Have, Important, and Nice To Have category tags. This is the same component currently in the left panel, just repositioned here.

**Section B — Adjust Your Priorities**

Immediately below Section A, render the existing full priority selector:
- Counter bar (Unassigned / Nice To Have / Important / Must Have counts)
- Icon-in-circle grid (all 12 categories × 4 columns)

This section already exists — do not rebuild it, just ensure it renders in the correct position after the relocation.

---

## Spacing and Visual Notes

- The left panel will be taller after adding the calculator. Ensure the left panel scrolls independently if content overflows on smaller viewports — do not let it force the right panel taller.
- The collapsible section header should use the same gold uppercase label style as other section labels (MUST HAVE, YOUR FINANCIAL PICTURE, etc.)
- Maintain existing padding and card styling throughout — this is a repositioning, not a visual redesign.
- The full-width section below the panels should have the same top padding/margin as the existing "ADJUST YOUR PRIORITIES" section currently has.

---

## Copy Changes (exact)

**Collapsible section header (left panel):**
```
ADJUST YOUR FINANCIAL PICTURE
```
(same as current — no change)

**New section header above priority summary (below panels):**
```
WHAT SHAPED YOUR RANKINGS
```

**New body copy below that header:**
```
These are the priorities you set. They're what drove your city rankings above. Adjust them below and watch your results update instantly.
```

**Existing "ADJUST YOUR PRIORITIES" section label:** keep as-is, no change.

---

## What NOT to Change

- Do not change any scoring logic, data, or algorithm
- Do not change the Live City Rankings panel (right side) in any way
- Do not change the city selection behavior (Choose This Community buttons, max 3, confirmation gate)
- Do not change the Lock my financials behavior
- Do not change the orientation banner (worksheet banner with "Got it ✓")
- Do not change mobile layout beyond what is necessary to accommodate these changes

---

## Final Step — Commit and Deploy

After changes are complete and verified locally:

```
git add -A
git commit -m "feat: MM3 layout restructure — financial calculator into left panel, priority summary below rankings"
git push origin main
```

Confirm push succeeded and Vercel deployment triggered. Report back to Claude chat when complete.
