// Calibrates personality scores for 81 partial-translation cities in data/cities.ts
// Per AGENTS.md: multi-section edits to large files use Node scripts

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'data', 'cities.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Map of cityId -> new personality scores
// Format: [growthProfile, pace, culture, environment, lifestyleOrientation]
// Scoring guide:
//   growthProfile: 1=stable/established, 10=fast-growing/developing
//   pace: 1=slow/relaxed, 10=fast/busy
//   culture: 1=practical/traditional, 10=upscale/aspirational/amenity-rich
//   environment: 1=urban/dense, 10=rural/open/nature-forward
//   lifestyleOrientation: 1=practical/value, 10=luxury/premium

const calibrations = {
  // Gulf Coast / Waterfront
  'galveston-tx':       { growthProfile: 3, pace: 3, culture: 6, environment: 8, lifestyleOrientation: 5 },
  'corpus-christi-tx':  { growthProfile: 3, pace: 3, culture: 5, environment: 8, lifestyleOrientation: 4 },
  'lake-jackson-tx':    { growthProfile: 3, pace: 3, culture: 4, environment: 6, lifestyleOrientation: 4 },

  // Texas Hill Country
  'fredericksburg-tx':  { growthProfile: 2, pace: 2, culture: 7, environment: 8, lifestyleOrientation: 7 },
  'kerrville-tx':       { growthProfile: 2, pace: 2, culture: 4, environment: 8, lifestyleOrientation: 4 },
  'boerne-tx':          { growthProfile: 4, pace: 4, culture: 7, environment: 7, lifestyleOrientation: 7 },
  'new-braunfels-tx':   { growthProfile: 7, pace: 5, culture: 5, environment: 6, lifestyleOrientation: 5 },
  'san-marcos-tx':      { growthProfile: 7, pace: 6, culture: 4, environment: 5, lifestyleOrientation: 4 },

  // San Antonio Metro
  'san-antonio-tx':     { growthProfile: 4, pace: 6, culture: 5, environment: 3, lifestyleOrientation: 5 },
  'schertz-tx':         { growthProfile: 6, pace: 5, culture: 4, environment: 5, lifestyleOrientation: 4 },
  'cibolo-tx':          { growthProfile: 7, pace: 4, culture: 4, environment: 6, lifestyleOrientation: 4 },
  'converse-tx':        { growthProfile: 4, pace: 5, culture: 3, environment: 4, lifestyleOrientation: 3 },
  'universal-city-tx':  { growthProfile: 3, pace: 5, culture: 3, environment: 4, lifestyleOrientation: 3 },
  'live-oak-tx':        { growthProfile: 3, pace: 5, culture: 3, environment: 4, lifestyleOrientation: 3 },
  'helotes-tx':         { growthProfile: 4, pace: 4, culture: 6, environment: 7, lifestyleOrientation: 6 },

  // DFW Metro
  'southlake-tx':       { growthProfile: 3, pace: 5, culture: 9, environment: 4, lifestyleOrientation: 9 },
  'colleyville-tx':     { growthProfile: 3, pace: 5, culture: 8, environment: 5, lifestyleOrientation: 8 },
  'grapevine-tx':       { growthProfile: 4, pace: 5, culture: 7, environment: 4, lifestyleOrientation: 7 },
  'flower-mound-tx':    { growthProfile: 4, pace: 5, culture: 7, environment: 5, lifestyleOrientation: 7 },
  'keller-tx':          { growthProfile: 4, pace: 5, culture: 7, environment: 5, lifestyleOrientation: 7 },
  'frisco-tx':          { growthProfile: 9, pace: 7, culture: 8, environment: 4, lifestyleOrientation: 8 },
  'mckinney-tx':        { growthProfile: 8, pace: 6, culture: 7, environment: 4, lifestyleOrientation: 7 },
  'allen-tx':           { growthProfile: 7, pace: 6, culture: 6, environment: 4, lifestyleOrientation: 6 },
  'prosper-tx':         { growthProfile: 9, pace: 5, culture: 7, environment: 5, lifestyleOrientation: 7 },
  'celina-tx':          { growthProfile: 8, pace: 4, culture: 5, environment: 6, lifestyleOrientation: 5 },
  'mansfield-tx':       { growthProfile: 6, pace: 5, culture: 6, environment: 5, lifestyleOrientation: 6 },
  'midlothian-tx':      { growthProfile: 6, pace: 4, culture: 4, environment: 6, lifestyleOrientation: 4 },
  'weatherford-tx':     { growthProfile: 3, pace: 3, culture: 4, environment: 7, lifestyleOrientation: 4 },
  'granbury-tx':        { growthProfile: 3, pace: 3, culture: 6, environment: 7, lifestyleOrientation: 6 },
  'argyle-tx':          { growthProfile: 6, pace: 4, culture: 7, environment: 7, lifestyleOrientation: 7 },
  'denton-tx':          { growthProfile: 7, pace: 6, culture: 5, environment: 4, lifestyleOrientation: 4 },
  'lewisville-tx':      { growthProfile: 4, pace: 6, culture: 5, environment: 4, lifestyleOrientation: 5 },
  'carrollton-tx':      { growthProfile: 4, pace: 6, culture: 5, environment: 3, lifestyleOrientation: 5 },
  'richardson-tx':      { growthProfile: 4, pace: 6, culture: 6, environment: 3, lifestyleOrientation: 6 },
  'garland-tx':         { growthProfile: 3, pace: 6, culture: 4, environment: 3, lifestyleOrientation: 4 },
  'mesquite-tx':        { growthProfile: 3, pace: 6, culture: 4, environment: 3, lifestyleOrientation: 3 },
  'rowlett-tx':         { growthProfile: 5, pace: 5, culture: 5, environment: 5, lifestyleOrientation: 5 },
  'rockwall-tx':        { growthProfile: 7, pace: 5, culture: 7, environment: 5, lifestyleOrientation: 7 },
  'forney-tx':          { growthProfile: 7, pace: 4, culture: 4, environment: 6, lifestyleOrientation: 4 },
  'waxahachie-tx':      { growthProfile: 3, pace: 3, culture: 4, environment: 6, lifestyleOrientation: 4 },

  // Houston Metro
  'the-woodlands-tx':   { growthProfile: 4, pace: 5, culture: 8, environment: 6, lifestyleOrientation: 8 },
  'sugar-land-tx':      { growthProfile: 4, pace: 5, culture: 7, environment: 4, lifestyleOrientation: 7 },
  'katy-tx':            { growthProfile: 7, pace: 5, culture: 6, environment: 5, lifestyleOrientation: 6 },
  'pearland-tx':        { growthProfile: 7, pace: 5, culture: 5, environment: 4, lifestyleOrientation: 5 },
  'friendswood-tx':     { growthProfile: 4, pace: 5, culture: 6, environment: 5, lifestyleOrientation: 6 },
  'league-city-tx':     { growthProfile: 6, pace: 5, culture: 5, environment: 5, lifestyleOrientation: 5 },
  'conroe-tx':          { growthProfile: 6, pace: 4, culture: 4, environment: 6, lifestyleOrientation: 4 },
  'spring-tx':          { growthProfile: 4, pace: 5, culture: 4, environment: 5, lifestyleOrientation: 4 },
  'humble-tx':          { growthProfile: 3, pace: 5, culture: 4, environment: 4, lifestyleOrientation: 4 },
  'baytown-tx':         { growthProfile: 3, pace: 5, culture: 3, environment: 3, lifestyleOrientation: 3 },
  'pasadena-tx':        { growthProfile: 3, pace: 5, culture: 3, environment: 3, lifestyleOrientation: 3 },
  'missouri-city-tx':   { growthProfile: 4, pace: 5, culture: 6, environment: 4, lifestyleOrientation: 6 },
  'stafford-tx':        { growthProfile: 3, pace: 5, culture: 4, environment: 3, lifestyleOrientation: 4 },
  'richmond-tx':        { growthProfile: 6, pace: 4, culture: 4, environment: 5, lifestyleOrientation: 4 },
  'rosenberg-tx':       { growthProfile: 6, pace: 4, culture: 4, environment: 5, lifestyleOrientation: 4 },

  // Other Texas Cities
  'waco-tx':            { growthProfile: 7, pace: 5, culture: 5, environment: 4, lifestyleOrientation: 4 },
  'lubbock-tx':         { growthProfile: 4, pace: 5, culture: 4, environment: 4, lifestyleOrientation: 4 },
  'amarillo-tx':        { growthProfile: 3, pace: 5, culture: 4, environment: 5, lifestyleOrientation: 4 },
  'el-paso-tx':         { growthProfile: 3, pace: 5, culture: 4, environment: 4, lifestyleOrientation: 4 },
  'midland-tx':         { growthProfile: 6, pace: 5, culture: 5, environment: 4, lifestyleOrientation: 6 },
  'odessa-tx':          { growthProfile: 5, pace: 5, culture: 3, environment: 4, lifestyleOrientation: 3 },
  'abilene-tx':         { growthProfile: 3, pace: 4, culture: 4, environment: 5, lifestyleOrientation: 4 },
  'tyler-tx':           { growthProfile: 4, pace: 4, culture: 6, environment: 5, lifestyleOrientation: 6 },
  'longview-tx':        { growthProfile: 3, pace: 4, culture: 4, environment: 5, lifestyleOrientation: 4 },
  'texarkana-tx':       { growthProfile: 2, pace: 3, culture: 3, environment: 5, lifestyleOrientation: 3 },
  'nacogdoches-tx':     { growthProfile: 2, pace: 3, culture: 3, environment: 6, lifestyleOrientation: 3 },
  'lufkin-tx':          { growthProfile: 2, pace: 3, culture: 3, environment: 6, lifestyleOrientation: 3 },
  'beaumont-tx':        { growthProfile: 3, pace: 5, culture: 4, environment: 4, lifestyleOrientation: 4 },
  'port-arthur-tx':     { growthProfile: 2, pace: 4, culture: 3, environment: 4, lifestyleOrientation: 3 },
  'victoria-tx':        { growthProfile: 2, pace: 3, culture: 4, environment: 5, lifestyleOrientation: 4 },
  'laredo-tx':          { growthProfile: 3, pace: 5, culture: 4, environment: 4, lifestyleOrientation: 4 },
  'mcallen-tx':         { growthProfile: 7, pace: 5, culture: 5, environment: 4, lifestyleOrientation: 5 },
  'brownsville-tx':     { growthProfile: 3, pace: 5, culture: 4, environment: 4, lifestyleOrientation: 4 },
  'harlingen-tx':       { growthProfile: 3, pace: 4, culture: 4, environment: 4, lifestyleOrientation: 4 },
  'edinburg-tx':        { growthProfile: 7, pace: 5, culture: 4, environment: 4, lifestyleOrientation: 4 },
  'san-angelo-tx':      { growthProfile: 2, pace: 3, culture: 4, environment: 6, lifestyleOrientation: 4 },
  'temple-tx':          { growthProfile: 5, pace: 4, culture: 4, environment: 5, lifestyleOrientation: 4 },
  'killeen-tx':         { growthProfile: 4, pace: 5, culture: 3, environment: 4, lifestyleOrientation: 3 },
  'wichita-falls-tx':   { growthProfile: 2, pace: 3, culture: 3, environment: 5, lifestyleOrientation: 3 },
  'sherman-tx':         { growthProfile: 6, pace: 4, culture: 4, environment: 5, lifestyleOrientation: 4 },
}

let appliedCount = 0
let skippedIds = []

for (const [cityId, scores] of Object.entries(calibrations)) {
  const { growthProfile, pace, culture, environment, lifestyleOrientation } = scores

  // Match the personality block for this city using its id field as anchor
  // Pattern: id: 'city-id', ... personality: { growthProfile: N, pace: N, culture: N, environment: N, lifestyleOrientation: N }
  // We need to find the personality block that follows this city's id
  // Strategy: find the id line, then find the NEXT personality block after it, only if dnaDataSource is partial-translation

  // Use regex to find the city block and replace its personality scores
  // The personality block always appears in a consistent format
  const idPattern = new RegExp(
    `(id: '${cityId}'[\\s\\S]*?personality: \\{\\s*growthProfile: )\\d+(,\\s*pace: )\\d+(,\\s*culture: )\\d+(,\\s*environment: )\\d+(,\\s*lifestyleOrientation: )\\d+`,
    'g'
  )

  const replaced = content.replace(idPattern, (match, p1, p2, p3, p4, p5) => {
    return `${p1}${growthProfile}${p2}${pace}${p3}${culture}${p4}${environment}${p5}${lifestyleOrientation}`
  })

  if (replaced === content) {
    skippedIds.push(cityId + ' (no match found)')
  } else {
    content = replaced
    appliedCount++
  }
}

fs.writeFileSync(filePath, content, 'utf8')

console.log(`\nApplied: ${appliedCount} cities`)
if (skippedIds.length > 0) {
  console.log(`Skipped (not found in file): ${skippedIds.join(', ')}`)
} else {
  console.log('All cities matched and updated.')
}
