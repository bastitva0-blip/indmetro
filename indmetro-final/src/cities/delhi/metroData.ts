/**
 * Delhi Metro — DMRC
 *
 * 10 lines · 271 stations · 374.47 km
 *
 * BROAD GAUGE (1676mm): Red, Yellow, Blue lines
 * STANDARD GAUGE (1435mm): All other lines
 *
 * Blue Line has a branch: main (Dwarka Sec 21 ↔ Noida Electronic City)
 * and Vaishali branch (Yamuna Bank ↔ Vaishali) — modelled as "blue_b".
 *
 * Green Line branches at Punjabi Bagh: Brigadier Hoshiyar Singh ↔ Inderlok
 * and separate spur to Kirti Nagar (modelled as Green passing through Kirti Nagar).
 *
 * Operator: DMRC (Delhi Metro Rail Corporation)
 * Sources: Wikipedia, delhi.metroroute.co.in, DMRC official (Aug 2026)
 */

export type DelhiLine =
  | "red" | "yellow" | "blue" | "blue_b"
  | "green" | "violet" | "orange"
  | "pink" | "magenta" | "grey";

export interface StationGate {
  id: string;          // "A" | "B" | "C" | "D"
  description: string; // "Towards Connaught Place"
  hasLift?: boolean;
  hasRamp?: boolean;
}

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  lines: DelhiLine[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  isWIP?: boolean;
  gates?: StationGate[];
  parkingAvailable?: { twoWheeler?: boolean; fourWheeler?: boolean };
  platformInfo?: Record<string, { number: number; direction: string }>;
}

export const LINE_COLORS: Record<DelhiLine, string> = {
  red:     "#F44336",
  yellow:  "#FFC107",
  blue:    "#2196F3",
  blue_b:  "#1565C0",
  green:   "#4CAF50",
  violet:  "#9C27B0",
  orange:  "#FF9800",
  pink:    "#E91E8C",
  magenta: "#FF00FF",
  grey:    "#9E9E9E",
};

export const LINE_NAMES: Record<DelhiLine, string> = {
  red:     "Red Line",
  yellow:  "Yellow Line",
  blue:    "Blue Line",
  blue_b:  "Blue Line (Vaishali Branch)",
  green:   "Green Line",
  violet:  "Violet Line",
  orange:  "Airport Express",
  pink:    "Pink Line",
  magenta: "Magenta Line",
  grey:    "Grey Line",
};

// Helper: build station concisely
const s = (
  id: string, name: string, lat: number, lng: number,
  lines: DelhiLine[], opts: Partial<Station> = {}
): Station => ({ id, name, coordinates: [lat, lng], lines, ...opts });

export const stations: Record<string, Station> = {

  // ══════════════════════════════════════════════════════════════════════
  // RED LINE (29 stations) — Shaheed Sthal ↔ Rithala (E → NW)
  // ══════════════════════════════════════════════════════════════════════
  shaheed_sthal:          s("shaheed_sthal",          "Shaheed Sthal (New Bus Adda)", 28.6438, 77.4218, ["red"]),
  hindon_river:           s("hindon_river",           "Hindon River",                 28.6508, 77.4028, ["red"]),
  arthala:                s("arthala",                "Arthala",                      28.6568, 77.3848, ["red"]),
  mohan_nagar:            s("mohan_nagar",            "Mohan Nagar",                  28.6618, 77.3648, ["red"]),
  shyam_park:             s("shyam_park",             "Shyam Park",                   28.6648, 77.3468, ["red"]),
  major_mohit_sharma:     s("major_mohit_sharma",     "Maj. Mohit Sharma Rajendra Nagar", 28.6668, 77.3298, ["red"]),
  raj_bagh:               s("raj_bagh",               "Raj Bagh",                     28.6678, 77.3158, ["red"]),
  shaheed_nagar:          s("shaheed_nagar",          "Shaheed Nagar",                28.6688, 77.3038, ["red"]),
  dilshad_garden:         s("dilshad_garden",         "Dilshad Garden",               28.6708, 77.3128, ["red"]),
  jhilmil:                s("jhilmil",                "Jhilmil",                      28.6698, 77.3058, ["red"]),
  mansarovar_park:        s("mansarovar_park",        "Mansarovar Park",              28.6688, 77.2978, ["red"]),
  shahdara:               s("shahdara",               "Shahdara",                     28.6688, 77.3048, ["red"]),
  welcome:                s("welcome",                "Welcome",                      28.6688, 77.2948, ["red", "pink"], { isInterchange: true,
    gates: [
      { id: "1", description: "GT Road towards Delhi (south)", hasLift: false },
      { id: "4", description: "GT Road towards Ghaziabad (north)", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: false, fourWheeler: false },
    platformInfo: {
      red:  { number: 1, direction: "towards Rithala" },
      pink: { number: 3, direction: "towards Majlis Park" },
    },
  }),
  seelampur:              s("seelampur",              "Seelampur",                    28.6658, 77.2848, ["red"]),
  shastri_park:           s("shastri_park",           "Shastri Park",                 28.6588, 77.2658, ["red"]),
  kashmere_gate:          s("kashmere_gate",          "Kashmere Gate",                28.6682, 77.2298, ["red", "yellow", "violet"], { isInterchange: true, isUnderground: true,
    gates: [
      { id: "1", description: "Mori Gate side", hasLift: false },
      { id: "2", description: "Lala Hardev Sahai Marg", hasLift: false },
      { id: "3", description: "Lala Hardev Sahai Marg", hasLift: false },
      { id: "4", description: "Lala Hardev Sahai Marg", hasLift: false },
      { id: "5", description: "Lala Hardev Sahai Marg (Lothian Road, GT Road)", hasLift: true },
      { id: "6", description: "Lothian Road, GT Road — Lift accessible", hasLift: true },
      { id: "7", description: "ISBT Kashmere Gate (Maharana Pratap Bus Terminal)", hasLift: false },
      { id: "8", description: "ISBT Kashmere Gate — covered direct access", hasLift: false },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: true },
    platformInfo: {
      red: { number: 3, direction: "towards Rithala" },
      yellow: { number: 1, direction: "towards Samaypur Badli" },
      violet: { number: 5, direction: "towards Raja Nahar Singh / Ballabhgarh" },
    },
  }),
  tis_hazari:             s("tis_hazari",             "Tis Hazari",                   28.6668, 77.2088, ["red"]),
  pul_bangash:            s("pul_bangash",            "Pul Bangash",                  28.6678, 77.1988, ["red"]),
  pratap_nagar:           s("pratap_nagar",           "Pratap Nagar",                 28.6698, 77.1888, ["red"]),
  shastri_nagar:          s("shastri_nagar",          "Shastri Nagar",                28.6718, 77.1858, ["red"]),
  inderlok:               s("inderlok",               "Inderlok",                     28.6748, 77.1878, ["red", "green"], { isInterchange: true }),
  kanhaiya_nagar:         s("kanhaiya_nagar",         "Kanhaiya Nagar",               28.6828, 77.1748, ["red"]),
  keshav_puram:           s("keshav_puram",           "Keshav Puram",                 28.6908, 77.1638, ["red"]),
  netaji_subhash_place:   s("netaji_subhash_place",   "Netaji Subhash Place",         28.6988, 77.1528, ["red", "pink"], { isInterchange: true,
    gates: [
      { id: "1", description: "Near Samrat Hotel, Pitampura main road", hasLift: true },
      { id: "5", description: "Towards Sulabh Toilet Complex, NSP Market", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: true },
    platformInfo: {
      red:  { number: 1, direction: "towards Rithala" },
      pink: { number: 3, direction: "towards Majlis Park" },
    },
  }),
  kohat_enclave:          s("kohat_enclave",          "Kohat Enclave",                28.7038, 77.1428, ["red"]),
  pitampura:              s("pitampura",              "Pitampura",                    28.7088, 77.1338, ["red"]),
  rohini_east:            s("rohini_east",            "Rohini East",                  28.7158, 77.1238, ["red"]),
  rohini_west:            s("rohini_west",            "Rohini West",                  28.7218, 77.1158, ["red"]),
  rithala:                s("rithala",                "Rithala",                      28.7288, 77.1128, ["red"]),

  // ══════════════════════════════════════════════════════════════════════
  // YELLOW LINE (37 stations) — Samaypur Badli ↔ Millennium City Centre (N → S)
  // ══════════════════════════════════════════════════════════════════════
  samaypur_badli:         s("samaypur_badli",         "Samaypur Badli",               28.7299, 77.1425, ["yellow"]),
  rohini_sec_18_19:       s("rohini_sec_18_19",       "Rohini Sector 18, 19",         28.7218, 77.1498, ["yellow"]),
  haiderpur_badli_mor:    s("haiderpur_badli_mor",    "Haiderpur Badli Mor",          28.7168, 77.1548, ["yellow"]),
  jahangirpuri:           s("jahangirpuri",           "Jahangirpuri",                 28.7268, 77.1628, ["yellow"]),
  adarsh_nagar:           s("adarsh_nagar",           "Adarsh Nagar",                 28.7108, 77.1742, ["yellow"]),
  azadpur:                s("azadpur",                "Azadpur",                      28.7052, 77.1812, ["yellow", "red"], { isInterchange: true }),
  model_town:             s("model_town",             "Model Town",                   28.7008, 77.1908, ["yellow"]),
  gtb_nagar:              s("gtb_nagar",              "Guru Teg Bahadur Nagar",       28.6988, 77.2088, ["yellow"]),
  vishwavidyalaya:        s("vishwavidyalaya",        "Vishwavidyalaya",              28.6988, 77.2088, ["yellow"]),
  civil_lines:            s("civil_lines",            "Civil Lines",                  28.6888, 77.2238, ["yellow"]),
  // kashmere_gate shared with Red + Violet — defined above
  chandni_chowk:          s("chandni_chowk",         "Chandni Chowk",                28.6568, 77.2288, ["yellow"], { isUnderground: true }),
  chawri_bazaar:          s("chawri_bazaar",          "Chawri Bazaar",                28.6468, 77.2288, ["yellow"], { isUnderground: true }),
  new_delhi:              s("new_delhi",              "New Delhi",                    28.6368, 77.2208, ["yellow", "orange"], { isInterchange: true, isUnderground: true,
    gates: [
      { id: "1", description: "Ajmeri Gate side, Vabhuti Marg", hasLift: true },
      { id: "6", description: "New Delhi Railway Station (main exit)", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: false, fourWheeler: false },
    platformInfo: {
      yellow: { number: 1, direction: "towards HUDA City Centre" },
      orange: { number: 1, direction: "towards Dwarka Sector 21 / Airport" },
    },
  }),
  rajiv_chowk:            s("rajiv_chowk",            "Rajiv Chowk",                  28.6328, 77.2197, ["yellow", "blue"], { isInterchange: true, isUnderground: true,
    gates: [
      { id: "1", description: "Panchkuian Road, B Block, Minto Road", hasLift: true },
      { id: "2", description: "PVR Plaza, Connaught Place", hasLift: true },
      { id: "3", description: "A Block, Connaught Place", hasLift: true },
      { id: "4", description: "E Block, Barakhamba Road & KG Road", hasLift: true },
      { id: "5", description: "Janpath Road, F Block", hasLift: true },
      { id: "6", description: "Janpath Road, Palika Bazar", hasLift: true },
      { id: "7", description: "H Block, Connaught Place", hasLift: true },
      { id: "8", description: "Panchkuian Road, A Block", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: true },
    platformInfo: {
      yellow: { number: 1, direction: "towards HUDA City Centre / Gurugram" },
      blue: { number: 3, direction: "towards Noida / Vaishali" },
    },
  }),
  patel_chowk:            s("patel_chowk",            "Patel Chowk",                  28.6238, 77.2128, ["yellow"], { isUnderground: true }),
  central_secretariat:    s("central_secretariat",    "Central Secretariat",          28.6148, 77.2118, ["yellow", "violet"], { isInterchange: true, isUnderground: true,
    gates: [
      { id: "1", description: "Rail Bhawan side, Raisina Road", hasLift: true },
      { id: "2", description: "Vijay Chowk, Rajpath", hasLift: true },
      { id: "3", description: "India Gate side, Janpath", hasLift: true },
      { id: "4", description: "Sunehari Bagh Masjid side", hasLift: true },
      { id: "5", description: "Tughlak Road, South Avenue", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: false, fourWheeler: false },
    platformInfo: {
      yellow: { number: 1, direction: "towards HUDA City Centre / Gurugram" },
      violet: { number: 3, direction: "towards Raja Nahar Singh / Ballabhgarh" },
    },
  }),
  udyog_bhawan:           s("udyog_bhawan",           "Udyog Bhawan",                 28.6088, 77.2138, ["yellow"], { isUnderground: true }),
  lok_kalyan_marg:        s("lok_kalyan_marg",        "Lok Kalyan Marg",              28.5938, 77.2028, ["yellow"]),
  jor_bagh:               s("jor_bagh",               "Jor Bagh",                     28.5858, 77.2018, ["yellow"]),
  ina:                    s("ina",                    "INA",                          28.5698, 77.2098, ["yellow"]),
  aiims_yellow:           s("aiims_yellow",           "AIIMS",                        28.5668, 77.2118, ["yellow"],
    {
      gates: [
        { id: "1", description: "Towards AIIMS OPD / Main Hospital entrance", hasLift: true, hasRamp: true },
        { id: "2", description: "Towards Ansari Nagar East, AIIMS Trauma Centre", hasLift: true },
        { id: "3", description: "Towards Safdarjung Hospital", hasLift: true },
        { id: "4", description: "Towards Laxmibai Nagar / Ring Road", hasLift: true },
      ],
      parkingAvailable: { twoWheeler: false, fourWheeler: false },
      platformInfo: {
        yellow: { number: 1, direction: "towards HUDA City Centre / Gurugram" },
      },
    }),
  green_park:             s("green_park",             "Green Park",                   28.5568, 77.2068, ["yellow"]),
  hauz_khas:              s("hauz_khas",              "Hauz Khas",                    28.5438, 77.2038, ["yellow", "magenta"], { isInterchange: true,
    gates: [
      { id: "1", description: "Near IIT Delhi, Ring Road", hasLift: true },
      { id: "2", description: "Kalu Sarai, Aurobindo Marg side", hasLift: true },
      { id: "3", description: "Hauz Khas Village, Sri Fort side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: true },
    platformInfo: {
      yellow: { number: 1, direction: "towards HUDA City Centre / Gurugram" },
      magenta: { number: 3, direction: "towards Botanical Garden" },
    },
  }),
  malviya_nagar:          s("malviya_nagar",          "Malviya Nagar",                28.5288, 77.1988, ["yellow"]),
  saket:                  s("saket",                  "Saket",                        28.5228, 77.2108, ["yellow"]),
  qutab_minar:            s("qutab_minar",            "Qutab Minar",                  28.5258, 77.1878, ["yellow"]),
  chhattarpur:            s("chhattarpur",            "Chhattarpur",                  28.5098, 77.1778, ["yellow"]),
  sultanpur:              s("sultanpur",              "Sultanpur",                    28.4978, 77.1698, ["yellow"]),
  ghitorni:               s("ghitorni",               "Ghitorni",                     28.4898, 77.1568, ["yellow"]),
  arjan_garh:             s("arjan_garh",             "Arjan Garh",                   28.4768, 77.1468, ["yellow"]),
  guru_dronacharya:       s("guru_dronacharya",       "Guru Dronacharya",             28.4608, 77.1338, ["yellow"]),
  sikanderpur:            s("sikanderpur",            "Sikanderpur",                  28.4808, 77.0932, ["yellow"]),
  mg_road_gurgaon:        s("mg_road_gurgaon",        "MG Road",                      28.4748, 77.0692, ["yellow"]),
  iffco_chowk:            s("iffco_chowk",            "IFFCO Chowk",                  28.4698, 77.0768, ["yellow"]),
  millennium_city_centre: s("millennium_city_centre", "Millennium City Centre",       28.4618, 77.0722, ["yellow"]),

  // ══════════════════════════════════════════════════════════════════════
  // BLUE LINE MAIN (49 stations) — Dwarka Sec 21 ↔ Noida Electronic City
  // ══════════════════════════════════════════════════════════════════════
  dwarka_sec_21:          s("dwarka_sec_21",          "Dwarka Sector 21",             28.5612, 77.0580, ["blue", "orange"], { isInterchange: true }),
  dwarka_sec_8:           s("dwarka_sec_8",           "Dwarka Sector 8",              28.5692, 77.0698, ["blue"]),
  dwarka_sec_9:           s("dwarka_sec_9",           "Dwarka Sector 9",              28.5768, 77.0818, ["blue"]),
  dwarka_sec_10:          s("dwarka_sec_10",          "Dwarka Sector 10",             28.5848, 77.0918, ["blue"]),
  dwarka_sec_11:          s("dwarka_sec_11",          "Dwarka Sector 11",             28.5918, 77.1008, ["blue"]),
  dwarka_sec_12:          s("dwarka_sec_12",          "Dwarka Sector 12",             28.5988, 77.1098, ["blue"]),
  dwarka_sec_13:          s("dwarka_sec_13",          "Dwarka Sector 13",             28.6048, 77.1188, ["blue"]),
  dwarka_sec_14:          s("dwarka_sec_14",          "Dwarka Sector 14",             28.6108, 77.1268, ["blue"]),
  dwarka_mor:             s("dwarka_mor",             "Dwarka Mor",                   28.6178, 77.0988, ["blue"]),
  nawada:                 s("nawada",                 "Nawada",                       28.6258, 77.0948, ["blue"]),
  uttam_nagar_west:       s("uttam_nagar_west",       "Uttam Nagar West",             28.6318, 77.0878, ["blue"]),
  uttam_nagar_east:       s("uttam_nagar_east",       "Uttam Nagar East",             28.6358, 77.0828, ["blue"]),
  janakpuri_west:         s("janakpuri_west",         "Janakpuri West",               28.6288, 77.0838, ["blue", "magenta"], { isInterchange: true }),
  janakpuri_east:         s("janakpuri_east",         "Janakpuri East",               28.6348, 77.0958, ["blue"]),
  tilak_nagar:            s("tilak_nagar",            "Tilak Nagar",                  28.6418, 77.1058, ["blue"]),
  subhash_nagar:          s("subhash_nagar",          "Subhash Nagar",                28.6468, 77.1168, ["blue"]),
  tagore_garden:          s("tagore_garden",          "Tagore Garden",                28.6498, 77.1278, ["blue"]),
  rajouri_garden:         s("rajouri_garden",         "Rajouri Garden",               28.6498, 77.1308, ["blue", "pink"], { isInterchange: true,
    gates: [
      { id: "3", description: "Near Rajouri Garden Main Market", hasLift: true },
      { id: "7", description: "Near ICICI Bank, A Block", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: true },
    platformInfo: {
      blue: { number: 1, direction: "towards Dwarka Sector 21" },
      pink: { number: 3, direction: "towards Majlis Park" },
    },
  }),
  ramesh_nagar:           s("ramesh_nagar",           "Ramesh Nagar",                 28.6508, 77.1448, ["blue"]),
  moti_nagar:             s("moti_nagar",             "Moti Nagar",                   28.6538, 77.1558, ["blue"]),
  kirti_nagar:            s("kirti_nagar",            "Kirti Nagar",                  28.6548, 77.1498, ["blue", "green"], { isInterchange: true }),
  shadipur:               s("shadipur",               "Shadipur",                     28.6508, 77.1618, ["blue"]),
  patel_nagar:            s("patel_nagar",            "Patel Nagar",                  28.6488, 77.1748, ["blue"]),
  rajendra_place:         s("rajendra_place",         "Rajendra Place",               28.6468, 77.1888, ["blue"]),
  karol_bagh:             s("karol_bagh",             "Karol Bagh",                   28.6468, 77.1988, ["blue"], { isUnderground: true }),
  jhandewalan:            s("jhandewalan",            "Jhandewalan",                  28.6448, 77.2068, ["blue"], { isUnderground: true }),
  ramakrishna_ashram_marg:s("ramakrishna_ashram_marg","Ramakrishna Ashram Marg",      28.6388, 77.2138, ["blue"], { isUnderground: true }),
  // rajiv_chowk shared Yellow ↔ Blue — defined above
  barakhamba_road:        s("barakhamba_road",        "Barakhamba Road",              28.6308, 77.2258, ["blue"], { isUnderground: true }),
  mandi_house:            s("mandi_house",            "Mandi House",                  28.6272, 77.2392, ["blue", "violet"], { isInterchange: true, isUnderground: true,
    gates: [
      { id: "1", description: "Near Lajpat Rai Market / Delhi Public Library", hasLift: true },
      { id: "2", description: "Near Kasturba Hospital, Lal Qila side", hasLift: true },
      { id: "3", description: "Near Lal Qila, Chandni Chowk side", hasLift: true },
      { id: "4", description: "Near Meena Bazar", hasLift: true },
      { id: "5", description: "Feroz Shah Kotla / BSES side", hasLift: true },
      { id: "6", description: "Vikas Bhawan, Inst. of Engineering", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: false, fourWheeler: false },
    platformInfo: {
      blue: { number: 1, direction: "towards Dwarka Sector 21" },
      violet: { number: 3, direction: "towards Raja Nahar Singh / Ballabhgarh" },
    },
  }),
  supreme_court:          s("supreme_court",          "Supreme Court",                28.6318, 77.2498, ["blue"], { isUnderground: true }),
  indraprastha:           s("indraprastha",           "Indraprastha",                 28.6352, 77.2638, ["blue"], { isUnderground: true }),
  yamuna_bank:            s("yamuna_bank",            "Yamuna Bank",                  28.6418, 77.2908, ["blue", "blue_b"], { isInterchange: true }),
  akshardham:             s("akshardham",             "Akshardham",                   28.6218, 77.2968, ["blue"]),
  mayur_vihar_1:          s("mayur_vihar_1",          "Mayur Vihar Phase-1",          28.6088, 77.2948, ["blue", "pink"], { isInterchange: true }),
  mayur_vihar_ext:        s("mayur_vihar_ext",        "Mayur Vihar Extension",        28.5988, 77.3048, ["blue"]),
  new_ashok_nagar:        s("new_ashok_nagar",        "New Ashok Nagar",              28.5908, 77.3148, ["blue"]),
  noida_sec_15:           s("noida_sec_15",           "Noida Sector 15",              28.5828, 77.3258, ["blue"]),
  noida_sec_16:           s("noida_sec_16",           "Noida Sector 16",              28.5748, 77.3358, ["blue"]),
  noida_sec_18:           s("noida_sec_18",           "Noida Sector 18",              28.5648, 77.3428, ["blue"]),
  botanical_garden:       s("botanical_garden",       "Botanical Garden",             28.5570, 77.3370, ["blue", "magenta"], { isInterchange: true,
    gates: [
      { id: "1", description: "Near NOIDA Authority Parking, Sector 38A", hasLift: true },
      { id: "2", description: "DHL side, Okhla Bird Sanctuary Road", hasLift: true },
      { id: "3", description: "Botanical Garden Republic, Sector 38", hasLift: true },
      { id: "4", description: "Towards Sector 37, Indian Oil Petrol Pump", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: true },
    platformInfo: {
      blue:    { number: 1, direction: "towards Dwarka Sector 21" },
      magenta: { number: 3, direction: "towards Janakpuri West" },
    },
  }),
  golf_course:            s("golf_course",            "Golf Course",                  28.5618, 77.3638, ["blue"]),
  noida_city_centre:      s("noida_city_centre",      "Noida City Centre",            28.5698, 77.3848, ["blue"]),
  noida_sec_34:           s("noida_sec_34",           "Noida Sector 34",              28.5748, 77.4008, ["blue"]),
  noida_sec_52:           s("noida_sec_52",           "Noida Sector 52",              28.5788, 77.4148, ["blue"]),
  noida_sec_61:           s("noida_sec_61",           "Noida Sector 61",              28.5808, 77.4298, ["blue"]),
  noida_sec_59:           s("noida_sec_59",           "Noida Sector 59",              28.5758, 77.4428, ["blue"]),
  noida_sec_62:           s("noida_sec_62",           "Noida Sector 62",              28.5668, 77.4598, ["blue"]),
  noida_electronic_city:  s("noida_electronic_city",  "Noida Electronic City",        28.5523, 77.4875, ["blue"]),

  // ══════════════════════════════════════════════════════════════════════
  // BLUE_B LINE — Vaishali Branch (Yamuna Bank ↔ Vaishali)
  // ══════════════════════════════════════════════════════════════════════
  // yamuna_bank shared — defined above
  laxmi_nagar:            s("laxmi_nagar",            "Laxmi Nagar",                  28.6418, 77.3048, ["blue_b"]),
  nirman_vihar:           s("nirman_vihar",           "Nirman Vihar",                 28.6418, 77.3188, ["blue_b"]),
  preet_vihar:            s("preet_vihar",            "Preet Vihar",                  28.6418, 77.3308, ["blue_b"]),
  karkardooma:            s("karkardooma",            "Karkardooma",                  28.6448, 77.3088, ["blue_b"]),
  anand_vihar:            s("anand_vihar",            "Anand Vihar ISBT",             28.6468, 77.3128, ["blue_b", "pink"], { isInterchange: true }),
  kaushambi:              s("kaushambi",              "Kaushambi",                    28.6448, 77.3268, ["blue_b"]),
  vaishali:               s("vaishali",               "Vaishali",                     28.6418, 77.3468, ["blue_b"]),

  // ══════════════════════════════════════════════════════════════════════
  // GREEN LINE (24 stations) — Brigadier Hoshiyar Singh ↔ Inderlok
  // ══════════════════════════════════════════════════════════════════════
  brigadier_hoshiyar:     s("brigadier_hoshiyar",    "Brigadier Hoshiyar Singh",     28.7128, 77.0668, ["green"]),
  bahadurgarh_city:       s("bahadurgarh_city",      "Bahadurgarh City",             28.7068, 77.0748, ["green"]),
  pandit_sree_ram_sharma: s("pandit_sree_ram_sharma","Pandit Shree Ram Sharma",       28.7008, 77.0828, ["green"]),
  tikri_border:           s("tikri_border",           "Tikri Border",                 28.6948, 77.0908, ["green"]),
  tikri_kalan:            s("tikri_kalan",            "Tikri Kalan",                  28.6888, 77.0988, ["green"]),
  ghevra:                 s("ghevra",                 "Ghevra",                       28.6818, 77.1068, ["green"]),
  mundka:                 s("mundka",                 "Mundka",                       28.6748, 77.1148, ["green"]),
  mundka_industrial:      s("mundka_industrial",      "Mundka Industrial Area",       28.6688, 77.1238, ["green"]),
  rajdhani_park:          s("rajdhani_park",          "Rajdhani Park",                28.6628, 77.1328, ["green"]),
  nangloi_rly:            s("nangloi_rly",            "Nangloi Railway Station",      28.6568, 77.1418, ["green"]),
  nangloi:                s("nangloi",                "Nangloi",                      28.6518, 77.1508, ["green"]),
  surajmal_stadium:       s("surajmal_stadium",       "Surajmal Stadium",             28.6468, 77.1608, ["green"]),
  udyog_nagar:            s("udyog_nagar",            "Udyog Nagar",                  28.6418, 77.1698, ["green"]),
  peera_garhi:            s("peera_garhi",            "Peera Garhi",                  28.6368, 77.1778, ["green"]),
  paschim_vihar_west:     s("paschim_vihar_west",     "Paschim Vihar West",           28.6668, 77.1008, ["green"]),
  paschim_vihar_east:     s("paschim_vihar_east",     "Paschim Vihar East",           28.6618, 77.1108, ["green"]),
  madipur:                s("madipur",                "Madipur",                      28.6568, 77.1288, ["green"]),
  shivaji_park:           s("shivaji_park",           "Shivaji Park",                 28.6538, 77.1408, ["green"]),
  punjabi_bagh_east:      s("punjabi_bagh_east",      "Punjabi Bagh East",            28.6498, 77.1528, ["green"]),
  ashok_park_main:        s("ashok_park_main",        "Ashok Park Main",              28.6578, 77.1658, ["green"]),
  // inderlok shared with Red — defined above
  // kirti_nagar shared with Blue — defined above

  // ══════════════════════════════════════════════════════════════════════
  // VIOLET LINE (34 stations) — Kashmere Gate ↔ Raja Nahar Singh (N → SE)
  // ══════════════════════════════════════════════════════════════════════
  // kashmere_gate shared — defined in Red Line section
  lal_quila:              s("lal_quila",              "Lal Qila",                     28.6558, 77.2408, ["violet"], { isUnderground: true }),
  jama_masjid:            s("jama_masjid",            "Jama Masjid",                  28.6508, 77.2358, ["violet"], { isUnderground: true }),
  delhi_gate:             s("delhi_gate",             "Delhi Gate",                   28.6448, 77.2388, ["violet"], { isUnderground: true }),
  ito:                    s("ito",                    "ITO",                           28.6348, 77.2428, ["violet"]),
  // mandi_house shared with Blue — defined above
  janpath:                s("janpath",                "Janpath",                       28.6228, 77.2228, ["violet"], { isUnderground: true }),
  // central_secretariat shared with Yellow — defined above
  khan_market:            s("khan_market",            "Khan Market",                   28.6018, 77.2258, ["violet"]),
  jawaharlal_nehru_stad:  s("jawaharlal_nehru_stad",  "JLN Stadium",                   28.5918, 77.2328, ["violet"]),
  jangpura:               s("jangpura",               "Jangpura",                      28.5818, 77.2418, ["violet"]),
  lajpat_nagar:           s("lajpat_nagar",           "Lajpat Nagar",                  28.5698, 77.2418, ["violet", "pink"], { isInterchange: true,
    gates: [
      { id: "1", description: "Towards Lajpat Nagar-2, A Block Central Market", hasLift: true },
      { id: "2", description: "Towards South Extension Part-I", hasLift: true },
      { id: "3", description: "Towards Defence Colony", hasLift: true },
      { id: "5", description: "Central Market main entrance", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: false },
    platformInfo: {
      violet: { number: 1, direction: "towards Kashmere Gate" },
      pink: { number: 3, direction: "towards Majlis Park" },
    },
  }),
  moolchand:              s("moolchand",              "Moolchand",                     28.5608, 77.2368, ["violet"]),
  kailash_colony:         s("kailash_colony",         "Kailash Colony",                28.5508, 77.2378, ["violet"]),
  nehru_place:            s("nehru_place",            "Nehru Place",                   28.5468, 77.2508, ["violet"]),
  kalkaji_mandir:         s("kalkaji_mandir",         "Kalkaji Mandir",                28.5468, 77.2528, ["violet", "magenta"], { isInterchange: true,
    gates: [
      { id: "1", description: "Near BigBazaar entrance, Kalkaji Main", hasLift: true },
      { id: "3", description: "Near Fire Station, Nehru Place side", hasLift: true },
      { id: "4", description: "Okhla Market side", hasLift: true },
    ],
    parkingAvailable: { twoWheeler: true, fourWheeler: true },
    platformInfo: {
      violet: { number: 1, direction: "towards Kashmere Gate" },
      magenta: { number: 3, direction: "towards Botanical Garden" },
    },
  }),
  govind_puri:            s("govind_puri",            "Govind Puri",                   28.5378, 77.2568, ["violet"]),
  harkesh_nagar:          s("harkesh_nagar",          "Harkesh Nagar Okhla",           28.5308, 77.2628, ["violet"]),
  jasola:                 s("jasola",                 "Jasola Apollo",                 28.5248, 77.2718, ["violet"]),
  sarita_vihar:           s("sarita_vihar",           "Sarita Vihar",                  28.5188, 77.2858, ["violet"]),
  mohan_estate:           s("mohan_estate",           "Mohan Estate",                  28.5128, 77.2988, ["violet"]),
  tughlakabad:            s("tughlakabad",            "Tughlakabad",                   28.5028, 77.3028, ["violet"]),
  badarpur:               s("badarpur",               "Badarpur Border",               28.4948, 77.3128, ["violet"]),
  sarai:                  s("sarai",                  "Sarai",                         28.5068, 77.3028, ["violet"]),
  nhpc_chowk:             s("nhpc_chowk",             "NHPC Chowk",                    28.5168, 77.3028, ["violet"]),
  mewala_maharajpur:      s("mewala_maharajpur",      "Mewala Maharajpur",             28.4988, 77.3188, ["violet"]),
  sector_28_faridabad:    s("sector_28_faridabad",    "Sector 28 Faridabad",           28.4888, 77.3288, ["violet"]),
  badkhal_mor:            s("badkhal_mor",            "Badkhal Mor",                   28.4788, 77.3388, ["violet"]),
  old_faridabad:          s("old_faridabad",          "Old Faridabad",                 28.4688, 77.3448, ["violet"]),
  neelam_ajronda:         s("neelam_ajronda",         "Neelam Ajronda Chowk",         28.4588, 77.3528, ["violet"]),
  bata_chowk:             s("bata_chowk",             "Bata Chowk",                    28.4488, 77.3588, ["violet"]),
  escorts_mujesar:        s("escorts_mujesar",        "Escorts Mujesar",               28.4388, 77.3618, ["violet"]),
  raja_nahar_singh:       s("raja_nahar_singh",       "Raja Nahar Singh (Ballabhgarh)",28.4048, 77.3538, ["violet"]),

  // ══════════════════════════════════════════════════════════════════════
  // ORANGE LINE — Airport Express (6 stations, separate fare)
  // New Delhi ↔ Dwarka Sector 21
  // ══════════════════════════════════════════════════════════════════════
  // new_delhi shared — defined above
  shivaji_stadium:        s("shivaji_stadium",        "Shivaji Stadium",               28.6258, 77.2088, ["orange"], { isUnderground: true }),
  dhaula_kuan:            s("dhaula_kuan",            "Dhaula Kuan",                   28.5958, 77.1648, ["orange"]),
  igi_t3:                 s("igi_t3",                 "IGI Airport Terminal 3",        28.5568, 77.0938, ["orange"]),
  aerocity:               s("aerocity",               "Aerocity",                      28.5508, 77.1208, ["orange"]),
  // dwarka_sec_21 shared — defined above

  // ══════════════════════════════════════════════════════════════════════
  // PINK LINE (46 stations) — Majlis Park ↔ Shiv Vihar
  // The "ring" line connecting multiple corridor interchanges
  // ══════════════════════════════════════════════════════════════════════
  majlis_park:            s("majlis_park",            "Majlis Park",                   28.7308, 77.1558, ["pink", "magenta"], { isInterchange: true }),
  azadpur_pink:           s("azadpur_pink",           "Azadpur",                       28.7052, 77.1812, ["pink"]),
  // Note: different entry/exit than Yellow Line Azadpur but tagged same
  shalimar_bagh:          s("shalimar_bagh",          "Shalimar Bagh",                 28.7168, 77.1718, ["pink"]),
  shakurpur:              s("shakurpur",              "Shakurpur",                     28.7008, 77.1558, ["pink"]),
  punjabi_bagh_west:      s("punjabi_bagh_west",      "Punjabi Bagh West",             28.6688, 77.1418, ["pink"]),
  esogra:                 s("esogra",                 "ESI-Hari Nagar",                28.6588, 77.1118, ["pink"]),
  mayapuri:               s("mayapuri",               "Mayapuri",                      28.6518, 77.1048, ["pink"]),
  naraina_vihar:          s("naraina_vihar",          "Naraina Vihar",                 28.6388, 77.1028, ["pink"]),
  delhi_cantonment:       s("delhi_cantonment",       "Delhi Cantonment",              28.6178, 77.0958, ["pink"]),
  durgabai_deshmukh:      s("durgabai_deshmukh",      "Durgabai Deshmukh South Campus",28.5918, 77.0958, ["pink"]),
  dashrathpuri:           s("dashrathpuri",           "Dashrathpuri",                  28.5848, 77.1038, ["pink"]),
  palam:                  s("palam",                  "Palam",                         28.5788, 77.1138, ["pink"]),
  sadar_bazaar_cant:      s("sadar_bazaar_cant",      "Sadar Bazaar Cantonment",       28.5718, 77.1278, ["pink"]),
  terminal_1_igi:         s("terminal_1_igi",         "Terminal 1 IGI Airport",        28.5668, 77.1018, ["pink"]),
  shankar_vihar:          s("shankar_vihar",          "Shankar Vihar",                 28.5778, 77.1208, ["pink"]),
  vasant_vihar:           s("vasant_vihar",           "Vasant Vihar",                  28.5698, 77.1558, ["pink"]),
  munirka:                s("munirka",                "Munirka",                       28.5608, 77.1748, ["pink"]),
  rk_puram:               s("rk_puram",               "R.K. Puram",                    28.5578, 77.1858, ["pink"]),
  iit_delhi:              s("iit_delhi",              "IIT Delhi",                     28.5448, 77.1928, ["pink"]),
  hauz_khas_pink:         s("hauz_khas_pink",         "Hauz Khas",                     28.5438, 77.2038, ["pink"]),
  // Note: hauz_khas_pink separate from hauz_khas (Yellow-Magenta) by skywalk
  panchsheel_park:        s("panchsheel_park",        "Panchsheel Park",               28.5388, 77.2168, ["pink"]),
  chirag_delhi:           s("chirag_delhi",           "Chirag Delhi",                  28.5298, 77.2258, ["pink"]),
  greater_kailash:        s("greater_kailash",        "Greater Kailash",               28.5208, 77.2348, ["pink"]),
  nehru_enclave:          s("nehru_enclave",          "Nehru Enclave",                 28.5118, 77.2448, ["pink"]),
  // kalkaji_mandir shared with Violet-Magenta — defined above
  okhla_nsic:             s("okhla_nsic",             "Okhla NSIC",                    28.5178, 77.2618, ["pink"]),
  new_friends_colony:     s("new_friends_colony",     "New Friends Colony",            28.5258, 77.2768, ["pink"]),
  okhla_vihar:            s("okhla_vihar",            "Okhla Vihar",                   28.5338, 77.2888, ["pink"]),
  jasola_vihar:           s("jasola_vihar",           "Jasola Vihar Shaheen Bagh",     28.5418, 77.2998, ["pink"]),
  // kalindi_kunj area
  kalindi_kunj:           s("kalindi_kunj",           "Kalindi Kunj",                  28.5298, 77.3128, ["pink"]),
  okhla_bird_sanctuary:   s("okhla_bird_sanctuary",  "Okhla Bird Sanctuary",          28.5318, 77.3248, ["pink"]),
  botanical_garden_pink:  s("botanical_garden_pink",  "Botanical Garden",              28.5438, 77.3448, ["pink"]),
  // Note: linked to Blue-Magenta Botanical Garden by skywalk
  // mayur_vihar_1 shared with Blue — defined above
  mayur_vihar_pocket_1:   s("mayur_vihar_pocket_1",  "Mayur Vihar Pocket-1",          28.6018, 77.2948, ["pink"]),
  trilokpuri:             s("trilokpuri",             "Trilokpuri Sanjay Lake",        28.6118, 77.3038, ["pink"]),
  east_vinod_nagar:       s("east_vinod_nagar",       "East Vinod Nagar–Mayur Vihar II",28.6208, 77.3128, ["pink"]),
  ip_extension:           s("ip_extension",           "IP Extension",                  28.6308, 77.3228, ["pink"]),
  // anand_vihar shared with Blue_B — defined above
  karkardooma_court:      s("karkardooma_court",      "Karkardooma Court",             28.6528, 77.3108, ["pink"]),
  krishna_nagar:          s("krishna_nagar",          "Krishna Nagar",                 28.6618, 77.3008, ["pink"]),
  east_azad_nagar:        s("east_azad_nagar",        "East Azad Nagar",               28.6718, 77.2908, ["pink"]),
  // welcome shared with Red — defined above
  jaffrabad:              s("jaffrabad",              "Jaffrabad",                     28.6788, 77.2838, ["pink"]),
  maujpur_babarpur:       s("maujpur_babarpur",       "Maujpur-Babarpur",              28.6878, 77.2798, ["pink"]),
  gokulpuri:              s("gokulpuri",              "Gokulpuri",                     28.6958, 77.2768, ["pink"]),
  johri_enclave:          s("johri_enclave",          "Johri Enclave",                 28.7038, 77.2738, ["pink"]),
  shiv_vihar:             s("shiv_vihar",             "Shiv Vihar",                    28.6988, 77.3568, ["pink"]),
  // netaji_subhash_place shared with Red — defined above
  // rajouri_garden shared with Blue — defined above
  // lajpat_nagar shared with Violet — defined above

  // ══════════════════════════════════════════════════════════════════════
  // MAGENTA LINE (33+ stations) — Botanical Garden ↔ Majlis Park (+ Phase 4)
  // ══════════════════════════════════════════════════════════════════════
  // botanical_garden shared — defined above in Blue
  // hauz_khas shared — defined above in Yellow
  // kalkaji_mandir shared — defined above in Violet
  // janakpuri_west shared — defined above in Blue
  // majlis_park shared — defined above in Pink
  okhla_phase_1:          s("okhla_phase_1",          "Okhla Phase 1",                 28.5308, 77.3348, ["magenta"]),
  okhla_phase_2:          s("okhla_phase_2",          "Okhla Phase 2",                 28.5258, 77.3148, ["magenta"]),
  sukhdev_vihar:          s("sukhdev_vihar",          "Sukhdev Vihar",                 28.5468, 77.2878, ["magenta"]),
  jamia_millia_islamia:   s("jamia_millia_islamia",   "Jamia Millia Islamia",          28.5618, 77.2778, ["magenta"]),
  okhla_vihar_mag:        s("okhla_vihar_mag",        "Okhla Vihar",                   28.5718, 77.2818, ["magenta"]),
  jasola_vihar_mag:       s("jasola_vihar_mag",       "Jasola Vihar",                  28.5448, 77.2898, ["magenta"]),
  sarita_vihar_mag:       s("sarita_vihar_mag",       "Sarita Vihar",                  28.5358, 77.2868, ["magenta"]),
  mohan_estate_mag:       s("mohan_estate_mag",       "Mohan Estate",                  28.5268, 77.2828, ["magenta"]),
  south_campus:           s("south_campus",           "South Campus Delhi Univ",       28.5668, 77.2218, ["magenta"]),
  durgabai_deshmukh_mag:  s("durgabai_deshmukh_mag",  "Durgabai Deshmukh South Campus",28.5388, 77.2068, ["magenta"]),
  sir_vishweshwaraiah:    s("sir_vishweshwaraiah",    "Sir Vishweshwaraiah Moti Bagh", 28.5558, 77.1878, ["magenta"]),
  bhikaji_cama_place:     s("bhikaji_cama_place",     "Bhikaji Cama Place",            28.5668, 77.1908, ["magenta"]),
  palam_vihar:            s("palam_vihar",            "Palam Vihar",                   28.5128, 77.0678, ["magenta"]),
  sector_24_dwarka:       s("sector_24_dwarka",       "Sector 24 Dwarka",              28.5458, 77.0578, ["magenta"]),
  sector_25_26_dwarka:    s("sector_25_26_dwarka",    "Sector 25, 26 Dwarka",         28.5538, 77.0648, ["magenta"]),
  sector_21_dwarka_mag:   s("sector_21_dwarka_mag",   "Dwarka Sector 21",              28.5612, 77.0580, ["magenta"]),
  // Note: This IS the same as dwarka_sec_21 on Blue/Orange but Magenta runs through it as well
  // For simplicity, route planner treats them as adjacent/same
  dabri_mor:              s("dabri_mor",              "Dabri Mor–Janakpuri South",     28.6128, 77.0768, ["magenta"]),
  dashrathpuri_mag:       s("dashrathpuri_mag",       "Dashrathpuri",                  28.6218, 77.0848, ["magenta"]),
  palam_mag:              s("palam_mag",              "Palam",                         28.6308, 77.0938, ["magenta"]),
  sadar_bazaar_cant_mag:  s("sadar_bazaar_cant_mag",  "Sadar Bazaar Cantonment",       28.6388, 77.1028, ["magenta"]),
  terminal_1_mag:         s("terminal_1_mag",         "Terminal 1 IGI Airport",        28.5668, 77.1018, ["magenta"]),
  deepali_chowk:          s("deepali_chowk",          "Deepali Chowk",                 28.7208, 77.1598, ["magenta"]),
  bhalaswa:               s("bhalaswa",               "Bhalaswa",                      28.7278, 77.1688, ["magenta"]),
  // majlis_park shared — defined above (Phase 4 extension to Majlis Park)

  // ══════════════════════════════════════════════════════════════════════
  // GREY LINE (3 operational stations) — Dwarka ↔ Dhansa Bus Stand
  // ══════════════════════════════════════════════════════════════════════
  dwarka_grey:            s("dwarka_grey",            "Dwarka",                        28.5908, 77.0628, ["grey"]),
  nangli:                 s("nangli",                 "Nangli",                        28.5828, 77.0518, ["grey"]),
  najafgarh:              s("najafgarh",              "Najafgarh",                     28.6068, 77.0148, ["grey"]),
  dhansa_bus_stand:       s("dhansa_bus_stand",       "Dhansa Bus Stand",              28.6148, 76.9948, ["grey"]),
};

// Line station sequences
export const LINE_STATIONS: Record<DelhiLine, string[]> = {
  red: [
    "shaheed_sthal","hindon_river","arthala","mohan_nagar","shyam_park",
    "major_mohit_sharma","raj_bagh","shaheed_nagar","dilshad_garden","jhilmil",
    "mansarovar_park","shahdara","welcome","seelampur","shastri_park",
    "kashmere_gate","tis_hazari","pul_bangash","pratap_nagar","shastri_nagar",
    "inderlok","kanhaiya_nagar","keshav_puram","netaji_subhash_place",
    "kohat_enclave","pitampura","rohini_east","rohini_west","rithala",
  ],
  yellow: [
    "samaypur_badli","rohini_sec_18_19","haiderpur_badli_mor","jahangirpuri",
    "adarsh_nagar","azadpur","model_town","gtb_nagar","vishwavidyalaya",
    "civil_lines","kashmere_gate","chandni_chowk","chawri_bazaar","new_delhi",
    "rajiv_chowk","patel_chowk","central_secretariat","udyog_bhawan",
    "lok_kalyan_marg","jor_bagh","ina","aiims_yellow","green_park","hauz_khas",
    "malviya_nagar","saket","qutab_minar","chhattarpur","sultanpur","ghitorni",
    "arjan_garh","guru_dronacharya","sikanderpur","mg_road_gurgaon",
    "iffco_chowk","millennium_city_centre",
  ],
  blue: [
    "dwarka_sec_21","dwarka_sec_8","dwarka_sec_9","dwarka_sec_10","dwarka_sec_11",
    "dwarka_sec_12","dwarka_sec_13","dwarka_sec_14","dwarka_mor","nawada",
    "uttam_nagar_west","uttam_nagar_east","janakpuri_west","janakpuri_east",
    "tilak_nagar","subhash_nagar","tagore_garden","rajouri_garden","ramesh_nagar",
    "moti_nagar","kirti_nagar","shadipur","patel_nagar","rajendra_place",
    "karol_bagh","jhandewalan","ramakrishna_ashram_marg","rajiv_chowk",
    "barakhamba_road","mandi_house","supreme_court","indraprastha","yamuna_bank",
    "akshardham","mayur_vihar_1","mayur_vihar_ext","new_ashok_nagar",
    "noida_sec_15","noida_sec_16","noida_sec_18","botanical_garden",
    "golf_course","noida_city_centre","noida_sec_34","noida_sec_52",
    "noida_sec_61","noida_sec_59","noida_sec_62","noida_electronic_city",
  ],
  blue_b: [
    "yamuna_bank","laxmi_nagar","nirman_vihar","preet_vihar",
    "karkardooma","anand_vihar","kaushambi","vaishali",
  ],
  green: [
    "brigadier_hoshiyar","bahadurgarh_city","pandit_sree_ram_sharma",
    "tikri_border","tikri_kalan","ghevra","mundka","mundka_industrial",
    "rajdhani_park","nangloi_rly","nangloi","surajmal_stadium","udyog_nagar",
    "peera_garhi","paschim_vihar_west","paschim_vihar_east","madipur",
    "shivaji_park","punjabi_bagh_east","ashok_park_main","inderlok",
    "kirti_nagar",
  ],
  violet: [
    "kashmere_gate","lal_quila","jama_masjid","delhi_gate","ito","mandi_house",
    "janpath","central_secretariat","khan_market","jawaharlal_nehru_stad",
    "jangpura","lajpat_nagar","moolchand","kailash_colony","nehru_place",
    "kalkaji_mandir","govind_puri","harkesh_nagar","jasola","sarita_vihar",
    "mohan_estate","tughlakabad","badarpur","sarai","nhpc_chowk",
    "mewala_maharajpur","sector_28_faridabad","badkhal_mor","old_faridabad",
    "neelam_ajronda","bata_chowk","escorts_mujesar","raja_nahar_singh",
  ],
  orange: [
    "new_delhi","shivaji_stadium","dhaula_kuan","igi_t3","aerocity","dwarka_sec_21",
  ],
  pink: [
    "majlis_park","shalimar_bagh","azadpur_pink","shakurpur","punjabi_bagh_west",
    "esogra","mayapuri","naraina_vihar","delhi_cantonment","durgabai_deshmukh",
    "dashrathpuri","palam","sadar_bazaar_cant","terminal_1_igi","shankar_vihar",
    "vasant_vihar","munirka","rk_puram","iit_delhi","hauz_khas_pink",
    "panchsheel_park","chirag_delhi","greater_kailash","nehru_enclave",
    "kalkaji_mandir","okhla_nsic","new_friends_colony","okhla_vihar",
    "jasola_vihar","kalindi_kunj","okhla_bird_sanctuary","botanical_garden_pink",
    "mayur_vihar_1","mayur_vihar_pocket_1","trilokpuri","east_vinod_nagar",
    "ip_extension","anand_vihar","karkardooma_court","krishna_nagar",
    "east_azad_nagar","welcome","jaffrabad","maujpur_babarpur","gokulpuri",
    "johri_enclave","shiv_vihar",
    "netaji_subhash_place","rajouri_garden","lajpat_nagar",
  ],
  magenta: [
    "botanical_garden","okhla_phase_1","okhla_phase_2","sukhdev_vihar",
    "jamia_millia_islamia","okhla_vihar_mag","jasola_vihar_mag","sarita_vihar_mag",
    "mohan_estate_mag","kalkaji_mandir","hauz_khas","south_campus",
    "durgabai_deshmukh_mag","sir_vishweshwaraiah","bhikaji_cama_place",
    "janakpuri_west","dabri_mor","dashrathpuri_mag","palam_mag",
    "sadar_bazaar_cant_mag","terminal_1_mag","sector_21_dwarka_mag",
    "sector_25_26_dwarka","sector_24_dwarka","palam_vihar","deepali_chowk",
    "bhalaswa","majlis_park",
  ],
  grey: [
    "dwarka_grey","nangli","najafgarh","dhansa_bus_stand",
  ],
};

export const LINE_TERMINALS: Record<DelhiLine, { start: string; end: string }> = {
  red:     { start: "Shaheed Sthal (New Bus Adda)", end: "Rithala" },
  yellow:  { start: "Samaypur Badli", end: "Millennium City Centre" },
  blue:    { start: "Dwarka Sector 21", end: "Noida Electronic City" },
  blue_b:  { start: "Yamuna Bank", end: "Vaishali" },
  green:   { start: "Brigadier Hoshiyar Singh", end: "Kirti Nagar" },
  violet:  { start: "Kashmere Gate", end: "Raja Nahar Singh (Ballabhgarh)" },
  orange:  { start: "New Delhi", end: "Dwarka Sector 21" },
  pink:    { start: "Majlis Park", end: "Shiv Vihar" },
  magenta: { start: "Botanical Garden", end: "Majlis Park" },
  grey:    { start: "Dwarka", end: "Dhansa Bus Stand" },
};

export const INTERCHANGE_STATIONS = new Set(
  Object.values(stations)
    .filter((s) => s.isInterchange)
    .map((s) => s.id)
);

export const getStationLines = (id: string): DelhiLine[] =>
  stations[id]?.lines ?? [];

export const getOrganizedStations = () =>
  (Object.keys(LINE_STATIONS) as DelhiLine[]).map((line) => ({
    line,
    lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map((id) => stations[id]).filter(Boolean),
  }));

// All Delhi stations are operational
export const OPERATIONAL_STATIONS = new Set(Object.keys(stations as Record<string, unknown>));
