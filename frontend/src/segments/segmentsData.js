// segments-data.js — Synthetic respondent panel (ES module)

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const out = [];
  const copy = [...arr];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};
const ri = (a, b) => Math.floor(a + rand() * (b - a + 1));
const rf = (a, b) => a + rand() * (b - a);
const rn = (mean, sd) => {
  const u = Math.max(rand(), 1e-9),
    v = rand();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const FIRST_NAMES = [
  'Maya','Jordan','Priya','Daniel','Tomás','Aisha','Wei','Sofía','Marcus','Lena',
  'Ravi','Naomi','Ethan','Zoë','Hannah','Diego','Yuki','Kai','Imani','Owen',
  'Camille','Andrés','Lina','Theo','Anya','Felix','Nora','Jamal','Elise','Soren',
  'Maya','Reza','Tess','Cyrus','Vera','Mateo','Iris','Beatriz','Hassan','Margot',
  'Niko','Sasha','Talia','Quinn','Rohan','Mira','Asha','Levi','Cosima','Esme',
  'Cleo','Otis','Ines','Devon','Ada','Hugo','Selma','Casey','Joaquín','Pia',
];
const LAST_INITIALS = ['R.','K.','L.','M.','P.','S.','T.','C.','H.','N.','W.','V.','B.','D.','F.','G.'];

const CITIES = [
  ['Atlanta','GA'],['Portland','OR'],['Phoenix','AZ'],['Brooklyn','NY'],
  ['Austin','TX'],['Minneapolis','MN'],['Denver','CO'],['Seattle','WA'],
  ['Oakland','CA'],['Chicago','IL'],['Nashville','TN'],['Boston','MA'],
  ['Tucson','AZ'],['Asheville','NC'],['Madison','WI'],['Providence','RI'],
  ['Pittsburgh','PA'],['Boise','ID'],['Tampa','FL'],['Detroit','MI'],
  ['Sacramento','CA'],['Albuquerque','NM'],['Burlington','VT'],['Omaha','NE'],
];

export const EDU = ['HS','Some college','Bachelors','Masters','PhD'];

export const SEGMENT_SPECS = {
  genz: {
    name: 'Gen Z Creators', color: '#9333EA', n: 38,
    age: [18,27], income: [22,65],
    edu_weights: [0.05,0.45,0.4,0.08,0.02],
    household: ['Single','Roommates','Couple'],
    lifecycle: ['Student','Early career','Side-hustle'],
    occupations: ['Part-time creator','Barista + creator','UGC freelancer','Photographer','Streamer','Junior designer','Service industry','Graphic design intern','Influencer manager','TikTok shop owner','Community manager','Comedy creator'],
    channels: ['TikTok','Instagram','Discord','YouTube Shorts','Twitch','BeReal','Twitter/X'],
    brands: ['Glossier','Aimé Leon Dore','Telfar','Crocs','Rhode','Stanley','Trader Joe\'s','SSENSE','Depop','Doe Lashes'],
    last_purchase: ['Apparel','Beauty','Tech accessory','Food delivery','Streetwear','Concert ticket'],
    traits: { sustainability: 7.0, price_sens: 8.2, tech_opt: 8.5, novelty: 8.0, brand_loyal: 4.2 },
    quotes: [
      '"I don\'t want a car that makes me look rich. I want one that doesn\'t embarrass me on camera."',
      '"If my followers can\'t see how it fits in my life, it doesn\'t exist."',
      '"Monthly cost is the only number I actually compare."',
      '"My friends will roast me if it looks try-hard."',
      '"I research on TikTok first, then double-check on Reddit."',
      '"Status now means substance, not flex."',
    ],
  },
  urban: {
    name: 'Urban Climate Advocates', color: '#1F7A4C', n: 32,
    age: [28,45], income: [70,220],
    edu_weights: [0.0,0.08,0.45,0.37,0.10],
    household: ['Couple','Family w/ kids','Family w/ teens','Single'],
    lifecycle: ['Settled','New parent','Mid-career','DINK'],
    occupations: ['Public-health analyst','UX researcher','City planner','Sustainability lead','Climate journalist','Architect','Nonprofit director','Civil engineer','Product manager','Policy analyst','Pediatrician','Librarian'],
    channels: ['Substack','NYT','Local civic','Word of mouth','Nextdoor','Podcasts','Bluesky'],
    brands: ['Patagonia','REI','Allbirds','Bon Appétit','Wirecutter','Strava','Local CSA','Public Goods'],
    last_purchase: ['Home goods','Outdoor gear','Groceries','Kids gear','Books','Home repair'],
    traits: { sustainability: 8.8, price_sens: 5.0, tech_opt: 6.8, novelty: 5.5, brand_loyal: 6.5 },
    quotes: [
      '"We did the math on the used hybrid. The EV won — barely."',
      '"I need to defend this purchase to my brother-in-law."',
      '"Lifecycle data or it didn\'t happen."',
      '"Our block has nine kids under 8. Safety matters."',
      '"I\'m tired of brands overstating their green story."',
      '"The school commute is the actual use case."',
    ],
  },
  smb: {
    name: 'Cost-Sensitive SMB Owners', color: '#B0772B', n: 28,
    age: [35,58], income: [60,180],
    edu_weights: [0.18,0.32,0.40,0.08,0.02],
    household: ['Family w/ teens','Couple','Family w/ kids','Empty nest'],
    lifecycle: ['Owner-operator','Established','Expanding','Succession-planning'],
    occupations: ['HVAC owner','Landscaping owner','Plumbing owner','Mobile detailing','Catering owner','Mobile groomer','Painting contractor','Auto repair owner','Cleaning service owner','Locksmith','Electrical contractor','Bakery owner'],
    channels: ['Trade publications','LinkedIn','Vertical conferences','Word of mouth','Facebook groups','YouTube'],
    brands: ['Ford','RAM','Milwaukee','DeWalt','Costco','QuickBooks','Square','Sherwin-Williams'],
    last_purchase: ['Equipment','Vehicle','Software subscription','Bulk supplies','Tool replacement'],
    traits: { sustainability: 4.5, price_sens: 8.8, tech_opt: 5.5, novelty: 3.8, brand_loyal: 7.2 },
    quotes: [
      '"Show me the spreadsheet. 36-month payback or I walk."',
      '"If the truck doesn\'t start at 5am in July, it\'s a paperweight."',
      '"My crews already hate change. Make it worth it."',
      '"Diesel is the devil I know."',
      '"Tax credits expire. I plan in cash."',
      '"Recruit younger techs — that\'s the actual upside."',
    ],
  },
  retiree: {
    name: 'Retired DIYers', color: '#B23A48', n: 22,
    age: [60,78], income: [40,120],
    edu_weights: [0.20,0.35,0.32,0.10,0.03],
    household: ['Empty nest','Couple','Single'],
    lifecycle: ['Newly retired','Long retired','Snowbird','Active'],
    occupations: ['Retired teacher','Retired engineer','Retired nurse','Retired contractor','Retired accountant','Retired sales mgr','Retired RN','Retired farmer','Retired electrician','Retired federal worker','Retired professor'],
    channels: ['Email newsletters','TV','Word of mouth','Print magazines','Facebook','YouTube'],
    brands: ['Toyota','Lowe\'s','Costco','New Balance','LL Bean','AARP','Consumer Reports','Vanguard'],
    last_purchase: ['Home repair','Health product','Travel','Grandkid gift','Garden supplies'],
    traits: { sustainability: 5.5, price_sens: 7.0, tech_opt: 4.2, novelty: 3.5, brand_loyal: 8.4 },
    quotes: [
      '"I want to fix it in my own driveway, thank you."',
      '"My Toyota has 240k miles. Convince me."',
      '"Touch screens for everything is a step backwards."',
      '"Resale matters — we may not own it long."',
      '"I read Consumer Reports cover to cover."',
      '"My grandkids think I\'m the cool one when I get tech right."',
    ],
  },
  itlead: {
    name: 'Enterprise IT Leaders', color: '#2766C7', n: 20,
    age: [38,55], income: [140,380],
    edu_weights: [0.0,0.05,0.45,0.40,0.10],
    household: ['Family w/ kids','Family w/ teens','Couple','Empty nest'],
    lifecycle: ['Mid-career','Senior IC','Director','VP'],
    occupations: ['CIO','VP Infrastructure','Head of IT','Director, Fleet Tech','Director, Procurement','IT Operations Mgr','VP Engineering','CTO','Head of Workplace','Director, Mobility'],
    channels: ['Gartner','LinkedIn','Industry analyst calls','Vendor briefings','Slack communities'],
    brands: ['ServiceNow','Workday','Microsoft','Cisco','Dell','Atlassian','Tableau','Datadog'],
    last_purchase: ['Enterprise software','Fleet vehicle','Conference ticket','Consulting engagement'],
    traits: { sustainability: 5.8, price_sens: 6.0, tech_opt: 8.0, novelty: 6.2, brand_loyal: 5.8 },
    quotes: [
      '"RFP-worthy or it doesn\'t move past discovery."',
      '"ROI in 18 months, security review under 8 weeks."',
      '"Procurement holds the actual veto."',
      '"I need the integration story before the test drive."',
      '"My CFO reads every line item."',
      '"Reference customers are the only proof that works."',
    ],
  },
};

function gen(segId, spec, idx) {
  const id = 'R-' + String(1000 + idx).slice(1);
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_INITIALS);
  const [city, state] = pick(CITIES);
  const age = ri(spec.age[0], spec.age[1]);
  const income = Math.round(rf(spec.income[0], spec.income[1]));
  let r = rand(), cum = 0, edu = EDU[0];
  for (let i = 0; i < EDU.length; i++) {
    cum += spec.edu_weights[i];
    if (r < cum) { edu = EDU[i]; break; }
  }
  const traits = spec.traits;
  const j = (mean, jitter = 1.8) => clamp(+rn(mean, jitter).toFixed(1), 1, 10);
  return {
    id, name: first + ' ' + last, age,
    gender: pick(['F','M','F','M','NB','F','M']),
    city, state, income, education: edu,
    household: pick(spec.household),
    occupation: pick(spec.occupations),
    lifecycle: pick(spec.lifecycle),
    sustainability:    j(traits.sustainability),
    price_sensitivity: j(traits.price_sens),
    tech_optimism:     j(traits.tech_opt),
    novelty_seeking:   j(traits.novelty),
    brand_loyalty:     j(traits.brand_loyal),
    top_brands:        pickN(spec.brands, ri(2,3)),
    primary_channels:  pickN(spec.channels, ri(2,3)),
    last_purchase:     pick(spec.last_purchase),
    monthly_discretionary: Math.round(income * 1000 * rf(0.05, 0.18)),
    engagement_rate:   +rf(0.42, 0.95).toFixed(2),
    quote:             pick(spec.quotes),
    recruited: '202' + ri(3,6) + '-' + String(ri(1,12)).padStart(2,'0') + '-' + String(ri(1,28)).padStart(2,'0'),
    segment: segId,
    selected: false,
  };
}

const PANEL = [];
let idx = 0;
Object.entries(SEGMENT_SPECS).forEach(([segId, spec]) => {
  for (let i = 0; i < spec.n; i++) PANEL.push(gen(segId, spec, idx++));
});

const LATENT_CENTERS = {
  genz:    [ 0.55,  0.45, -0.50],
  urban:   [-0.50,  0.60,  0.20],
  smb:     [ 0.40, -0.55,  0.55],
  retiree: [-0.60, -0.30, -0.40],
  itlead:  [ 0.05, -0.10,  0.70],
};

PANEL.forEach(r => {
  const c = LATENT_CENTERS[r.segment];
  r.latent_x = clamp(c[0] + rn(0, 0.22), -1, 1);
  r.latent_y = clamp(c[1] + rn(0, 0.22), -1, 1);
  r.latent_z = clamp(c[2] + rn(0, 0.22), -1, 1);
  r.belief_x = (r.sustainability    - 5.5) / 4.5;
  r.belief_y = (r.price_sensitivity - 5.5) / 4.5;
  r.belief_z = (r.tech_optimism     - 5.5) / 4.5;
});

const SEGMENTS_META = Object.entries(SEGMENT_SPECS).map(([id, s]) => ({
  id, name: s.name, color: s.color, n: s.n, age: s.age, centroid: LATENT_CENTERS[id],
}));

export const COLUMNS = [
  { key:'id',                label:'ID',          w: 64,  kind:'mono',    pinned:true, editable:false },
  { key:'name',              label:'Name',        w: 110, kind:'text',    pinned:true },
  { key:'segment',           label:'Segment',     w: 130, kind:'segment', pinned:true },
  { key:'age',               label:'Age',         w: 56,  kind:'num',     align:'right' },
  { key:'gender',            label:'Gen.',        w: 46,  kind:'tag' },
  { key:'city',              label:'City',        w: 100, kind:'text' },
  { key:'state',             label:'St',          w: 38,  kind:'mono' },
  { key:'income',            label:'Inc ($k)',    w: 70,  kind:'num',     align:'right' },
  { key:'education',         label:'Education',   w: 95,  kind:'select',  options: EDU },
  { key:'household',         label:'Household',   w: 120, kind:'text' },
  { key:'occupation',        label:'Occupation',  w: 170, kind:'text' },
  { key:'lifecycle',         label:'Stage',       w: 110, kind:'text' },
  { key:'sustainability',    label:'Sustain.',    w: 90,  kind:'score' },
  { key:'price_sensitivity', label:'Price-sens.', w: 90,  kind:'score' },
  { key:'tech_optimism',     label:'Tech-opt.',   w: 90,  kind:'score' },
  { key:'novelty_seeking',   label:'Novelty',     w: 90,  kind:'score' },
  { key:'brand_loyalty',     label:'Brand loy.',  w: 90,  kind:'score' },
  { key:'top_brands',        label:'Top brands',  w: 180, kind:'chips' },
  { key:'primary_channels',  label:'Channels',    w: 170, kind:'chips' },
  { key:'last_purchase',     label:'Last buy',    w: 120, kind:'text' },
  { key:'monthly_discretionary', label:'Disc. $/mo', w:90, kind:'num',   align:'right', format:'usd' },
  { key:'engagement_rate',   label:'Engage',      w: 70,  kind:'pct',     align:'right' },
  { key:'quote',             label:'Quote',       w: 360, kind:'longtext' },
  { key:'recruited',         label:'Recruited',   w: 96,  kind:'mono' },
];

export const SEG_PANEL = { PANEL, SEGMENTS: SEGMENTS_META, COLUMNS, EDU };
