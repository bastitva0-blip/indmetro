import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── Aluva ──
  { id: "aluva_railway", name: "Aluva Railway Station", category: "transport", coordinates: [10.1082, 76.3514], nearestStationId: "aluva", distanceKm: 0.3 },
  { id: "aluva_maidan", name: "Aluva Maidan (Sivarathri)", category: "park", coordinates: [10.1103, 76.3492], nearestStationId: "aluva", distanceKm: 0.1 },
  { id: "airport_shuttle", name: "Airport Feeder Shuttle Stop (₹50)", category: "transport", coordinates: [10.1098, 76.3496], nearestStationId: "aluva", distanceKm: 0.05 },

  // ── Kalamassery ──
  { id: "kalamassery_railway", name: "Kalamassery Railway Station", category: "transport", coordinates: [10.0582, 76.3213], nearestStationId: "kalamassery", distanceKm: 0.2 },
  { id: "ksrtc_kalamassery", name: "KSRTC Bus Depot Kalamassery", category: "transport", coordinates: [10.059, 76.322], nearestStationId: "kalamassery", distanceKm: 0.3 },

  // ── Cochin University ──
  { id: "cusat", name: "Cochin University of Science & Technology (CUSAT)", category: "education", coordinates: [10.0452, 76.3200], nearestStationId: "cochin_university", distanceKm: 0.2 },
  { id: "cusat_lake", name: "CUSAT Lake Campus", category: "park", coordinates: [10.0450, 76.318], nearestStationId: "cochin_university", distanceKm: 0.3 },

  // ── Edapally ──
  { id: "lulu_mall", name: "LuLu Mall Kochi (Largest in India)", category: "shopping", coordinates: [10.0275, 76.3050], nearestStationId: "edapally", distanceKm: 0.3 },
  { id: "edapally_junction", name: "Edapally Junction", category: "transport", coordinates: [10.0267, 76.3093], nearestStationId: "edapally", distanceKm: 0.05 },
  { id: "oberon_mall", name: "Oberon Mall", category: "shopping", coordinates: [10.025, 76.310], nearestStationId: "edapally", distanceKm: 0.5 },

  // ── Palarivattom ──
  { id: "palarivattom_junction", name: "Palarivattom Junction", category: "transport", coordinates: [10.009, 76.304], nearestStationId: "palarivattom", distanceKm: 0.1 },
  { id: "santhigiri_ashram", name: "Santhigiri Ashram", category: "religious", coordinates: [10.012, 76.308], nearestStationId: "palarivattom", distanceKm: 0.4 },

  // ── JLN Stadium ──
  { id: "jln_stadium_ground", name: "Jawaharlal Nehru Stadium", category: "park", coordinates: [9.9997, 76.2994], nearestStationId: "jln_stadium", distanceKm: 0.1 },
  { id: "infopark_feeder", name: "Infopark Feeder Bus Stop (KMRL)", category: "transport", coordinates: [10.0005, 76.299], nearestStationId: "jln_stadium", distanceKm: 0.05 },
  { id: "kmrl_hq", name: "KMRL Headquarters", category: "civic", coordinates: [10.0004, 76.2992], nearestStationId: "jln_stadium", distanceKm: 0.05 },

  // ── Kaloor ──
  { id: "kaloor_bus_stand", name: "Kaloor Bus Stand (Private)", category: "transport", coordinates: [9.9948, 76.2914], nearestStationId: "kaloor", distanceKm: 0.1 },
  { id: "sapphire_mall", name: "Sapphire Mall Kaloor", category: "shopping", coordinates: [9.9940, 76.292], nearestStationId: "kaloor", distanceKm: 0.2 },

  // ── Town Hall ──
  { id: "ernakulam_town_railway", name: "Ernakulam Town Railway Station", category: "transport", coordinates: [9.9911, 76.2872], nearestStationId: "town_hall", distanceKm: 0.1 },
  { id: "durbar_hall_ground", name: "Durbar Hall Ground", category: "park", coordinates: [9.9915, 76.285], nearestStationId: "town_hall", distanceKm: 0.2 },

  // ── MG Road ──
  { id: "mg_road_shopping", name: "MG Road Shopping Area", category: "shopping", coordinates: [9.9841, 76.2821], nearestStationId: "mg_road", distanceKm: 0.05 },
  { id: "jos_junction", name: "Jos Junction", category: "shopping", coordinates: [9.9837, 76.284], nearestStationId: "mg_road", distanceKm: 0.2 },
  { id: "high_court_of_kerala", name: "High Court of Kerala", category: "civic", coordinates: [9.9810, 76.277], nearestStationId: "mg_road", distanceKm: 0.6 },

  // ── Maharaja's College ──
  { id: "maharajas_college_bldg", name: "Maharaja's College (Govt Arts)", category: "education", coordinates: [9.9726, 76.2852], nearestStationId: "maharajas_college", distanceKm: 0.1 },
  { id: "ernakulam_jetty", name: "Ernakulam Boat Jetty (Water Metro / Ferries)", category: "transport", coordinates: [9.9685, 76.274], nearestStationId: "maharajas_college", distanceKm: 0.9 },

  // ── Ernakulam South ──
  { id: "ernakulam_junction_railway", name: "Ernakulam Junction Railway Station", category: "transport", coordinates: [9.9673, 76.2896], nearestStationId: "ernakulam_south", distanceKm: 0.15 },
  { id: "busstand_ernakulam", name: "KSRTC Bus Stand Ernakulam", category: "transport", coordinates: [9.9665, 76.2902], nearestStationId: "ernakulam_south", distanceKm: 0.2 },

  // ── Kadavanthra ──
  { id: "marine_drive", name: "Marine Drive (Ernakulam Lakefront)", category: "park", coordinates: [9.9683, 76.281], nearestStationId: "kadavanthra", distanceKm: 0.8 },
  { id: "kadavanthra_market", name: "Kadavanthra Market", category: "shopping", coordinates: [9.9661, 76.298], nearestStationId: "kadavanthra", distanceKm: 0.1 },

  // ── Vyttila ──
  { id: "vyttila_hub", name: "Vyttila Mobility Hub (Bus + Water Metro)", category: "transport", coordinates: [9.9669, 76.3209], nearestStationId: "vyttila", distanceKm: 0.1 },
  { id: "vyttila_water_metro", name: "Vyttila Water Metro Jetty", category: "transport", coordinates: [9.969, 76.321], nearestStationId: "vyttila", distanceKm: 0.2 },

  // ── Thaikoodam ──
  { id: "aster_medcity", name: "Aster MedCity Hospital", category: "hospital", coordinates: [9.960, 76.327], nearestStationId: "thaikoodam", distanceKm: 0.4 },

  // ── Pettah ──
  { id: "pettah_market", name: "Pettah Market", category: "shopping", coordinates: [9.951, 76.331], nearestStationId: "pettah", distanceKm: 0.05 },
  { id: "kumbalangi_backwaters", name: "Kumbalangi Integrated Tourism Village", category: "park", coordinates: [9.919, 76.317], nearestStationId: "pettah", distanceKm: 3.5 },

  // ── SN Junction ──
  { id: "sn_junction_market", name: "SN Junction Market Area", category: "shopping", coordinates: [9.936, 76.341], nearestStationId: "sn_junction", distanceKm: 0.05 },

  // ── Thrippunithura Terminal ──
  { id: "tripunithura_railway", name: "Tripunithura Railway Station", category: "transport", coordinates: [9.9280, 76.3480], nearestStationId: "thrippunithura_terminal", distanceKm: 0.15 },
  { id: "hill_palace_museum", name: "Hill Palace Museum (Tripunithura)", category: "heritage", coordinates: [9.9345, 76.3380], nearestStationId: "thrippunithura_terminal", distanceKm: 0.8 },
  { id: "poornathrayeesa_temple", name: "Poornathrayeesa Temple", category: "religious", coordinates: [9.931, 76.347], nearestStationId: "thrippunithura_terminal", distanceKm: 0.2 },

  // ── Changampuzha Park ──
  { id: "changampuzha_park_garden", name: "Changampuzha Park (Public Garden)", category: "park", coordinates: [10.0152, 76.3023], nearestStationId: "changampuzha_park", distanceKm: 0.05 },

  // ── Elamkulam ──
  { id: "elante_mall", name: "Centre Square Mall", category: "shopping", coordinates: [9.967, 76.308], nearestStationId: "elamkulam", distanceKm: 0.2 },
];
