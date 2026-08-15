import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── LINE 1 — Blue ──────────────────────────────────────────────────────────
  { id: "juhu_beach",          name: "Juhu Beach",                             category: "park",       coordinates: [19.0989, 72.8265], nearestStationId: "versova",          distanceKm: 2.5  },
  { id: "versova_beach",       name: "Versova Beach",                          category: "park",       coordinates: [19.1382, 72.8168], nearestStationId: "versova",          distanceKm: 0.4  },
  { id: "andheri_rly_l1",      name: "Andheri Railway Station (WR)",           category: "transport",  coordinates: [19.1197, 72.8468], nearestStationId: "andheri_l1",       distanceKm: 0.1  },
  { id: "andheri_market",      name: "Andheri Market",                         category: "shopping",   coordinates: [19.119,  72.844],  nearestStationId: "andheri_l1",       distanceKm: 0.3  },
  { id: "seepz_industrial",    name: "SEEPZ Export Zone",                      category: "civic",      coordinates: [19.110,  72.875],  nearestStationId: "saki_naka",        distanceKm: 0.5  },
  { id: "kurla_terminus",      name: "Lokmanya Tilak Terminus (LTT)",          category: "transport",  coordinates: [19.074,  72.891],  nearestStationId: "ghatkopar",        distanceKm: 2.0  },
  { id: "ghatkopar_rly",       name: "Ghatkopar Railway Station (Central)",    category: "transport",  coordinates: [19.0869, 72.9072], nearestStationId: "ghatkopar",        distanceKm: 0.05 },
  { id: "r_city_mall",         name: "R City Mall, Ghatkopar",                 category: "shopping",   coordinates: [19.086,  72.910],  nearestStationId: "ghatkopar",        distanceKm: 0.3  },
  { id: "infiniti_mall_andheri",name:"Infiniti Mall, Andheri",                 category: "shopping",   coordinates: [19.131,  72.830],  nearestStationId: "dnyaneshwar",      distanceKm: 0.5  },

  // ── LINE 2A — Yellow ───────────────────────────────────────────────────────
  { id: "dahisar_rly",         name: "Dahisar Railway Station (WR)",           category: "transport",  coordinates: [19.2475, 72.8565], nearestStationId: "dahisar_east",     distanceKm: 0.4  },
  { id: "sanjay_gandhi_np",    name: "Sanjay Gandhi National Park",            category: "park",       coordinates: [19.214,  72.877],  nearestStationId: "national_park_l7", distanceKm: 0.5  },
  { id: "borivali_rly",        name: "Borivali Railway Station (WR)",          category: "transport",  coordinates: [19.1723, 72.8563], nearestStationId: "borivali_east",    distanceKm: 1.5  },
  { id: "hypercity_malad",     name: "HyperCity Mall, Malad",                  category: "shopping",   coordinates: [19.1875, 72.8540], nearestStationId: "kandivali_east",   distanceKm: 1.8  },
  { id: "malad_rly",           name: "Malad Railway Station (WR)",             category: "transport",  coordinates: [19.1875, 72.8487], nearestStationId: "malad_2a",         distanceKm: 0.2  },
  { id: "inorbit_mall_malad",  name: "Inorbit Mall, Malad",                    category: "shopping",   coordinates: [19.178,  72.844],  nearestStationId: "malad_2a",         distanceKm: 1.0  },
  { id: "goregaon_rly",        name: "Goregaon Railway Station (WR)",          category: "transport",  coordinates: [19.1558, 72.8510], nearestStationId: "goregaon_east_2a", distanceKm: 1.5  },

  // ── LINE 3 — Aqua (Underground) ───────────────────────────────────────────
  { id: "aarey_forest",        name: "Aarey Colony Forest (Green Lung)",       category: "park",       coordinates: [19.152,  72.870],  nearestStationId: "aarey_jvlr",       distanceKm: 1.0  },
  { id: "film_city",           name: "Film City (Dadasaheb Phalke Chitranagari)", category: "heritage", coordinates: [19.158,  72.875],  nearestStationId: "aarey_jvlr",       distanceKm: 1.5  },
  { id: "csia_airport",        name: "Chhatrapati Shivaji Int'l Airport (T1/T2)", category: "transport", coordinates: [19.093, 72.861],  nearestStationId: "csmia_t1",         distanceKm: 0.2  },
  { id: "bkc_hub",             name: "Bandra Kurla Complex (BKC Financial Hub)", category: "civic",    coordinates: [19.065,  72.862],  nearestStationId: "bkc",              distanceKm: 0.1  },
  { id: "nsci_bkc",            name: "NSCI Dome, BKC",                         category: "park",       coordinates: [19.068,  72.867],  nearestStationId: "bkc",              distanceKm: 0.4  },
  { id: "dharavi_township",    name: "Dharavi (Asia's Largest Slum / Township)", category: "heritage", coordinates: [19.042,  72.852],  nearestStationId: "dharavi_l3",       distanceKm: 0.3  },
  { id: "siddhivinayak_temple","name":"Siddhivinayak Ganesh Temple",            category: "religious",  coordinates: [19.0170, 72.8303], nearestStationId: "siddhivinayak",    distanceKm: 0.2  },
  { id: "shivaji_park",        name: "Shivaji Park (Dadar)",                   category: "park",       coordinates: [19.028,  72.840],  nearestStationId: "dadar_l3",         distanceKm: 1.0  },
  { id: "dadar_rly_central",   name: "Dadar Railway Station (Central Line)",   category: "transport",  coordinates: [19.019,  72.843],  nearestStationId: "dadar_l3",         distanceKm: 0.15 },
  { id: "dadar_rly_western",   name: "Dadar Railway Station (Western Line)",   category: "transport",  coordinates: [19.022,  72.840],  nearestStationId: "dadar_l3",         distanceKm: 0.3  },
  { id: "worli_sea_face",      name: "Worli Sea Face & Bandra-Worli Sealink",  category: "park",       coordinates: [19.014,  72.818],  nearestStationId: "worli",            distanceKm: 0.8  },
  { id: "nehru_science_centre","name":"Nehru Science Centre (Museum)",          category: "heritage",   coordinates: [18.977,  72.820],  nearestStationId: "science_museum",   distanceKm: 0.3  },
  { id: "mahalaxmi_temple",    name: "Mahalaxmi Temple",                       category: "religious",  coordinates: [18.982,  72.809],  nearestStationId: "mahalaxmi_l3",     distanceKm: 0.9  },
  { id: "mahalaxmi_rly",       name: "Mahalaxmi Railway Station (WR)",         category: "transport",  coordinates: [18.9818, 72.8228], nearestStationId: "mahalaxmi_l3",     distanceKm: 0.15 },
  { id: "monorail_mahalaxmi",  name: "Mahalaxmi Monorail Station",             category: "transport",  coordinates: [18.9818, 72.8225], nearestStationId: "mahalaxmi_l3",     distanceKm: 0.1  },
  { id: "haji_ali_dargah",     name: "Haji Ali Dargah",                        category: "religious",  coordinates: [18.9825, 72.8095], nearestStationId: "mahalaxmi_l3",     distanceKm: 1.5  },
  { id: "mumbai_central_rly",  name: "Mumbai Central Railway Station (WR)",    category: "transport",  coordinates: [18.969,  72.820],  nearestStationId: "jagannath_sheth",  distanceKm: 0.2  },
  { id: "grant_road_rly",      name: "Grant Road Railway Station (WR)",        category: "transport",  coordinates: [18.963,  72.820],  nearestStationId: "grant_road_l3",    distanceKm: 0.15 },
  { id: "kalbadevi_market",    name: "Kalbadevi Market (Zaveri Bazaar area)",  category: "shopping",   coordinates: [18.952,  72.829],  nearestStationId: "kalbadevi",        distanceKm: 0.15 },
  { id: "crawford_market",     name: "Crawford Market (Mahatma Jyotiba Phule)", category: "shopping",  coordinates: [18.948,  72.835],  nearestStationId: "kalbadevi",        distanceKm: 0.6  },
  { id: "csmt_station",        name: "Chhatrapati Shivaji Maharaj Terminus (UNESCO WH)", category: "heritage", coordinates: [18.940, 72.835], nearestStationId: "csmt_l3",   distanceKm: 0.15 },
  { id: "harbour_line_csmt",   name: "CSMT Harbour Line Platform",             category: "transport",  coordinates: [18.939,  72.836],  nearestStationId: "csmt_l3",          distanceKm: 0.15 },
  { id: "churchgate_rly",      name: "Churchgate Railway Station (WR terminal)", category: "transport", coordinates: [18.9355, 72.8258], nearestStationId: "churchgate_l3",   distanceKm: 0.05 },
  { id: "marine_drive",        name: "Marine Drive (Queen's Necklace)",        category: "park",       coordinates: [18.9430, 72.8232], nearestStationId: "churchgate_l3",    distanceKm: 0.5  },
  { id: "nariman_point",       name: "Nariman Point (Financial District)",     category: "civic",      coordinates: [18.9246, 72.8231], nearestStationId: "vidhan_bhavan",    distanceKm: 0.4  },
  { id: "rbi_fort",            name: "RBI Headquarters, Fort",                 category: "civic",      coordinates: [18.935,  72.833],  nearestStationId: "hutatma_chowk",    distanceKm: 0.6  },
  { id: "gateway_of_india",    name: "Gateway of India",                       category: "heritage",   coordinates: [18.9220, 72.8347], nearestStationId: "cuffe_parade",     distanceKm: 1.8  },
  { id: "cuffe_parade_area",   name: "Cuffe Parade Residential & Colaba Causeway", category: "shopping", coordinates: [18.912, 72.820],  nearestStationId: "cuffe_parade",   distanceKm: 0.3  },
  { id: "taj_mahal_hotel",     name: "Taj Mahal Palace Hotel",                 category: "heritage",   coordinates: [18.922,  72.833],  nearestStationId: "cuffe_parade",     distanceKm: 1.5  },

  // ── LINE 7 — Red ───────────────────────────────────────────────────────────
  { id: "sgnp_entrance",       name: "SGNP Borivali Entrance (Kanheri Caves)", category: "park",       coordinates: [19.214,  72.889],  nearestStationId: "national_park_l7", distanceKm: 0.4  },
  { id: "aarey_depot_l7",      name: "Aarey Colony Depot Area",               category: "civic",      coordinates: [19.153,  72.856],  nearestStationId: "aarey_l7",         distanceKm: 0.1  },
  { id: "jogeshwari_rly",      name: "Jogeshwari Railway Station (WR)",        category: "transport",  coordinates: [19.136,  72.849],  nearestStationId: "jogeshwari_east",  distanceKm: 1.0  },
  { id: "gundavali_skywalk",   name: "Gundavali Skywalk to Andheri (Line 1)", category: "transport",  coordinates: [19.115,  72.855],  nearestStationId: "gundavali",        distanceKm: 0.1  },
  { id: "andheri_east_market", name: "Andheri East Market & MIDC",            category: "shopping",   coordinates: [19.115,  72.865],  nearestStationId: "gundavali",        distanceKm: 0.5  },

  // ── LINE 9 — Red Extension ─────────────────────────────────────────────────
  { id: "mira_bhayandar",      name: "Mira-Bhayandar Municipal Area",         category: "civic",       coordinates: [19.276,  72.878],  nearestStationId: "kashigaon",        distanceKm: 0.3  },
  { id: "kashigaon_village",   name: "Kashigaon Village",                     category: "civic",       coordinates: [19.276,  72.878],  nearestStationId: "kashigaon",        distanceKm: 0.05 },
];
