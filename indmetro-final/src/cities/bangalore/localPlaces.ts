import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── MG Road / Trinity / Cubbon Park ────────────────────────────────────────
  { id: "mg_road_commercial",  name: "MG Road (Shopping & Pubs)",        category: "shopping",     coordinates: [12.9759, 77.6100], nearestStationId: "mg_road",            distanceKm: 0.05 },
  { id: "cubbon_park_blr",     name: "Cubbon Park",                      category: "park",         coordinates: [12.9788, 77.5928], nearestStationId: "cubbon_park",         distanceKm: 0.1 },
  { id: "visvesvaraya_museum", name: "Visvesvaraya Industrial & Tech Museum", category: "heritage", coordinates: [12.9766, 77.5968], nearestStationId: "cubbon_park",         distanceKm: 0.4 },
  { id: "high_court_blr",      name: "Karnataka High Court",             category: "civic",        coordinates: [12.9806, 77.5898], nearestStationId: "cubbon_park",         distanceKm: 0.4 },
  { id: "ulsoor_lake",         name: "Ulsoor Lake",                      category: "park",         coordinates: [12.9818, 77.6198], nearestStationId: "trinity",             distanceKm: 0.8 },

  // ── Vidhana Soudha ─────────────────────────────────────────────────────────
  { id: "vidhana_soudha_blr",  name: "Vidhana Soudha (State Legislature)", category: "heritage",  coordinates: [12.9798, 77.5908], nearestStationId: "vidhana_soudha",      distanceKm: 0.1 },
  { id: "banglore_palace",     name: "Bangalore Palace",                  category: "heritage",    coordinates: [13.0098, 77.5928], nearestStationId: "vidhana_soudha",      distanceKm: 3.5 },

  // ── Majestic ────────────────────────────────────────────────────────────────
  { id: "ksr_rly_station",     name: "KSR Bangalore City Railway Station", category: "transport",  coordinates: [12.9769, 77.5705], nearestStationId: "majestic",            distanceKm: 0.1 },
  { id: "majestic_area",       name: "Majestic Bus Terminal (KSRTC/BMTC)", category: "transport",  coordinates: [12.9760, 77.5700], nearestStationId: "majestic",            distanceKm: 0.2 },
  { id: "kempegowda_tower",    name: "Kempegowda Bus Station & Tower",    category: "civic",       coordinates: [12.9758, 77.5715], nearestStationId: "majestic",            distanceKm: 0.1 },

  // ── Indiranagar ─────────────────────────────────────────────────────────────
  { id: "100ft_road",          name: "100 Feet Road Indiranagar (Pubs & Cafes)", category: "entertainment", coordinates: [12.9748, 77.6388], nearestStationId: "indiranagar", distanceKm: 0.1 },
  { id: "domlur_flyover",      name: "Domlur Area (IT offices)",          category: "civic",       coordinates: [12.9618, 77.6378], nearestStationId: "indiranagar",         distanceKm: 1.5 },

  // ── ITPL / Whitefield ──────────────────────────────────────────────────────
  { id: "itpl_tech_park",      name: "ITPL International Tech Park",      category: "civic",       coordinates: [12.9885, 77.6772], nearestStationId: "itpl",               distanceKm: 0.05 },
  { id: "forum_value_mall",    name: "Forum Value Mall Whitefield",       category: "shopping",    coordinates: [12.9708, 77.7508], nearestStationId: "whitefield",          distanceKm: 0.5 },
  { id: "prestige_shantiniketan",name:"Prestige Shantiniketan",           category: "shopping",    coordinates: [12.9818, 77.7418], nearestStationId: "sri_sathya_sai",     distanceKm: 0.5 },

  // ── Baiyappanahalli / KR Puram ─────────────────────────────────────────────
  { id: "baiyappanahalli_rly", name: "Baiyappanahalli Railway Station",   category: "transport",   coordinates: [12.9908, 77.6505], nearestStationId: "baiyappanahalli",     distanceKm: 0.05 },
  { id: "hal_aerospace_museum",name: "HAL Aerospace Museum",              category: "heritage",    coordinates: [12.9618, 77.6568], nearestStationId: "baiyappanahalli",     distanceKm: 3.5 },

  // ── Yeshwanthpur (Green Line) ──────────────────────────────────────────────
  { id: "yeshwanthpur_rly",    name: "Yeshwanthpur Railway Station",      category: "transport",   coordinates: [12.9948, 77.5398], nearestStationId: "yeshwanthpur",        distanceKm: 0.05 },

  // ── Lalbagh / South End Circle (Green Line) ────────────────────────────────
  { id: "lalbagh_botanical",   name: "Lalbagh Botanical Garden",          category: "park",        coordinates: [12.9504, 77.5848], nearestStationId: "lalbagh",             distanceKm: 0.2 },
  { id: "south_end_market",    name: "South End Circle Market",           category: "shopping",    coordinates: [12.9368, 77.5838], nearestStationId: "south_end_circle",    distanceKm: 0.1 },

  // ── Jayanagar (Green Line) ─────────────────────────────────────────────────
  { id: "jayanagar_shopping",  name: "Jayanagar 4th Block Shopping Complex", category: "shopping", coordinates: [12.9278, 77.5848], nearestStationId: "jayanagar",           distanceKm: 0.1 },
  { id: "bull_temple",         name: "Bull Temple (Nandi Temple)",        category: "religious",   coordinates: [12.9418, 77.5718], nearestStationId: "jayanagar",           distanceKm: 2.0 },

  // ── RV Road (Interchange Green ↔ Yellow) ───────────────────────────────────
  { id: "rv_college",          name: "R.V. College of Engineering",       category: "education",   coordinates: [12.9232, 77.4988], nearestStationId: "rv_road",             distanceKm: 4.5 },

  // ── Banashankari (Green Line) ──────────────────────────────────────────────
  { id: "banashankari_temple", name: "Banashankari Amma Temple",          category: "religious",   coordinates: [12.9108, 77.5468], nearestStationId: "banashankari",        distanceKm: 1.5 },

  // ── JP Nagar / Puttenahalli (Green Line) ───────────────────────────────────
  { id: "jp_nagar_park",       name: "Puttenahalli Lake (JP Nagar)",      category: "park",        coordinates: [12.8938, 77.5718], nearestStationId: "jp_nagar",            distanceKm: 1.0 },

  // ── Mysore Road / Vijayanagar (Purple Line) ────────────────────────────────
  { id: "iskcon_temple",       name: "ISKCON Temple Rajajinagar",         category: "religious",   coordinates: [13.0065, 77.5538], nearestStationId: "rajajinagar",         distanceKm: 0.8 },
  { id: "vijayanagar_market",  name: "Vijayanagar Main Market",           category: "shopping",    coordinates: [12.9538, 77.5348], nearestStationId: "vijayanagar",         distanceKm: 0.1 },

  // ── Kengeri / Challaghatta (Purple Line west) ──────────────────────────────
  { id: "kengeri_satellite",   name: "Kengeri Satellite Town",            category: "civic",       coordinates: [12.9481, 77.4837], nearestStationId: "kengeri",             distanceKm: 0.1 },
  { id: "innovative_film_city",name: "Innovative Film City",              category: "entertainment",coordinates: [12.9068, 77.4338], nearestStationId: "challaghatta",        distanceKm: 5.5 },

  // ── Electronic City / Yellow Line ─────────────────────────────────────────
  { id: "ec_phase1",           name: "Electronic City Phase 1 (Infosys/Wipro)", category: "civic", coordinates: [12.8458, 77.6610], nearestStationId: "electronic_city",     distanceKm: 0.1 },
  { id: "ec_phase2",           name: "Electronic City Phase 2",           category: "civic",       coordinates: [12.8388, 77.6668], nearestStationId: "infosys_agrahara",    distanceKm: 0.5 },
  { id: "biocon_campus",       name: "Biocon Campus",                     category: "civic",       coordinates: [12.8058, 77.6808], nearestStationId: "hebbagodi",           distanceKm: 0.1 },

  // ── Central Silk Board (Yellow Line) ───────────────────────────────────────
  { id: "silk_board_junction", name: "Silk Board Junction (ORR × Hosur)", category: "transport",  coordinates: [12.9177, 77.6219], nearestStationId: "central_silk_board",  distanceKm: 0.2 },

  // ── Jayadeva Hospital (Yellow Line) ────────────────────────────────────────
  { id: "jayadeva_cvs",        name: "Jayadeva Institute of Cardiovascular Sciences", category: "hospital", coordinates: [12.9178, 77.6022], nearestStationId: "jayadeva_hospital", distanceKm: 0.05 },

  // ── Nagasandra / Peenya (Green Line north) ─────────────────────────────────
  { id: "peenya_industrial",   name: "Peenya Industrial Area",            category: "civic",       coordinates: [13.0168, 77.5208], nearestStationId: "peenya_industry",     distanceKm: 0.1 },

  // ── Madavara (Green Line north terminal) ───────────────────────────────────
  { id: "national_highway_4",  name: "NH-4 Tumkur Road Corridor",         category: "transport",   coordinates: [13.0675, 77.5350], nearestStationId: "madavara",            distanceKm: 0.2 },

  // ── Bommasandra (Yellow Line south terminal) ───────────────────────────────
  { id: "delta_electronics",   name: "Delta Electronics India HQ",        category: "civic",       coordinates: [12.7978, 77.6878], nearestStationId: "bommasandra",         distanceKm: 0.05 },
];
