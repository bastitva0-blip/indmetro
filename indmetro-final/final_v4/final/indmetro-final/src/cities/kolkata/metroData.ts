/**
 * Kolkata Metro (Multiple Operators)
 *
 * BLUE LINE (L1)   — Dakshineswar → Kavi Subhash · 31.4 km · 26 stations · BROAD GAUGE (1676mm)
 *   Operator: Metro Railway, Kolkata (Indian Railways zone)
 *   ALL OPERATIONAL. Oldest metro in India (1984).
 *   Underground throughout central Kolkata.
 *
 * GREEN LINE (L2)  — Howrah Maidan → Karunamoyee · 16.6 km · 12 stations · STANDARD GAUGE (1435mm)
 *   Operator: KMRC · ALL OPERATIONAL (cross-river tunnel opens 2024)
 *   Deepest metro station in India: Howrah Maidan (~33m deep).
 *
 * ORANGE LINE (L6) — Hemanta Mukhopadhyay → Kavi Subhash area · 9 operational + 15 WIP to Airport
 *   Operator: KMRC · New Garia–Airport Metro (south section open 2024)
 *
 * PURPLE LINE (L3) — Joka → Esplanade · 6 operational (Joka→Taratala) + 9 WIP toward BBD Bagh
 *   Operator: KMRC · Joka–BBD Bagh Metro
 *
 * ⚠️ GAUGE WARNING: Blue Line (broad gauge) NOT physically interoperable with Green/Orange/Purple
 *    (standard gauge). Interchanges are via walkways only.
 *
 * INTERCHANGES:
 *   Esplanade       : Blue ↔ Green (walkway)
 *   Kavi Subhash    : Blue ↔ Orange (walkway ~300m to Hemanta Mukhopadhyay)
 *   Salt Lake Sec V : Green ↔ Orange (future, when Orange extends north)
 *
 * Smart Card: Smart Card (Kolkata) · 10% discount (Blue uses separate system from KMRC lines)
 * Timings:   Blue 6:50–21:45 | Green 6:30–22:47 | Orange 6:00–21:45 | Purple 7:00–21:00
 */

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  lines: ("blue" | "green" | "orange" | "purple")[];
  isInterchange?: boolean;
  hasRailTransfer?: boolean;
  isUnderground?: boolean;
  isWIP?: boolean;
}

export const LINE_COLORS = {
  blue:   "#2196F3",
  green:  "#4CAF50",
  orange: "#FF9800",
  purple: "#9C27B0",
} as const;

export const LINE_NAMES = {
  blue:   "Blue Line (L1)",
  green:  "Green Line (L2)",
  orange: "Orange Line (L6)",
  purple: "Purple Line (L3)",
} as const;

export const stations: Record<string, Station> = {
  // ── BLUE LINE (L1): N→S — Dakshineswar → Kavi Subhash ────────────────────
  dakshineswar:       { id:"dakshineswar",       name:"Dakshineswar",          coordinates:[22.65397,88.36372], lines:["blue"] },
  baranagar:          { id:"baranagar",           name:"Baranagar",             coordinates:[22.64420,88.37020], lines:["blue"] },
  noapara:            { id:"noapara",             name:"Noapara",               coordinates:[22.63240,88.37420], lines:["blue"] }, // future Yellow IC
  dum_dum:            { id:"dum_dum",             name:"Dum Dum",               coordinates:[22.61840,88.38020], lines:["blue"], hasRailTransfer:true },
  belgachhia:         { id:"belgachhia",          name:"Belgachhia",            coordinates:[22.60720,88.38420], lines:["blue"] },
  shyambazar:         { id:"shyambazar",          name:"Shyambazar",            coordinates:[22.59680,88.38120], lines:["blue"] },
  shobhabazar:        { id:"shobhabazar",         name:"Shobhabazar-Sutanuti",  coordinates:[22.58840,88.37240], lines:["blue"], isUnderground:true },
  girish_park:        { id:"girish_park",         name:"Girish Park",           coordinates:[22.58280,88.36520], lines:["blue"], isUnderground:true },
  mg_road_kol:        { id:"mg_road_kol",         name:"MG Road",               coordinates:[22.57680,88.35880], lines:["blue"], isUnderground:true },
  central_kol:        { id:"central_kol",         name:"Central",               coordinates:[22.57247,88.35879], lines:["blue"], isUnderground:true },
  chandni_chowk_kol:  { id:"chandni_chowk_kol",  name:"Chandni Chowk",         coordinates:[22.56680,88.35414], lines:["blue"], isUnderground:true },
  esplanade:          { id:"esplanade",           name:"Esplanade",             coordinates:[22.56444,88.35167], lines:["blue","green"], isInterchange:true, isUnderground:true },
  park_street:        { id:"park_street",         name:"Park Street",           coordinates:[22.55320,88.35220], lines:["blue"], isUnderground:true },
  maidan:             { id:"maidan",              name:"Maidan",                coordinates:[22.54360,88.34740], lines:["blue"], isUnderground:true },
  rabindra_sarani:    { id:"rabindra_sarani",     name:"Rabindra Sarani",       coordinates:[22.53400,88.34320], lines:["blue"], isUnderground:true },
  netaji_bhawan:      { id:"netaji_bhawan",       name:"Netaji Bhavan",         coordinates:[22.52320,88.33940], lines:["blue"], isUnderground:true },
  jatin_das_park:     { id:"jatin_das_park",      name:"Jatin Das Park",        coordinates:[22.51160,88.34220], lines:["blue"], isUnderground:true },
  kalighat:           { id:"kalighat",            name:"Kalighat",              coordinates:[22.50000,88.34480], lines:["blue"], isUnderground:true },
  rabindra_sarobar:   { id:"rabindra_sarobar",    name:"Rabindra Sarobar",      coordinates:[22.49000,88.34700], lines:["blue"] },
  mahanayak:          { id:"mahanayak",           name:"Mahanayak Uttam Kumar", coordinates:[22.47960,88.35520], lines:["blue"] }, // future Purple IC
  tollygunge:         { id:"tollygunge",          name:"Tollygunge",            coordinates:[22.46960,88.35940], lines:["blue"] },
  master_surya_sen:   { id:"master_surya_sen",    name:"Master Surya Sen",      coordinates:[22.46120,88.36880], lines:["blue"] },
  netaji:             { id:"netaji",              name:"Netaji",                coordinates:[22.45400,88.37620], lines:["blue"] },
  shahid_khudiram:    { id:"shahid_khudiram",     name:"Shahid Khudiram",       coordinates:[22.46597,88.39167], lines:["blue"] },
  kavi_nazrul:        { id:"kavi_nazrul",         name:"Kavi Nazrul",           coordinates:[22.44800,88.39240], lines:["blue"] },
  kavi_subhash:       { id:"kavi_subhash",        name:"Kavi Subhash",          coordinates:[22.47194,88.39806], lines:["blue","orange"], isInterchange:true },

  // ── GREEN LINE (L2): W→E — Howrah Maidan → Karunamoyee ───────────────────
  howrah_maidan:      { id:"howrah_maidan",       name:"Howrah Maidan",         coordinates:[22.57720,88.32680], lines:["green"], isUnderground:true }, // deepest station ~33m
  howrah:             { id:"howrah",              name:"Howrah",                coordinates:[22.58480,88.33320], lines:["green"], isUnderground:true, hasRailTransfer:true },
  mahakaran:          { id:"mahakaran",           name:"Mahakaran",             coordinates:[22.56880,88.34160], lines:["green"], isUnderground:true },
  esplanade_grn:      { id:"esplanade_grn",       name:"Esplanade",             coordinates:[22.56444,88.35167], lines:["blue","green"], isInterchange:true, isUnderground:true },
  sealdah:            { id:"sealdah",             name:"Sealdah",               coordinates:[22.56900,88.37220], lines:["green"], isUnderground:true, hasRailTransfer:true },
  phoolbagan:         { id:"phoolbagan",          name:"Phoolbagan",            coordinates:[22.57480,88.38720], lines:["green"], isUnderground:true },
  karunamoyee:        { id:"karunamoyee",         name:"Karunamoyee",           coordinates:[22.57680,88.41180], lines:["green","orange"] },
  salt_lake_sec5:     { id:"salt_lake_sec5",      name:"Salt Lake Sector V",    coordinates:[22.56920,88.41520], lines:["green"] },
  salt_lake_stadium:  { id:"salt_lake_stadium",   name:"Salt Lake Stadium",     coordinates:[22.57320,88.42620], lines:["green"] },
  bengal_chemical:    { id:"bengal_chemical",     name:"Bengal Chemical",       coordinates:[22.57720,88.43420], lines:["green"] },
  city_centre:        { id:"city_centre",         name:"City Centre",           coordinates:[22.58080,88.44160], lines:["green"] },
  central_park_kol:   { id:"central_park_kol",    name:"Central Park",          coordinates:[22.58280,88.44960], lines:["green"] },

  // ── ORANGE LINE (L6): S→N — Hemanta Mukhopadhyay → Biman Bandar ──────────
  hemanta_mukho:      { id:"hemanta_mukho",       name:"Hemanta Mukhopadhyay",  coordinates:[22.46000,88.39600], lines:["orange","blue"], isInterchange:true }, // walkway to Kavi Subhash
  kamalgazi:          { id:"kamalgazi",           name:"Kamalgazi",             coordinates:[22.45200,88.40200], lines:["orange"] },
  bansdroni:          { id:"bansdroni",           name:"Bansdroni",             coordinates:[22.44400,88.41000], lines:["orange"] },
  shri_kali_temple:   { id:"shri_kali_temple",    name:"Shri Kali Temple",      coordinates:[22.43600,88.41800], lines:["orange"] },
  narendrapur_metro:  { id:"narendrapur_metro",   name:"Narendrapur",           coordinates:[22.42800,88.42600], lines:["orange"] },
  sonarpur_metro:     { id:"sonarpur_metro",      name:"Sonarpur",              coordinates:[22.42000,88.43200], lines:["orange"] },
  // WIP northward to airport
  baruipur_metro:     { id:"baruipur_metro",      name:"Baruipur",              coordinates:[22.41200,88.43800], lines:["orange"], isWIP:true },
  jangalpur_metro:    { id:"jangalpur_metro",     name:"Jangalpur",             coordinates:[22.51200,88.41800], lines:["orange"], isWIP:true },
  ultadanga_metro:    { id:"ultadanga_metro",     name:"Ultadanga",             coordinates:[22.57800,88.40200], lines:["orange"], isWIP:true },
  airport_metro_kol:  { id:"airport_metro_kol",   name:"Biman Bandar (Airport)", coordinates:[22.65400,88.44700], lines:["orange"], isWIP:true },

  // ── PURPLE LINE (L3): S→N — Joka → Esplanade (6 live + 9 WIP) ───────────
  joka:               { id:"joka",                name:"Joka",                  coordinates:[22.43930,88.31240], lines:["purple"] },
  thakurpukur:        { id:"thakurpukur",         name:"Thakurpukur",           coordinates:[22.45920,88.32900], lines:["purple"] },
  sakherbazar:        { id:"sakherbazar",         name:"Sakherbazar",           coordinates:[22.47150,88.33510], lines:["purple"] },
  behala_chowrasta:   { id:"behala_chowrasta",    name:"Behala Chowrasta",      coordinates:[22.48620,88.33520], lines:["purple"] },
  behala_bazar:       { id:"behala_bazar",        name:"Behala Bazar",          coordinates:[22.50180,88.34100], lines:["purple"] },
  taratala:           { id:"taratala",            name:"Taratala",              coordinates:[22.51500,88.34480], lines:["purple"] }, // current N operational terminal
  // WIP northward
  majerhat:           { id:"majerhat",            name:"Majerhat",              coordinates:[22.52580,88.34200], lines:["purple"], isWIP:true },
  new_alipore:        { id:"new_alipore",         name:"New Alipore",           coordinates:[22.53530,88.33630], lines:["purple"], isWIP:true },
  old_alipore:        { id:"old_alipore",         name:"Old Alipore",           coordinates:[22.54120,88.33200], lines:["purple"], isWIP:true },
  park_circus:        { id:"park_circus",         name:"Park Circus",           coordinates:[22.54800,88.35200], lines:["purple"], isWIP:true },
  ballygunge:         { id:"ballygunge",          name:"Ballygunge",            coordinates:[22.52600,88.36300], lines:["purple"], isWIP:true },
  elgin_road:         { id:"elgin_road",          name:"Elgin Road",            coordinates:[22.54200,88.35000], lines:["purple"], isWIP:true },
  mominpur:           { id:"mominpur",            name:"Mominpur",              coordinates:[22.55000,88.34400], lines:["purple"], isWIP:true },
  khidderpore:        { id:"khidderpore",         name:"Khidderpore",           coordinates:[22.55600,88.33800], lines:["purple"], isWIP:true },
  esplanade_purple:   { id:"esplanade_purple",    name:"BBD Bag / Esplanade",   coordinates:[22.56444,88.35167], lines:["purple"], isWIP:true }, // future triple interchange
};

export const LINE_STATIONS: Record<"blue"|"green"|"orange"|"purple", string[]> = {
  blue: [
    "dakshineswar","baranagar","noapara","dum_dum","belgachhia","shyambazar",
    "shobhabazar","girish_park","mg_road_kol","central_kol","chandni_chowk_kol",
    "esplanade","park_street","maidan","rabindra_sarani","netaji_bhawan",
    "jatin_das_park","kalighat","rabindra_sarobar","mahanayak","tollygunge",
    "master_surya_sen","netaji","shahid_khudiram","kavi_nazrul","kavi_subhash",
  ],
  green: [
    "howrah_maidan","howrah","mahakaran","esplanade_grn","sealdah","phoolbagan",
    "karunamoyee","salt_lake_sec5","salt_lake_stadium","bengal_chemical",
    "city_centre","central_park_kol",
  ],
  orange: [
    "hemanta_mukho","kamalgazi","bansdroni","shri_kali_temple",
    "narendrapur_metro","sonarpur_metro",
    "baruipur_metro","jangalpur_metro","ultadanga_metro","airport_metro_kol",
  ],
  purple: [
    "joka","thakurpukur","sakherbazar","behala_chowrasta","behala_bazar","taratala",
    "majerhat","new_alipore","old_alipore","park_circus","ballygunge",
    "elgin_road","mominpur","khidderpore","esplanade_purple",
  ],
};

export const LINE_TERMINALS = {
  blue:   { start:"Dakshineswar",         end:"Kavi Subhash" },
  green:  { start:"Howrah Maidan",        end:"Central Park" },
  orange: { start:"Hemanta Mukhopadhyay", end:"Biman Bandar" },
  purple: { start:"Joka",                 end:"BBD Bag / Esplanade" },
};

export const OPERATIONAL_STATIONS = new Set([
  ...LINE_STATIONS.blue,
  ...LINE_STATIONS.green,
  ...LINE_STATIONS.orange.slice(0, 9), // 9 live per Wikipedia Aug 2026
  ...LINE_STATIONS.purple.slice(0, 7), // 7 live (joka → majerhat, opened Mar 2024)
]);

export const getStationOptions = (includeWIP = false) =>
  Object.values(stations)
    .filter(s => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));
