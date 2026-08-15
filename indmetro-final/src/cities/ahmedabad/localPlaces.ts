import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── Vastral Gam (E terminal) ──
  { id: "vastral_village",        name: "Vastral Village",                        category: "civic",      coordinates: [23.010, 72.655], nearestStationId: "vastral_gam",        distanceKm: 0.1  },
  { id: "vastral_lake",           name: "Vastral Lake",                           category: "park",       coordinates: [23.008, 72.650], nearestStationId: "vastral_gam",        distanceKm: 0.5  },
  { id: "apmc_ahm",               name: "APMC Yard, Ahmedabad",                   category: "shopping",   coordinates: [22.998, 72.537], nearestStationId: "apmc",               distanceKm: 0.05 },

  // ── Apparel Park ──
  { id: "apparel_park_hub",       name: "Apparel Park Industrial Hub",            category: "civic",      coordinates: [23.015, 72.645], nearestStationId: "apparel_park",       distanceKm: 0.1  },
  { id: "sparrow_mall",           name: "Sparrow Mall, Vastral",                  category: "shopping",   coordinates: [23.013, 72.648], nearestStationId: "apparel_park",       distanceKm: 0.4  },

  // ── Amraiwadi ──
  { id: "amraiwadi_market",       name: "Amraiwadi Market",                       category: "shopping",   coordinates: [23.020, 72.632], nearestStationId: "amraiwadi",          distanceKm: 0.1  },
  { id: "essar_house",            name: "Essar House (LG area)",                  category: "civic",      coordinates: [23.022, 72.630], nearestStationId: "amraiwadi",          distanceKm: 0.3  },

  // ── Kalupur (Main interchange) ──
  { id: "ahmedabad_junction",     name: "Ahmedabad Junction Railway Station",     category: "transport",  coordinates: [23.027, 72.583], nearestStationId: "kalupur",            distanceKm: 0.2  },
  { id: "kalupur_bus_stand",      name: "Kalupur Bus Stand (AMTS/GSRTC)",         category: "transport",  coordinates: [23.028, 72.580], nearestStationId: "kalupur",            distanceKm: 0.3  },
  { id: "bhadra_fort",            name: "Bhadra Fort & Bhadra Kali Temple",       category: "heritage",   coordinates: [23.025, 72.577], nearestStationId: "kalupur",            distanceKm: 0.6  },
  { id: "teen_darwaja",           name: "Teen Darwaja (Triple Gateway)",           category: "heritage",   coordinates: [23.024, 72.578], nearestStationId: "kalupur",            distanceKm: 0.8  },

  // ── Old High Court / Income Tax ──
  { id: "gujarat_high_court",     name: "Gujarat High Court (Old Building)",      category: "civic",      coordinates: [23.032, 72.588], nearestStationId: "old_high_court",     distanceKm: 0.05 },
  { id: "income_tax_circle",      name: "Income Tax Circle",                      category: "civic",      coordinates: [23.035, 72.589], nearestStationId: "income_tax",         distanceKm: 0.05 },
  { id: "law_garden",             name: "Law Garden Night Market",                category: "shopping",   coordinates: [23.040, 72.562], nearestStationId: "income_tax",         distanceKm: 1.5  },

  // ── Relief Road / Lal Darwaja ──
  { id: "lal_darwaja_market",     name: "Lal Darwaja Market",                     category: "shopping",   coordinates: [23.027, 72.565], nearestStationId: "lal_darwaja",        distanceKm: 0.05 },
  { id: "relief_road_bazaar",     name: "Relief Road Bazaar (Electronics)",       category: "shopping",   coordinates: [23.028, 72.572], nearestStationId: "relief_road",        distanceKm: 0.05 },
  { id: "hutheesing_jain_temple", name: "Hutheesing Jain Temple",                 category: "religious",  coordinates: [23.032, 72.570], nearestStationId: "lal_darwaja",        distanceKm: 0.6  },

  // ── Paldi ──
  { id: "calico_museum",          name: "Calico Museum of Textiles",              category: "heritage",   coordinates: [23.039, 72.548], nearestStationId: "paldi",              distanceKm: 1.0  },
  { id: "shreyas_folk_museum",    name: "Shreyas Folk Museum",                    category: "heritage",   coordinates: [23.042, 72.550], nearestStationId: "paldi",              distanceKm: 1.2  },
  { id: "paldi_market",           name: "Paldi Market",                           category: "shopping",   coordinates: [23.030, 72.558], nearestStationId: "paldi",              distanceKm: 0.1  },

  // ── Ambawadi ──
  { id: "ambawadi_circle",        name: "Ambawadi Circle",                        category: "transport",  coordinates: [23.034, 72.550], nearestStationId: "ambawadi",           distanceKm: 0.05 },
  { id: "cg_road",                name: "CG Road (Commercial Hub)",               category: "shopping",   coordinates: [23.035, 72.543], nearestStationId: "ambawadi",           distanceKm: 0.5  },
  { id: "iscon_mall",             name: "ISCON Mega Mall",                        category: "shopping",   coordinates: [23.038, 72.530], nearestStationId: "ambawadi",           distanceKm: 1.5  },

  // ── Commerce Six Roads ──
  { id: "commerce_six_roads_jn",  name: "Commerce Six Roads Junction",            category: "transport",  coordinates: [23.038, 72.542], nearestStationId: "commerce_six_roads", distanceKm: 0.05 },
  { id: "kiran_cinema",           name: "Kiran Cinema, Navrangpura",              category: "civic",      coordinates: [23.039, 72.540], nearestStationId: "commerce_six_roads", distanceKm: 0.2  },

  // ── Municipal Market ──
  { id: "municipal_market_bldg",  name: "Municipal Market Building",              category: "shopping",   coordinates: [23.041, 72.538], nearestStationId: "municipal_market",   distanceKm: 0.05 },
  { id: "vijay_char_rasta",       name: "Vijay Char Rasta",                       category: "transport",  coordinates: [23.042, 72.540], nearestStationId: "municipal_market",   distanceKm: 0.2  },

  // ── Doordarshan Kendra ──
  { id: "dd_kendra_building",     name: "Doordarshan Kendra, Ahmedabad",          category: "civic",      coordinates: [23.043, 72.536], nearestStationId: "doordarshan_kendra", distanceKm: 0.05 },
  { id: "hl_college",             name: "HL College of Commerce",                 category: "education",  coordinates: [23.044, 72.534], nearestStationId: "doordarshan_kendra", distanceKm: 0.2  },

  // ── Gurukul Road ──
  { id: "gurukul_road_area",      name: "Gurukul Road (Residential & Schools)",   category: "civic",      coordinates: [23.046, 72.535], nearestStationId: "gurukul_road",       distanceKm: 0.05 },
  { id: "nirma_university",       name: "Nirma University",                       category: "education",  coordinates: [23.053, 72.520], nearestStationId: "gurukul_road",       distanceKm: 1.5  },
  { id: "drive_in_road",          name: "Drive-In Road (Food Street)",            category: "shopping",   coordinates: [23.051, 72.530], nearestStationId: "gurukul_road",       distanceKm: 0.8  },

  // ── Red Line — South (APMC area) ──
  { id: "rajiv_nagar_mkt",        name: "Rajiv Nagar Market",                     category: "shopping",   coordinates: [23.012, 72.545], nearestStationId: "rajiv_nagar",        distanceKm: 0.05 },
  { id: "jamalpur_darwaja",       name: "Jamalpur Darwaja (Heritage Gate)",       category: "heritage",   coordinates: [23.020, 72.552], nearestStationId: "jamalpur",           distanceKm: 0.1  },

  // ── Red Line — Mid (Gujarat College / University) ──
  { id: "gujarat_univ_campus",    name: "Gujarat University Campus",              category: "education",  coordinates: [23.046, 72.570], nearestStationId: "gujarat_university",  distanceKm: 0.1  },
  { id: "gujarat_college_bldg",   name: "Gujarat College (1879)",                 category: "education",  coordinates: [23.039, 72.582], nearestStationId: "gujarat_college",     distanceKm: 0.1  },
  { id: "stadium_cross_road",     name: "Stadium Cross Road",                     category: "transport",  coordinates: [23.043, 72.555], nearestStationId: "shreyas",            distanceKm: 0.5  },

  // ── Red Line — Vijay Nagar / Sabarmati ──
  { id: "vijay_nagar_market",     name: "Vijay Nagar Market",                     category: "shopping",   coordinates: [23.056, 72.562], nearestStationId: "vijay_nagar_ahm",    distanceKm: 0.1  },
  { id: "sabarmati_ashram",       name: "Sabarmati Ashram (Gandhi Ashram)",       category: "heritage",   coordinates: [23.061, 72.580], nearestStationId: "sabarmati_rly",      distanceKm: 1.2  },
  { id: "sabarmati_railway",      name: "Sabarmati Railway Station",              category: "transport",  coordinates: [23.070, 72.588], nearestStationId: "sabarmati_rly",      distanceKm: 0.05 },
  { id: "aec_campus",             name: "Ahmedabad Education Campus (AEC)",       category: "education",  coordinates: [23.075, 72.593], nearestStationId: "aec",                distanceKm: 0.1  },

  // ── Red Line — North (Motera) ──
  { id: "narendra_modi_stadium",  name: "Narendra Modi Stadium (World's Largest)", category: "park",      coordinates: [23.0995, 72.6035],nearestStationId: "motera",             distanceKm: 0.05 },
  { id: "nsit_campus",            name: "NSIT Campus",                            category: "education",  coordinates: [23.090, 72.588], nearestStationId: "nsit",               distanceKm: 0.05 },
  { id: "sardar_patel_stadium",   name: "Sardar Patel Stadium (Old)",             category: "park",       coordinates: [23.091, 72.596], nearestStationId: "motera",             distanceKm: 0.6  },

  // ── General Ahmedabad ──
  { id: "adalaj_stepwell",        name: "Adalaj Stepwell (Vav)",                  category: "heritage",   coordinates: [23.168, 72.580], nearestStationId: "chandkheda",         distanceKm: 8.0  },
  { id: "science_city_ahm",       name: "Science City, Ahmedabad",               category: "park",       coordinates: [23.072, 72.527], nearestStationId: "gurukul_road",       distanceKm: 4.0  },
  { id: "alpha_one_mall",         name: "Alpha One Mall",                         category: "shopping",   coordinates: [23.073, 72.523], nearestStationId: "gurukul_road",       distanceKm: 4.5  },
  { id: "kankaria_lake",          name: "Kankaria Lake & Zoo",                   category: "park",       coordinates: [23.006, 72.599], nearestStationId: "apmc",               distanceKm: 3.5  },
];
