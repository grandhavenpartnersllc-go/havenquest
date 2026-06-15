export interface TexasFact {
  fact: string
  category: 'geography' | 'history' | 'culture' | 'economy' | 'relocation' | 'food' | 'weird'
}

export const TEXAS_FACTS: TexasFact[] = [
  // GEOGRAPHY
  { fact: "Texas is the second-largest state in the U.S. at 268,596 square miles — bigger than France, Germany, and Spain individually.", category: 'geography' },
  { fact: "Texas has more than 3,700 named streams and rivers, and over 200 lakes.", category: 'geography' },
  { fact: "Texas has 10 different climate zones — from swampy Gulf Coast marshes to high desert plateaus to pine forests.", category: 'geography' },
  { fact: "The King Ranch in South Texas covers 825,000 acres — larger than the entire state of Rhode Island.", category: 'geography' },
  { fact: "Texas has 624 miles of Gulf Coast shoreline.", category: 'geography' },
  { fact: "Palo Duro Canyon in the Texas Panhandle is the second-largest canyon in the U.S., stretching 120 miles long.", category: 'geography' },
  { fact: "Texas sits at the crossroads of four major North American flyways, making it a premier destination for birdwatchers.", category: 'geography' },
  { fact: "Big Bend National Park in West Texas is larger than the state of Rhode Island.", category: 'geography' },

  // HISTORY
  { fact: "Texas is the only U.S. state to have joined the union by treaty rather than territorial annexation — it was its own independent republic from 1836 to 1845.", category: 'history' },
  { fact: "Six flags have flown over Texas: Spain, France, Mexico, the Republic of Texas, the Confederate States, and the United States.", category: 'history' },
  { fact: "The Battle of San Jacinto in 1836, which secured Texas independence from Mexico, lasted only 18 minutes.", category: 'history' },
  { fact: "Texas was the site of the last battle of the Civil War — the Battle of Palmito Ranch — fought more than a month after the war officially ended.", category: 'history' },
  { fact: "Houston was the first word spoken from the moon — Neil Armstrong said 'Houston, Tranquility Base here. The Eagle has landed.'", category: 'history' },
  { fact: "The Texas State Capitol building is taller than the U.S. Capitol in Washington, D.C.", category: 'history' },
  { fact: "Dr Pepper was invented in Waco, Texas in 1885 — making it the oldest major soft drink brand in America.", category: 'history' },

  // CULTURE
  { fact: "Austin has more live music venues per capita than anywhere else in the United States — over 250 of them.", category: 'culture' },
  { fact: "Texas has its own power grid — ERCOT — the only state in the contiguous U.S. with an independent electrical grid.", category: 'culture' },
  { fact: "Vietnamese is the third most spoken language in Texas, behind only English and Spanish.", category: 'culture' },
  { fact: "The cowboy boot is the official state footwear of Texas.", category: 'culture' },
  { fact: "Texas is home to more deer than any other state in the nation.", category: 'culture' },
  { fact: "The University of Texas has an endowment worth over $42 billion — one of the largest of any university in the world.", category: 'culture' },
  { fact: "Texas produces more wool than any other state in the U.S.", category: 'culture' },
  { fact: "There is a town in Texas called Ding Dong. Population: about 22.", category: 'weird' },
  { fact: "There are towns in Texas called Bug Tussle, Cut and Shoot, and Looneyville.", category: 'weird' },
  { fact: "It is technically illegal to milk someone else's cow in Texas — it's considered theft of personal property.", category: 'weird' },
  { fact: "Texas is one of only two states that can fly its state flag at the same height as the U.S. flag.", category: 'culture' },
  { fact: "The bluebonnet is the state flower of Texas. Every spring, roadsides across the Hill Country turn brilliant blue.", category: 'culture' },
  { fact: "Rodeo is the official state sport of Texas.", category: 'culture' },
  { fact: "Texas Monthly magazine has been called the best regional magazine in America — a bible for Texas culture since 1973.", category: 'culture' },

  // FOOD
  { fact: "Texas-style BBQ is its own religion. Central Texas BBQ uses only salt, pepper, and post oak smoke — no sauce needed.", category: 'food' },
  { fact: "Frito pie — Fritos chips topped with chili, cheese, and onions — was invented in Texas and is still a staple at Friday night football games.", category: 'food' },
  { fact: "The kolache, a Czech pastry filled with fruit or sausage, is a beloved Texas breakfast tradition thanks to Czech immigrant communities in Central Texas.", category: 'food' },
  { fact: "Texas produces more beef cattle than any other state — over 13 million head of cattle call Texas home.", category: 'food' },
  { fact: "Whataburger, founded in Corpus Christi in 1950, is a Texas institution. The honey butter chicken biscuit has a cult following.", category: 'food' },
  { fact: "Texas is the top pecan-producing state in the nation. The pecan is the official state tree.", category: 'food' },
  { fact: "The breakfast taco is a cultural touchstone in Texas — Austin and San Antonio have been known to argue over which city does it best.", category: 'food' },

  // ECONOMY
  { fact: "If Texas were a country, it would have the 9th largest economy in the world — larger than Canada, South Korea, and Russia.", category: 'economy' },
  { fact: "Texas has added more Fortune 500 company headquarters than any other state over the past decade.", category: 'economy' },
  { fact: "Texas is the #1 state in the U.S. for exports, shipping over $300 billion in goods annually.", category: 'economy' },
  { fact: "The DFW Metroplex is home to more Fortune 500 headquarters than any metro area except New York City.", category: 'economy' },
  { fact: "Texas produces more oil than any other state — and more than most OPEC nations.", category: 'economy' },
  { fact: "Houston is home to the largest medical complex in the world — the Texas Medical Center employs over 106,000 people.", category: 'economy' },
  { fact: "Texas has created nearly 20% of all net new U.S. jobs over the past decade.", category: 'economy' },
  { fact: "More than 50 major corporations relocated their headquarters to Texas between 2019 and 2024, including Tesla, Oracle, and Hewlett Packard Enterprise.", category: 'economy' },

  // RELOCATION
  { fact: "Texas has zero state income tax — one of only nine states with no personal income tax. For a household earning $150,000, that's potentially $8,000+ more in your pocket every year compared to California.", category: 'relocation' },
  { fact: "Texas is the fastest-growing state in the nation. Nearly 1,000 people move to Texas every single day.", category: 'relocation' },
  { fact: "The median home price in Texas is significantly below the national average — and well below coastal markets. In Houston, you can buy a 4-bedroom home for what a 1-bedroom costs in San Francisco.", category: 'relocation' },
  { fact: "Texas has no estate or inheritance tax — making it one of the most wealth-transfer-friendly states in the nation.", category: 'relocation' },
  { fact: "Texas has 37 public universities and is home to three of the top 50 universities in the nation.", category: 'relocation' },
  { fact: "The cost of living in most Texas metros runs 10–20% below the national average — and 30–40% below major coastal cities.", category: 'relocation' },
  { fact: "Texas doesn't tax Social Security income, pension income, or retirement account distributions — making it one of the most retirement-friendly states in the country.", category: 'relocation' },
  { fact: "DFW International Airport is the fourth busiest airport in the world, with direct flights to over 240 destinations.", category: 'relocation' },
  { fact: "Texas has over 40 military installations — the most of any state — making it a top destination for relocating military families.", category: 'relocation' },
  { fact: "Texas has reciprocity agreements with most states for professional licenses — making it easier for doctors, nurses, lawyers, and engineers to transfer their credentials.", category: 'relocation' },
  { fact: "The Austin-Round Rock metro has been ranked the #1 metro for job growth in the U.S. for three of the last five years.", category: 'relocation' },
  { fact: "San Antonio is the only Texas city where both the PGA Tour and LPGA Tour hold regular events.", category: 'relocation' },
  { fact: "The Woodlands, TX has been ranked one of the best places to live in America by Money Magazine multiple times — combining suburban comfort with easy Houston access.", category: 'relocation' },
  { fact: "Texas has over 60 state parks covering more than 600,000 acres of land — from mountains to beaches to canyons.", category: 'relocation' },
  { fact: "Frisco, TX was the fastest-growing city in America for seven consecutive years and is now home to the Dallas Cowboys' world headquarters.", category: 'relocation' },
  { fact: "The Houston metro area is the most ethnically diverse major metro in the United States — home to people from over 145 countries.", category: 'relocation' },
  { fact: "Texas processes vehicle registration and driver's licenses quickly — most new residents can complete the transfer in a single visit to a DPS office.", category: 'relocation' },
  { fact: "Round Rock, TX — just north of Austin — is ranked one of the safest cities of its size in Texas and was named one of America's best places to raise a family.", category: 'relocation' },
  { fact: "Georgetown, TX just north of Austin has been the fastest-growing city in the U.S. for multiple recent years — a charming Hill Country town with rapid growth.", category: 'relocation' },

  // WEIRD & FUN
  { fact: "Texas is home to the world's largest honky-tonk — Billy Bob's Texas in Fort Worth — with 30+ individual bar stations and an indoor rodeo arena.", category: 'weird' },
  { fact: "The Texas state gem is Texas Blue Topaz. The state flying mammal is the Mexican Free-Tailed Bat. Yes, that's a real official designation.", category: 'weird' },
  { fact: "Austin is home to the world's largest urban bat colony — up to 1.5 million Mexican free-tailed bats live under the Congress Avenue Bridge.", category: 'weird' },
  { fact: "Texas has its own pledge of allegiance — recited in schools alongside the national pledge.", category: 'weird' },
  { fact: "In Texas, it is legal for residents to carry a Bowie knife — it's actually the official state knife.", category: 'weird' },
  { fact: "The state dish of Texas is chili. And Texans are very serious about it — no beans allowed.", category: 'weird' },
  { fact: "Texas is so wide that El Paso, in West Texas, is closer to Los Angeles than it is to Houston.", category: 'weird' },
  { fact: "A Texas man once legally changed his name to 'In God We Trust' — which is also the state motto.", category: 'weird' },
]
