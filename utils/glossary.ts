// Ask Amy — Part 2 data layer (educational glossary + curated Q&A).
//
// Pure static content, consumed ONLY by components/portal/amy/AmyPanel.tsx for display.
// This module imports NOTHING and touches NOTHING outside itself: no matching engine, no
// scorer, no Supabase, no activity logging. It is display data only and must stay that way.
//
// Editorial rule, every entry: explain the general "what is it / how does it work" plainly,
// then hand anything specific-to-your-move to the Market Director via the `handoff` line.
// `fact` is an optional Texas-specific detail block. `source` is our own provenance record
// and is NOT shown to users.
//
// Handoff visibility: the UI hides the handoff line only when `handoff` is an empty string.
// Exactly ONE entry uses this — the "summers" question (pure lifestyle info). Every other
// entry, including the "which neighborhood should I choose" deflect, renders its handoff.

export type AmyCategory =
  | 'texas' | 'taxes' | 'buying' // glossary groups
  | 'cost' | 'settling' | 'life' // q&a groups

export type AmyKind = 'term' | 'question'

export interface AmyEntry {
  id: string
  kind: AmyKind
  label: string // the term, or the question
  abbr?: string // e.g. "Municipal Utility District"
  category: AmyCategory
  body: string // plain-language explanation
  fact?: string // optional Texas-specific detail block ('' when none)
  handoff: string // Market-Director handoff line ('' hides the line — summers only)
  source: string // our provenance record; not shown to users
}

// Display labels + tab order for the two modes. Kept here (data layer) so AmyPanel reuses
// them rather than hardcoding label strings in the UI.
export const CATEGORY_LABELS: Record<AmyCategory, string> = {
  texas: 'Texas-specific',
  taxes: 'Taxes',
  buying: 'Buying',
  cost: 'Taxes & cost',
  settling: 'Getting settled',
  life: 'Life in Texas',
}

export const GLOSSARY_CATEGORIES: AmyCategory[] = ['texas', 'taxes', 'buying']
export const QUESTION_CATEGORIES: AmyCategory[] = ['cost', 'settling', 'life']

export const AMY_ENTRIES: AmyEntry[] = [
  // ── GLOSSARY (16 terms) ──────────────────────────────────────────────
  {
    id: 'mud',
    kind: 'term',
    label: 'MUD',
    abbr: 'Municipal Utility District',
    category: 'texas',
    body: "A local district that provides water, sewer, and drainage in newer developments where city utilities haven't been extended. To pay for that infrastructure, a MUD adds its own tax to your property tax bill.",
    fact: "In Texas, a MUD tax appears on your property tax bill but is charged separately from city, county, and school taxes. It often starts higher in a new community and can decrease over time as the original cost is paid down. The homestead exemption usually does not reduce MUD tax.",
    handoff: "Whether a specific home's MUD rate is a good deal — and where it's headed — is exactly what your Market Director reviews with you before you make an offer.",
    source: 'Redfin; Texas Water Code Ch. 49 / TCEQ',
  },
  {
    id: 'pid',
    kind: 'term',
    label: 'PID',
    abbr: 'Public Improvement District',
    category: 'texas',
    body: "A district a city or county sets up to fund improvements in an area — things like landscaping, sidewalks, lighting, parks, and common-area upkeep. Homeowners inside it pay a special assessment toward those improvements.",
    fact: "A PID assessment can appear on your tax bill or be billed separately, and unlike a MUD (which is based on your property value), a PID assessment is often a fixed amount. It usually ends once the improvement is paid off.",
    handoff: "Whether a PID assessment is worth it for a specific home is a question for your Market Director.",
    source: 'Texas Real Estate Source; Old Republic Title',
  },
  {
    id: 'pud',
    kind: 'term',
    label: 'PUD',
    abbr: 'Planned Unit Development',
    category: 'texas',
    body: "A planned neighborhood built around shared amenities — parks, trails, pools, common areas. It's a community design, not a tax district.",
    fact: "The cost of a PUD usually shows up as HOA dues rather than a special tax — different from a MUD or PID.",
    handoff: "Your Market Director can tell you what a specific PUD's dues cover.",
    source: 'Redfin',
  },
  {
    id: 'homestead-exemption',
    kind: 'term',
    label: 'Homestead Exemption',
    category: 'taxes',
    body: "A tax break on your primary Texas home. It removes a chunk of your home's value before school-district property tax is calculated, which lowers your bill.",
    fact: "For 2026, the school-district homestead exemption removes $140,000 from your taxable value. You apply once with your county appraisal district (Form 50-114), and the address on your Texas ID has to match the home. The filing deadline for a tax year is April 30.",
    handoff: "Your Market Director can point you to your county's appraisal district and the current forms when you're ready to file.",
    source: 'Texas Comptroller Form 50-114; county appraisal districts (2026)',
  },
  {
    id: 'homestead-cap',
    kind: 'term',
    label: 'Homestead Cap',
    abbr: '10% appraisal cap',
    category: 'taxes',
    body: "Once you have a homestead exemption on your primary home, Texas limits how much the taxable value can rise each year — generally no more than 10%, even if the market value jumps more.",
    fact: "This is why a Texas appraisal notice shows several numbers — market value, appraised value, and assessed value can all differ. The cap slows how fast your taxable value climbs; it doesn't freeze your bill, and it resets if the home changes hands.",
    handoff: "If your appraisal looks high, whether to protest it is a personal call — your Market Director can point you to the right resources and deadlines.",
    source: 'County appraisal districts; Texas Property Tax Code',
  },
  {
    id: 'property-tax-protest',
    kind: 'term',
    label: 'Property Tax Protest',
    category: 'taxes',
    body: "Every year, Texas homeowners can challenge the value the appraisal district put on their home. If the district agrees the value is too high, your taxable value drops and your bill can go down.",
    fact: "Protesting is separate from the homestead exemption — you can have the exemption and still be over-appraised. There's an annual deadline (commonly in spring), and you can do it yourself or hire a service.",
    handoff: "Whether it's worth protesting a specific home, and how, is something your Market Director can help you think through.",
    source: 'County appraisal districts; Texas Comptroller',
  },
  {
    id: 'appraised-vs-market-value',
    kind: 'term',
    label: 'Appraised vs. Market Value',
    category: 'taxes',
    body: "Two different numbers on your Texas tax paperwork. Market value is what the appraisal district thinks your home would sell for. Appraised (or assessed) value is what you're actually taxed on — which, with a homestead cap, can be lower.",
    fact: "When these two numbers drift apart, it's usually the homestead cap at work. Knowing which is which tells you whether a protest could actually lower your bill.",
    handoff: "Your Market Director can help you read your specific appraisal notice.",
    source: 'County appraisal districts (FBCAD, NTPTS)',
  },
  {
    id: 'escrow',
    kind: 'term',
    label: 'Escrow',
    category: 'buying',
    body: "The word gets used two ways. Before closing, escrow is a neutral third party holding the money and documents until every condition of the sale is met. After closing, an escrow account is where your lender collects a bit of your property tax and insurance each month and pays those bills for you.",
    fact: '',
    handoff: "How your specific escrow and closing funds are handled is something your Market Director and your title company walk you through.",
    source: 'Standard home-buying references (Bank of America, FastExpert)',
  },
  {
    id: 'earnest-money',
    kind: 'term',
    label: 'Earnest Money',
    category: 'buying',
    body: "A good-faith deposit you put down when your offer is accepted, showing you're serious. It's typically 1-3% of the price and is held in escrow.",
    fact: "If the sale closes, your earnest money usually goes toward your down payment or closing costs. If you back out for a reason your contract allows, you may get it back; if you walk away without a covered reason, you can lose it.",
    handoff: "Your Market Director helps you understand the earnest-money terms in a specific offer.",
    source: 'Standard home-buying references',
  },
  {
    id: 'piti',
    kind: 'term',
    label: 'PITI',
    abbr: 'Principal, Interest, Taxes, Insurance',
    category: 'buying',
    body: "The four parts of a typical monthly mortgage payment: principal (paying down the loan), interest (the cost of borrowing), property taxes, and homeowner's insurance.",
    fact: "Lenders often collect the taxes and insurance portions in an escrow account and pay those bills for you. It's why your monthly payment is usually more than just principal and interest — and it's the full number HavenQuest uses to judge affordability.",
    handoff: "Your Market Director and lender can walk through your specific PITI.",
    source: 'Standard mortgage references',
  },
  {
    id: 'title-insurance',
    kind: 'term',
    label: 'Title Insurance',
    category: 'buying',
    body: "A one-time policy that protects you (and your lender) if someone later claims a right to your property — an old lien, an ownership dispute, a paperwork error from the past.",
    fact: "Before closing, a title company searches the property's history to make sure the title is clear. In Texas, title insurance rates are set by the state.",
    handoff: "Your title company and Market Director handle the title work for a specific home.",
    source: 'Standard home-buying references; Texas Dept. of Insurance',
  },
  {
    id: 'closing-costs',
    kind: 'term',
    label: 'Closing Costs',
    category: 'buying',
    body: "The fees you pay to finalize the purchase, on top of your down payment — things like lender fees, title fees, appraisal, and prepaid taxes and insurance.",
    fact: "They typically run about 2-5% of the loan amount and are paid at or just before closing. HavenQuest's 'cash to close' estimate rolls these in with your down payment.",
    handoff: "Your Market Director and lender give you the specific closing-cost breakdown for a home.",
    source: 'Standard home-buying references',
  },
  {
    id: 'hoa',
    kind: 'term',
    label: 'HOA',
    abbr: 'Homeowners Association',
    category: 'buying',
    body: "In many neighborhoods, an association that maintains shared spaces and sets community rules, funded by dues you pay as a homeowner.",
    fact: "HOA dues are separate from your mortgage and property tax. What they cover — and how strict the rules are — varies a lot from one community to another.",
    handoff: "Your Market Director can tell you what a specific HOA's dues and rules involve.",
    source: 'Standard home-buying references',
  },
  {
    id: 'property-survey',
    kind: 'term',
    label: 'Property Survey',
    category: 'buying',
    body: "A drawing of your property's exact boundaries — where your land starts and stops, and where structures, fences, and easements sit.",
    fact: "A survey can matter in Texas for fences, additions, and confirming there are no encroachments. Sometimes an existing survey can be reused; sometimes a new one is needed.",
    handoff: "Your Market Director and title company sort out whether a specific purchase needs a new survey.",
    source: 'Standard home-buying references',
  },
  {
    id: 'option-period',
    kind: 'term',
    label: 'Option Period',
    category: 'texas',
    body: "A Texas-specific window at the start of a contract when you can back out for any reason and get your earnest money back, in exchange for a small fee. It's your time to inspect the home.",
    fact: "The length and fee are negotiated in the contract. It's when buyers usually do their home inspection, because they can still walk away.",
    handoff: "How to use the option period on a specific home — and how long to negotiate — is exactly what your Market Director advises on.",
    source: 'Texas real-estate contract standards (TREC)',
  },
  {
    id: 'flood-zone',
    kind: 'term',
    label: 'Flood Zone',
    category: 'texas',
    body: "An area FEMA maps as having a higher chance of flooding. If a home is in one, your lender will usually require flood insurance on top of regular homeowner's insurance.",
    fact: "Parts of Texas flood that aren't in a mapped zone, and zones get redrawn. Whether a specific home needs flood insurance depends on its exact location and lender.",
    handoff: "Your Market Director can help you check a specific home's flood status and what insurance it would need.",
    source: 'FEMA flood maps; standard insurance references',
  },

  // ── COMMON QUESTIONS (14) ────────────────────────────────────────────
  {
    id: 'q-no-state-income-tax',
    kind: 'question',
    label: 'Texas has no state income tax — so is it cheaper overall?',
    category: 'cost',
    body: "Often, yes — but it's a trade, not a free lunch. Texas has no state income tax, which is a real saving, especially for higher earners and retirees. In exchange, Texas leans on property tax and sales tax, and property tax here runs higher than in many states.",
    fact: "Whether you come out ahead depends on your income and the home you buy. A high earner moving from a high-income-tax state usually saves; someone with modest income buying an expensive home may find the property tax offsets more of the gain.",
    handoff: "Your own before-and-after picture — income, home price, and the exact local rates — is something your Market Director can walk through with you.",
    source: 'HOMEiA; USTax Tools; Texas State Tax Guide 2026',
  },
  {
    id: 'q-property-taxes-higher',
    kind: 'question',
    label: 'Why are Texas property taxes higher, and what brings them down?',
    category: 'cost',
    body: "Texas has no income tax, so property tax carries more of the load — funding schools, emergency services, and infrastructure. That's why rates look high compared to other states.",
    fact: "The main things that bring your bill down: the homestead exemption on your primary residence, the 10% homestead cap on how fast your taxable value can rise, and protesting an over-high appraisal. Many newcomers still come out ahead overall because there's no income tax.",
    handoff: "Your Market Director can point you to the exemptions and deadlines for your specific county.",
    source: 'Texas Tax Experts; Comptroller',
  },
  {
    id: 'q-homestead-when-file',
    kind: 'question',
    label: 'What is the homestead exemption and when do I file it?',
    category: 'cost',
    body: "It's a tax break on your primary home that removes part of its value before school-district tax is figured — lowering your bill. For 2026 that's $140,000 off your taxable value for schools.",
    fact: "You file once with your county appraisal district using Form 50-114, after you close. The deadline for a tax year is April 30, and the address on your Texas ID needs to match the home.",
    handoff: "Your Market Director can point you to your county's filing when the time comes.",
    source: 'Comptroller Form 50-114; Neuhaus Realty (2026)',
  },
  {
    id: 'q-protest-appraisal',
    kind: 'question',
    label: 'Should I protest my property appraisal?',
    category: 'cost',
    body: "Every Texas homeowner can challenge the value the county puts on their home each year. If your home looks over-valued compared to what it would actually sell for, a protest can lower your taxable value — and your bill.",
    fact: "Protesting is separate from the homestead exemption; you can have the exemption and still be over-appraised. There's an annual deadline, usually in spring.",
    handoff: "Whether it's worth protesting your specific home is a personal call your Market Director can help you think through.",
    source: 'Ownwell; hometaxshield; Resolute',
  },
  {
    id: 'q-mud-pid-listings',
    kind: 'question',
    label: 'What are MUD or PID taxes I see on some listings?',
    category: 'cost',
    body: "Both are ways newer Texas communities pay for infrastructure, and both can add to your costs. A MUD funds water/sewer/drainage and adds a tax to your property tax bill. A PID funds improvements like parks and landscaping through a separate assessment.",
    fact: "A listing that says 'No MUD or PID' is pointing out it doesn't carry those extra costs. MUD taxes often decrease over time; PID assessments usually end once the improvement is paid off.",
    handoff: "Your Market Director can pull the specific MUD/PID details for any home you're considering.",
    source: 'Texas Real Estate Source; M/I Homes',
  },
  {
    id: 'q-license-and-registration',
    kind: 'question',
    label: 'How long do I have to get a Texas license and register my car?',
    category: 'settling',
    body: "Two different clocks, and the car one is tighter.",
    fact: "Driver's license — 90 days. New residents get a Texas license within 90 days; if you surrender a valid out-of-state license you usually skip the driving test. Book a DPS appointment online. Vehicle registration — 30 days. Register at your county tax office (not DPS) with your out-of-state title, proof of Texas insurance, and Form 130-U. Texas dropped the safety inspection for most non-commercial vehicles in January 2025, though some counties still require an emissions test.",
    handoff: "Your Market Director can point you to the right county offices and current forms for where you land.",
    source: 'TxDMV; Texas DPS; Neuhaus Realty (2026)',
  },
  {
    id: 'q-set-up-electricity',
    kind: 'question',
    label: "How do I set up electricity — what's this about choosing a provider?",
    category: 'settling',
    body: "In much of Texas the electricity market is deregulated, which means you choose your provider and plan rather than being assigned one. In some areas (like Austin proper) a single city utility serves you instead.",
    fact: "Set up electric service about a week before move-in so power is on at closing — earlier in peak summer. Whether you shop providers or use a city utility depends on your exact address.",
    handoff: "Your Market Director can tell you which applies in the area you're moving to.",
    source: 'Payless Power; Grewal RE (Austin); Octopus Energy',
  },
  {
    id: 'q-search-timing',
    kind: 'question',
    label: 'How far ahead should I start my home search before moving?',
    category: 'settling',
    body: "A common rule of thumb is to start seriously looking about 60-90 days before your target move date — enough time to explore areas, get your financing lined up, and not feel rushed into a decision.",
    fact: "Relocation adds steps a local move doesn't have — you may be house-hunting from out of state, coordinating a sale, and learning new areas at once. Starting early is what keeps it calm.",
    handoff: "This is exactly where HavenQuest and your Market Director come in — helping you explore and narrow before you're on the ground.",
    source: 'Grewal RE; relocation guides (2026)',
  },
  {
    id: 'q-closing-costs-expect',
    kind: 'question',
    label: 'What closing costs should I expect?',
    category: 'settling',
    body: "On top of your down payment, closing costs are the fees to finalize the purchase — lender fees, title, appraisal, and prepaid taxes and insurance. They typically run about 2-5% of the loan.",
    fact: "HavenQuest's 'cash to close' estimate already rolls these in with your down payment, so you get a rough all-in number to plan around.",
    handoff: "Your Market Director and lender give you the exact breakdown for a specific home.",
    source: 'Standard home-buying references',
  },
  {
    id: 'q-summers',
    kind: 'question',
    label: 'Do Texas summers really take getting used to?',
    category: 'life',
    body: "For many newcomers, yes — especially coming from cooler or less humid places. Texas summers are hot and can be humid, and good air conditioning becomes part of daily life.",
    fact: "It affects your routine and your energy bill. Many people adjust within a season, and the trade-off is mild winters in much of the state.",
    handoff: '', // pure lifestyle info — no handoff; UI hides the handoff line when blank
    source: 'HOMEiA; Texas relocation guides',
  },
  {
    id: 'q-schools',
    kind: 'question',
    label: 'Are the schools good, and how do I judge them?',
    category: 'life',
    body: "Texas school quality varies by district and campus, so the honest answer is 'it depends where.' The state assigns accountability ratings, and HavenQuest uses real school ratings as one of your match factors.",
    fact: "Ratings are a starting point, not the whole story — fit also depends on programs, size, and your family. HavenQuest shows the rating for each city so you can compare.",
    handoff: "Your Market Director can dig into specific districts and campuses for your family.",
    source: 'TEA ratings; HavenQuest match data',
  },
  {
    id: 'q-commute-traffic',
    kind: 'question',
    label: "What's the commute and traffic like?",
    category: 'life',
    body: "Texas cities are spread out, and traffic in the big metros (Austin, Dallas-Fort Worth, Houston) can be heavy at peak times. Public transit exists but is limited outside urban cores, so most people drive.",
    fact: "Where you land relative to work makes a big difference — a shorter commute is often worth more than a slightly bigger house. It's one of the things worth weighing as you compare areas.",
    handoff: "Your Market Director can help you weigh commute against your other priorities for specific areas.",
    source: 'Texas relocation guides (2026)',
  },
  {
    id: 'q-which-neighborhood',
    kind: 'question',
    label: 'Which neighborhood should I choose for my family?',
    category: 'life',
    body: "This is the big one — and it's exactly the question HavenQuest is built to answer with you, not in a pop-up.",
    fact: '',
    handoff: "This one's for your Market Director. The right neighborhood depends on your priorities, budget, schools, and commute — the things your matches and your Market Director work through together. I can explain any term or general question along the way, but the 'where should we land' call is theirs to help you make.",
    source: 'HavenQuest editorial boundary',
  },
  {
    id: 'q-retire',
    kind: 'question',
    label: 'Is Texas a good place to retire?',
    category: 'life',
    body: "Many retirees find it attractive: no state income tax means pensions, 401(k) withdrawals, and Social Security aren't taxed at the state level, and there are extra property-tax breaks for homeowners 65 and older.",
    fact: "The trade-offs are the same as for anyone — higher property tax and hot summers. Whether it works for you depends on your income sources and where you settle.",
    handoff: "Your Market Director can help you think through a specific area for retirement.",
    source: 'HOMEiA; vanlinesmove; Texas relocation guides',
  },
]
