# HavenQuest — Market Zones Page Brief
**Prepared by:** Claude (COO/Chief Editor)  
**Date:** May 29, 2026  
**Status:** Ready for Claude Code implementation  
**Priority:** P1 — Required before realtor outreach begins

---

## Overview

Create a new public page at `app/zones/page.tsx` — accessible at `havenquest.co/zones`. This page lists all 51 market zones across all 4 metros plus standalone cities, with the cities included in each zone clearly listed.

Add a small "View market zones →" link next to the Market Specialty dropdown in the realtor application form in `components/for-realtors/ForRealtorsClient.tsx`. The link opens `/zones` in a new tab.

---

## Page Design

- Use the same layout, header, and footer as the Methodology page
- Page title: "HavenQuest Market Zones"
- Subtitle: "Every zone and the cities it covers. Select the zone that best represents your primary market when applying to join the network."
- Organize into 5 sections — one per metro plus standalone
- Each section has a section header (metro name)
- Each zone is a card or row showing: zone name + city list
- No authentication required — public page

---

## Complete Zone + City Content

### AUSTIN METRO

**Urban Core Austin**
Cities: Austin

**Northwest Austin / Cedar Park / Leander**
Cities: Cedar Park, Leander, Liberty Hill

**Round Rock / Pflugerville / Hutto Corridor**
Cities: Round Rock, Pflugerville, Hutto, Taylor

**Georgetown / North Growth Corridor**
Cities: Georgetown

**East Austin**
Cities: Manor

**South Austin**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**Southwest Austin / Dripping Springs**
Cities: Dripping Springs

**Lake Travis / Hill Country Galleria**
Cities: Lakeway, Bee Cave

**Kyle / Buda / South Growth Corridor**
Cities: Kyle, Buda, San Marcos, Bastrop, Lockhart

**Westlake / West Austin**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**Texas Hill Country**
Cities: Wimberley, Marble Falls, Kerrville, Fredericksburg, Canyon Lake

---

### DALLAS-FORT WORTH METRO

**Urban Core Dallas**
Cities: Dallas

**North Dallas / Platinum Corridor**
Cities: Plano, Richardson, Carrollton

**Collin County Growth Corridor**
Cities: Frisco, McKinney, Allen, Prosper, Celina, Anna

**Luxury North Suburbs**
Cities: Southlake, Keller, Colleyville, Trophy Club

**Mid-Cities / Airport Corridor**
Cities: Irving, Grapevine, Coppell, Arlington, Grand Prairie

**Fort Worth Urban Core**
Cities: Fort Worth

**Alliance / North Fort Worth**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**West Fort Worth & Parker County**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**South Fort Worth / Mansfield Corridor**
Cities: Mansfield, Burleson, Midlothian

**Denton County Growth Belt**
Cities: Flower Mound, Argyle, Denton, Lewisville, Little Elm

**East Dallas & Lake Communities**
Cities: Rockwall, Wylie, Forney, Heath, Garland, Mesquite

**Southern Sector / Best Southwest**
Cities: Cedar Hill, DeSoto, Waxahachie

---

### HOUSTON METRO

**Inner Loop / Urban Core Houston**
Cities: Houston

**The Heights / Inner Northwest**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**West University / Bellaire / Memorial**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**The Woodlands / North Houston**
Cities: The Woodlands

**Spring / Klein / Champions Corridor**
Cities: Spring, Tomball

**Katy / Fulshear / West Houston Energy Corridor**
Cities: Katy, Fulshear

**Sugar Land / Fort Bend County**
Cities: Sugar Land, Missouri City

**Pearland / South Houston**
Cities: Pearland, Manvel, Alvin

**Clear Lake / NASA / Southeast Houston**
Cities: League City, Friendswood, Dickinson, Webster

**Cypress / Northwest Houston**
Cities: Cypress

**Kingwood / Lake Houston Corridor**
Cities: Humble

**Baytown / East Houston Industrial Corridor**
Cities: Baytown, Pasadena, Deer Park

**Richmond / Rosenberg / Southwest Growth Corridor**
Cities: Richmond, Rosenberg

**Conroe / Montgomery County North Growth Belt**
Cities: Conroe

**Galveston Island / Gulf Coast**
Cities: Galveston, Texas City

**Brazosport / Gulf Coast South**
Cities: Lake Jackson

---

### SAN ANTONIO METRO

**Urban Core / Central San Antonio**
Cities: San Antonio

**Alamo Heights / Terrell Hills / Olmos Park**
Cities: Alamo Heights

**North Central San Antonio**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**Stone Oak / Far North San Antonio**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**The Dominion / I-10 Luxury Corridor**
Cities: (no current HavenQuest cities — zone reserved for future expansion)

**Northwest San Antonio / Helotes**
Cities: Helotes

**Boerne / Fair Oaks Ranch / Hill Country Corridor**
Cities: Boerne, Fair Oaks Ranch

**New Braunfels / I-35 Northeast Growth Corridor**
Cities: New Braunfels, Seguin

**Schertz / Cibolo / Universal City**
Cities: Schertz, Cibolo, Universal City

**South San Antonio / Mission Corridor**
Cities: Pleasanton

**West San Antonio / Alamo Ranch**
Cities: Leon Valley

**East San Antonio / Converse Corridor**
Cities: Converse

**Texas Hill Country**
Cities: Kerrville, Fredericksburg, Canyon Lake, Wimberley, Marble Falls

---

### STANDALONE MARKETS

**Waco**
Cities: Waco

**Corpus Christi**
Cities: Corpus Christi

---

## Notes for Claude Code

1. Zones with no current cities should still appear on the page — label them "Expanding soon" or "Zone reserved — no current cities" so realtors understand the network is growing

2. The page does not require authentication — it is public

3. Add a CTA at the bottom: "Ready to apply? Join the HavenQuest Realtor Network →" linking to `/for-realtors`

4. Add the link in the realtor application form — small text link next to or below the Market Specialty dropdown label: "Not sure which zone? View all market zones →" — opens `/zones` in a new tab (`target="_blank"`)

5. Match the visual style of the Methodology page — clean white card sections, consistent typography, no sidebar

6. Run `tsc --noEmit` after all changes. Commit and push.

---

*Brief prepared by Claude — HavenQuest COO/Chief Editor. May 29, 2026.*
