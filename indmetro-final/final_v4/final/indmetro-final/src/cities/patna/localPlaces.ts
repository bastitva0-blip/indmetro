import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── Near Patliputra Bus Terminal (New ISBT) ──
  { id: "patliputra_isbt", name: "Patliputra Inter-State Bus Terminal (ISBT)", category: "transport", coordinates: [25.5793, 85.1897], nearestStationId: "patliputra_bus_terminal", distanceKm: 0.1 },
  { id: "patliputra_colony", name: "Patliputra Colony", category: "civic", coordinates: [25.583, 85.195], nearestStationId: "patliputra_bus_terminal", distanceKm: 0.6 },
  { id: "transport_nagar", name: "Transport Nagar", category: "civic", coordinates: [25.587, 85.188], nearestStationId: "zero_mile", distanceKm: 0.4 },

  // ── Near Zero Mile ──
  { id: "new_bypass_road", name: "New Bypass Road (NH-30)", category: "transport", coordinates: [25.5858, 85.186], nearestStationId: "zero_mile", distanceKm: 0.05 },
  { id: "boring_canal_road", name: "Boring Canal Road", category: "civic", coordinates: [25.594, 85.185], nearestStationId: "zero_mile", distanceKm: 0.8 },

  // ── Near Bhootnath ──
  { id: "bhootnath_market", name: "Bhootnath Road Market", category: "shopping", coordinates: [25.5875, 85.175], nearestStationId: "bhootnath", distanceKm: 0.3 },
  { id: "kankarbagh_market", name: "Kankarbagh Main Market", category: "shopping", coordinates: [25.593, 85.168], nearestStationId: "bhootnath", distanceKm: 0.8 },

  // ── Near Khemnichak (WIP) ──
  { id: "khemnichak_market", name: "Khemnichak Market", category: "shopping", coordinates: [25.584, 85.160], nearestStationId: "khemnichak", distanceKm: 0.2 },

  // ── Near Malahi Pakri (WIP) ──
  { id: "kankarbagh_colony", name: "Kankarbagh Colony", category: "civic", coordinates: [25.596, 85.162], nearestStationId: "malahi_pakri", distanceKm: 0.5 },
  { id: "malahi_pakri_roundabout", name: "Malahi Pakri Roundabout", category: "civic", coordinates: [25.5938, 85.1578], nearestStationId: "malahi_pakri", distanceKm: 0.05 },

  // ── Near Rajendra Nagar (WIP) ──
  { id: "rajendra_nagar_terminal", name: "Rajendra Nagar Railway Terminal", category: "transport", coordinates: [25.6031, 85.1622], nearestStationId: "rajendra_nagar", distanceKm: 0.2 },
  { id: "rajendra_nagar_market", name: "Rajendra Nagar Main Market", category: "shopping", coordinates: [25.602, 85.166], nearestStationId: "rajendra_nagar", distanceKm: 0.4 },

  // ── Near Moin-ul-Haq Stadium (WIP) ──
  { id: "moin_ul_haq_stadium", name: "Moin-ul-Haq Stadium", category: "park", coordinates: [25.608, 85.168], nearestStationId: "moin_ul_haq", distanceKm: 0.1 },
  { id: "srikrishna_science_center", name: "Srikrishna Science Centre", category: "heritage", coordinates: [25.610, 85.170], nearestStationId: "moin_ul_haq", distanceKm: 0.3 },

  // ── Near University (WIP) ──
  { id: "patna_university", name: "Patna University", category: "education", coordinates: [25.617, 85.155], nearestStationId: "university", distanceKm: 0.1 },
  { id: "patna_museum", name: "Patna Museum", category: "heritage", coordinates: [25.613, 85.153], nearestStationId: "university", distanceKm: 0.5 },
  { id: "bihar_museum", name: "Bihar Museum", category: "heritage", coordinates: [25.615, 85.158], nearestStationId: "university", distanceKm: 0.3 },

  // ── Near PMCH (WIP) ──
  { id: "pmch_hospital", name: "Patna Medical College & Hospital", category: "hospital", coordinates: [25.619, 85.151], nearestStationId: "pmch", distanceKm: 0.05 },
  { id: "nalanda_medical", name: "Nalanda Medical College (NMCH)", category: "hospital", coordinates: [25.618, 85.146], nearestStationId: "pmch", distanceKm: 0.5 },

  // ── Near Gandhi Maidan (WIP) ──
  { id: "gandhi_maidan_ground", name: "Gandhi Maidan", category: "park", coordinates: [25.620, 85.145], nearestStationId: "gandhi_maidan", distanceKm: 0.05 },
  { id: "golghar", name: "Golghar (Granary)", category: "heritage", coordinates: [25.6199, 85.1385], nearestStationId: "gandhi_maidan", distanceKm: 0.5 },
  { id: "patna_sahib_gurudwara", name: "Patna Sahib Gurudwara (Takht)", category: "religious", coordinates: [25.604, 85.188], nearestStationId: "gandhi_maidan", distanceKm: 4.5 },

  // ── Near Akashvani (WIP) ──
  { id: "all_india_radio", name: "All India Radio Patna", category: "civic", coordinates: [25.610, 85.140], nearestStationId: "akashvani", distanceKm: 0.05 },
  { id: "sanjay_gandhi_botanical", name: "Sanjay Gandhi Botanical Garden", category: "park", coordinates: [25.614, 85.120], nearestStationId: "akashvani", distanceKm: 1.5 },

  // ── Near Patna Junction (WIP) ──
  { id: "patna_junction_station", name: "Patna Junction Railway Station", category: "transport", coordinates: [25.6028, 85.1375], nearestStationId: "patna_junction", distanceKm: 0.05 },
  { id: "mahavir_mandir", name: "Mahavir Mandir Temple", category: "religious", coordinates: [25.6034, 85.1385], nearestStationId: "patna_junction", distanceKm: 0.1 },
  { id: "patna_city_market", name: "Patna City Market (Harding Road)", category: "shopping", coordinates: [25.607, 85.137], nearestStationId: "patna_junction", distanceKm: 0.5 },

  // ── Near Red Line stations (all WIP) ──
  { id: "eco_park", name: "Eco Park", category: "park", coordinates: [25.615, 85.065], nearestStationId: "saguna_mor", distanceKm: 0.5 },
  { id: "danapur_cantonment_area", name: "Danapur Cantonment Area", category: "civic", coordinates: [25.617, 85.042], nearestStationId: "danapur_cantonment", distanceKm: 0.2 },
  { id: "patna_zoo", name: "Sanjay Gandhi Jaivik Udyan (Zoo)", category: "park", coordinates: [25.612, 85.119], nearestStationId: "patna_zoo", distanceKm: 0.15 },
  { id: "bailey_road_shops", name: "Bailey Road Shopping Area", category: "shopping", coordinates: [25.608, 85.088], nearestStationId: "patliputra_red", distanceKm: 0.3 },
  { id: "jp_ganga_path", name: "JP Ganga Path (Riverfront)", category: "park", coordinates: [25.622, 85.137], nearestStationId: "gandhi_maidan", distanceKm: 0.3 },
];
