// Updates Field, SectionHeading, PillGroup, and heading styles in all MM4 section files
// Per AGENTS.md: multi-section edits to large files use Node scripts

const fs = require('fs')
const path = require('path')

const sectionsDir = path.join(__dirname, '..', 'app', 'portal', 'mm4', 'components', 'sections')

const files = [
  'Section1Identity.tsx',
  'Section2Household.tsx',
  'Section2TheMove.tsx',
  'Section3Employment.tsx',
  'Section4TexasDirection.tsx',
  'Section5Notes.tsx',
]

// ── Shared replacements applied to all section files ──

// 1. Field label color: #86868b → rgba(10,30,61,0.5)
const sharedReplacements = [
  // Field label color
  [
    /fontSize: '12px', color: '#86868b', marginBottom: '6px'/g,
    `fontSize: '12px', color: 'rgba(10,30,61,0.5)', marginBottom: '7px'`
  ],
  // SectionHeading style block
  [
    /fontSize: '12px',\s*\n\s*fontWeight: 500,\s*\n\s*letterSpacing: '0\.05em',\s*\n\s*color: '#86868b',\s*\n\s*textTransform: 'uppercase',\s*\n\s*margin: '24px 0 10px',/g,
    `fontSize: '10px',\n      fontWeight: 600,\n      letterSpacing: '1.5px',\n      color: 'rgba(197,183,131,0.9)',\n      textTransform: 'uppercase',\n      margin: '0 0 16px',`
  ],
  // Section h2 titles
  [
    /fontSize: '22px', fontWeight: 500, color: '#1d1d1f', margin: '0 0 4px'/g,
    `fontSize: '24px', fontWeight: 500, color: '#0A1E3D', letterSpacing: '-0.5px', margin: '0 0 6px'`
  ],
  [
    /fontSize: '22px', fontWeight: 500, color: '#1d1d1f', margin: '0 0 6px'/g,
    `fontSize: '24px', fontWeight: 500, color: '#0A1E3D', letterSpacing: '-0.5px', margin: '0 0 6px'`
  ],
  // Section subtitle
  [
    /fontSize: '15px', color: '#86868b', margin: 0, lineHeight: 1\.5/g,
    `fontSize: '14px', color: 'rgba(10,30,61,0.45)', margin: 0, lineHeight: 1.6`
  ],
  // PillGroup selected state: #ffffff → white text, #0076B6 → #0A1E3D bg/border
  [
    /color: selected \? '#ffffff' : '#86868b',\s*\n\s*backgroundColor: selected \? '#0076B6' : 'transparent',\s*\n\s*border: `1\.5px solid \$\{selected \? '#0076B6' : 'var\(--card-border\)'\}`,/g,
    `color: selected ? '#FFFFFF' : 'rgba(10,30,61,0.55)',\n              backgroundColor: selected ? '#0A1E3D' : 'transparent',\n              border: \`0.5px solid \${selected ? '#0A1E3D' : 'rgba(10,30,61,0.15)'}\`,`
  ],
  // PillGroup error required star: #0076B6 → #C5B783
  [
    /color: '#0076B6', marginLeft: '2px'/g,
    `color: '#C5B783', marginLeft: '2px'`
  ],
  // hint text color
  [
    /fontSize: '12px', color: '#86868b', margin: '-2px 0 8px'/g,
    `fontSize: '12px', color: 'rgba(10,30,61,0.35)', margin: '-2px 0 8px'`
  ],
  // error text
  [
    /fontSize: '11px', color: '#DC2626', marginTop: '4px'/g,
    `fontSize: '11px', color: '#DC2626', marginTop: '4px'`
  ],
]

let totalChanges = 0

for (const filename of files) {
  const filePath = path.join(sectionsDir, filename)
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${filename}`)
    continue
  }

  let content = fs.readFileSync(filePath, 'utf8')
  let changed = 0

  for (const [pattern, replacement] of sharedReplacements) {
    const before = content
    content = content.replace(pattern, replacement)
    if (content !== before) changed++
  }

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`${filename}: ${changed} replacement(s) applied`)
  totalChanges += changed
}

console.log(`\nTotal: ${totalChanges} replacements across ${files.length} files`)
