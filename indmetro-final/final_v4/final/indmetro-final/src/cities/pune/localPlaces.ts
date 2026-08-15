import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── Swargate ─────────────────────────────────────────────────────────────
  { id: "swargate_isbt",      name: "Swargate Inter-State Bus Terminal", category: "transport",    coordinates: [18.5012, 73.8618], nearestStationId: "swargate",         distanceKm: 0.1 },
  { id: "pataleshwar_caves",  name: "Pataleshwar Cave Temple",           category: "heritage",     coordinates: [18.5185, 73.8498], nearestStationId: "swargate",         distanceKm: 1.5 },

  // ── Mandai ────────────────────────────────────────────────────────────────
  { id: "mahatma_phule_mandai",name:"Mahatma Phule Market (Mandai)",     category: "shopping",     coordinates: [18.5105, 73.8568], nearestStationId: "mandai",           distanceKm: 0.1 },
  { id: "lal_mahal",          name: "Lal Mahal",                         category: "heritage",     coordinates: [18.5160, 73.8558], nearestStationId: "mandai",           distanceKm: 0.7 },
  { id: "shaniwar_wada",      name: "Shaniwar Wada",                     category: "heritage",     coordinates: [18.5196, 73.8554], nearestStationId: "mandai",           distanceKm: 1.0 },
  { id: "saras_baug",         name: "Saras Baug (Ganpati Temple)",       category: "religious",    coordinates: [18.4968, 73.8538], nearestStationId: "mandai",           distanceKm: 1.5 },

  // ── Budhwar Peth ─────────────────────────────────────────────────────────
  { id: "tulsi_baug",         name: "Tulsi Baug Market",                 category: "shopping",     coordinates: [18.5135, 73.8572], nearestStationId: "budhwar_peth",     distanceKm: 0.2 },
  { id: "kasba_ganpati",      name: "Kasba Ganpati Temple",              category: "religious",    coordinates: [18.5178, 73.8552], nearestStationId: "budhwar_peth",     distanceKm: 0.5 },

  // ── Civil Court ───────────────────────────────────────────────────────────
  { id: "pune_civil_court",   name: "Pune District Court",               category: "civic",        coordinates: [18.5212, 73.8548], nearestStationId: "civil_court",      distanceKm: 0.1 },

  // ── Shivajinagar ─────────────────────────────────────────────────────────
  { id: "shivajinagar_rly",   name: "Shivajinagar Railway Station",      category: "transport",    coordinates: [18.5328, 73.8468], nearestStationId: "shivajinagar",     distanceKm: 0.1 },
  { id: "fc_road",            name: "Fergusson College Road (FC Road)",   category: "entertainment",coordinates: [18.5288, 73.8428], nearestStationId: "shivajinagar",     distanceKm: 0.5 },
  { id: "pune_university",    name: "Savitribai Phule Pune University",   category: "education",    coordinates: [18.5568, 73.8142], nearestStationId: "shivajinagar",     distanceKm: 3.0 },

  // ── Range Hills ──────────────────────────────────────────────────────────
  { id: "aga_khan_palace",    name: "Aga Khan Palace",                   category: "heritage",     coordinates: [18.5508, 73.8958], nearestStationId: "range_hills",      distanceKm: 5.5 },

  // ── Khadki ───────────────────────────────────────────────────────────────
  { id: "khadki_cantonment",  name: "Khadki Cantonment & Ammunition Factory", category: "civic",   coordinates: [18.5662, 73.8228], nearestStationId: "khadki",           distanceKm: 0.2 },

  // ── Dapodi / Bopodi ──────────────────────────────────────────────────────
  { id: "bhakti_shakti_garden",name:"Bhakti Shakti Garden",              category: "park",         coordinates: [18.5878, 73.7978], nearestStationId: "dapodi",           distanceKm: 0.3 },

  // ── PCMC Bhavan ──────────────────────────────────────────────────────────
  { id: "pcmc_headquarters",  name: "PCMC Municipal Headquarters",       category: "civic",        coordinates: [18.6278, 73.8058], nearestStationId: "pcmc_bhavan",      distanceKm: 0.05 },
  { id: "pimpri_chinchwad",   name: "Pimpri-Chinchwad Industrial Area",  category: "civic",        coordinates: [18.6238, 73.7998], nearestStationId: "pcmc_bhavan",      distanceKm: 0.5 },

  // ── Pune Railway Station (Aqua Line) ─────────────────────────────────────
  { id: "pune_junction_rly",  name: "Pune Junction Railway Station",     category: "transport",    coordinates: [18.5278, 73.8742], nearestStationId: "pune_railway_station", distanceKm: 0.05 },
  { id: "pune_airport_ref",   name: "Pune International Airport (7 km)", category: "transport",    coordinates: [18.5821, 73.9197], nearestStationId: "nagar_road",       distanceKm: 3.5 },

  // ── Deccan Gymkhana ───────────────────────────────────────────────────────
  { id: "deccan_college",     name: "Deccan College (archaeology)",      category: "education",    coordinates: [18.5448, 73.8338], nearestStationId: "deccan_gymkhana",   distanceKm: 1.8 },
  { id: "jm_road",            name: "JM Road (Jangali Maharaj Road)",    category: "shopping",     coordinates: [18.5188, 73.8498], nearestStationId: "deccan_gymkhana",   distanceKm: 0.3 },
  { id: "dagdusheth_ganpati", name: "Dagdusheth Halwai Ganpati Temple",  category: "religious",    coordinates: [18.5157, 73.8572], nearestStationId: "deccan_gymkhana",   distanceKm: 1.2 },

  // ── Nal Stop ─────────────────────────────────────────────────────────────
  { id: "karve_road_market",  name: "Karve Road Commercial Area",        category: "shopping",     coordinates: [18.5172, 73.8338], nearestStationId: "nal_stop",         distanceKm: 0.1 },

  // ── Garware College ──────────────────────────────────────────────────────
  { id: "garware_stadium",    name: "Balewadi Sports Complex",           category: "sports",       coordinates: [18.5778, 73.7758], nearestStationId: "garware_college",   distanceKm: 4.5 },

  // ── Bund Garden ──────────────────────────────────────────────────────────
  { id: "bund_garden_park",   name: "Bund Garden (Fitzgerald Bridge Park)", category: "park",     coordinates: [18.5438, 73.8898], nearestStationId: "bund_garden",       distanceKm: 0.1 },
  { id: "koregaon_park",      name: "Koregaon Park (restaurants/pubs)",  category: "entertainment",coordinates: [18.5400, 73.8978], nearestStationId: "bund_garden",       distanceKm: 0.8 },
  { id: "osho_ashram",        name: "Osho International Meditation Resort", category: "religious", coordinates: [18.5348, 73.9038], nearestStationId: "bund_garden",       distanceKm: 1.5 },

  // ── Yerawada ─────────────────────────────────────────────────────────────
  { id: "yerawada_jail",      name: "Yerawada Central Prison (historic)",category: "heritage",     coordinates: [18.5548, 73.8998], nearestStationId: "yerawada",         distanceKm: 0.8 },

  // ── Ruby Hall Clinic ─────────────────────────────────────────────────────
  { id: "ruby_hall",          name: "Ruby Hall Clinic",                  category: "hospital",     coordinates: [18.5358, 73.8792], nearestStationId: "ruby_hall_clinic",  distanceKm: 0.05 },
  { id: "sassoon_hospital",   name: "Sassoon General Hospital",          category: "hospital",     coordinates: [18.5218, 73.8728], nearestStationId: "ruby_hall_clinic",  distanceKm: 1.5 },

  // ── PMC ──────────────────────────────────────────────────────────────────
  { id: "pmc_headquarters",   name: "Pune Municipal Corporation",        category: "civic",        coordinates: [18.5202, 73.8678], nearestStationId: "pmc",              distanceKm: 0.05 },

  // ── Ramwadi ──────────────────────────────────────────────────────────────
  { id: "ramwadi_area",       name: "Ramwadi Bus Stand",                 category: "transport",    coordinates: [18.5738, 73.9118], nearestStationId: "ramwadi",          distanceKm: 0.1 },

  // ── Nagar Road ───────────────────────────────────────────────────────────
  { id: "phoenix_marketcity", name: "Phoenix Marketcity Pune",           category: "shopping",     coordinates: [18.5598, 73.9188], nearestStationId: "nagar_road",       distanceKm: 0.8 },
  { id: "eon_it_park",        name: "EON IT Park (Kharadi)",             category: "civic",        coordinates: [18.5508, 73.9388], nearestStationId: "nagar_road",       distanceKm: 2.5 },
];
