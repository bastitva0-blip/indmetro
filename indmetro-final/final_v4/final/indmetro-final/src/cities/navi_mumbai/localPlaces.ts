import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── CBD Belapur ──
  { id: "cbd_belapur_railway",   name: "CBD Belapur Railway Station (Harbour Line)", category: "transport",  coordinates: [19.0168, 73.0347], nearestStationId: "cbd_belapur",          distanceKm: 0.1  },
  { id: "belapur_bus_depot",     name: "Belapur NMMT Bus Depot",                    category: "transport",  coordinates: [19.0178, 73.034],  nearestStationId: "cbd_belapur",          distanceKm: 0.15 },
  { id: "navi_mumbai_court",     name: "Navi Mumbai District Court",                category: "civic",      coordinates: [19.018,  73.035],  nearestStationId: "cbd_belapur",          distanceKm: 0.2  },
  { id: "apmc_market",           name: "APMC Wholesale Market (Turbhe)",            category: "shopping",   coordinates: [19.064,  73.021],  nearestStationId: "cbd_belapur",          distanceKm: 5.2  },
  { id: "navi_mumbai_municipal", name: "NMMC Head Office",                          category: "civic",      coordinates: [19.019,  73.038],  nearestStationId: "cbd_belapur",          distanceKm: 0.3  },
  { id: "seawoods_grand_central","name": "Seawoods Grand Central Mall",             category: "shopping",   coordinates: [19.014,  73.022],  nearestStationId: "cbd_belapur",          distanceKm: 1.5  },

  // ── RBI Colony ──
  { id: "rbi_colony_area",       name: "RBI Officers' Colony",                      category: "civic",      coordinates: [19.0223, 73.042],  nearestStationId: "rbi_colony",           distanceKm: 0.05 },
  { id: "sector_11_belapur",     name: "Sector 11 Market, Belapur",                 category: "shopping",   coordinates: [19.023,  73.044],  nearestStationId: "rbi_colony",           distanceKm: 0.3  },

  // ── Belpada ──
  { id: "belpada_village",       name: "Belpada Village",                           category: "civic",      coordinates: [19.0308, 73.051],  nearestStationId: "belpada",              distanceKm: 0.05 },
  { id: "cidco_sector_27",       name: "CIDCO Sector 27, Belapur",                  category: "civic",      coordinates: [19.028,  73.049],  nearestStationId: "belpada",              distanceKm: 0.4  },

  // ── Utsav Chowk ──
  { id: "utsav_chowk_area",      name: "Utsav Chowk Junction",                      category: "transport",  coordinates: [19.0408, 73.0578], nearestStationId: "utsav_chowk",          distanceKm: 0.05 },
  { id: "sector_20_kharghar",    name: "Sector 20, Kharghar",                       category: "civic",      coordinates: [19.038,  73.056],  nearestStationId: "utsav_chowk",          distanceKm: 0.4  },
  { id: "kharghar_knowledge_city","name":"Kharghar Knowledge City",                 category: "education",  coordinates: [19.044,  73.058],  nearestStationId: "utsav_chowk",          distanceKm: 0.5  },

  // ── Kendriya Vihar ──
  { id: "kendriya_vihar_complex","name": "Kendriya Vihar Housing Complex",          category: "civic",      coordinates: [19.0468, 73.0622], nearestStationId: "kendriya_vihar",        distanceKm: 0.05 },
  { id: "isavi_college",         name: "ISAVI College, Kharghar",                   category: "education",  coordinates: [19.045,  73.063],  nearestStationId: "kendriya_vihar",        distanceKm: 0.2  },

  // ── Kharghar Village ──
  { id: "kharghar_hills",        name: "Kharghar Hills (Trekking)",                 category: "park",       coordinates: [19.057,  73.062],  nearestStationId: "kharghar_village",      distanceKm: 0.6  },
  { id: "kharghar_valley_golf",  name: "Kharghar Valley Golf Course",               category: "park",       coordinates: [19.055,  73.058],  nearestStationId: "kharghar_village",      distanceKm: 0.7  },
  { id: "kharghar_sector_12",    name: "Sector 12 Market, Kharghar",                category: "shopping",   coordinates: [19.051,  73.069],  nearestStationId: "kharghar_village",      distanceKm: 0.3  },

  // ── Central Park ──
  { id: "central_park_navi",     name: "Central Park Kharghar (Largest in Asia)",   category: "park",       coordinates: [19.062,  73.073],  nearestStationId: "central_park_kharghar", distanceKm: 0.1  },
  { id: "kharghar_waterfall",    name: "Kharghar Waterfall (monsoon)",              category: "park",       coordinates: [19.058,  73.071],  nearestStationId: "central_park_kharghar", distanceKm: 0.7  },
  { id: "kbcnmu_campus",         name: "Dr. Babasaheb Ambedkar Int'l Airport",      category: "transport",  coordinates: [18.975,  72.869],  nearestStationId: "central_park_kharghar", distanceKm: 18   },
  { id: "pillai_college",        name: "Pillai College of Engineering, Kharghar",   category: "education",  coordinates: [19.064,  73.076],  nearestStationId: "central_park_kharghar", distanceKm: 0.4  },

  // ── Pethpada ──
  { id: "pethpada_village_area", name: "Pethpada Village",                          category: "civic",      coordinates: [19.0718, 73.081],  nearestStationId: "pethpada",              distanceKm: 0.05 },
  { id: "kharghar_sector_35",    name: "Sector 35 Market, Kharghar",                category: "shopping",   coordinates: [19.073,  73.082],  nearestStationId: "pethpada",              distanceKm: 0.3  },

  // ── Amandoot ──
  { id: "amandoot_colony",       name: "Amandoot Colony",                           category: "civic",      coordinates: [19.0818, 73.088],  nearestStationId: "amandoot",              distanceKm: 0.05 },
  { id: "taloja_industrial",     name: "Taloja Industrial Area (MIDC)",             category: "civic",      coordinates: [19.085,  73.093],  nearestStationId: "amandoot",              distanceKm: 0.5  },
  { id: "cidco_hospital_taloja", name: "CIDCO Hospital, Taloja",                    category: "hospital",   coordinates: [19.088,  73.090],  nearestStationId: "amandoot",              distanceKm: 0.7  },

  // ── Pethali - Taloja ──
  { id: "taloja_phase1",         name: "Taloja Phase I Residential",                category: "civic",      coordinates: [19.0938, 73.096],  nearestStationId: "pethali_taloja",        distanceKm: 0.05 },
  { id: "pethali_village",       name: "Pethali Village",                           category: "civic",      coordinates: [19.092,  73.097],  nearestStationId: "pethali_taloja",        distanceKm: 0.2  },
  { id: "taloja_jail_road",      name: "Taloja Market Area",                        category: "shopping",   coordinates: [19.095,  73.098],  nearestStationId: "pethali_taloja",        distanceKm: 0.3  },

  // ── Pendhar ──
  { id: "pendhar_colony",        name: "Pendhar Colony (CIDCO)",                    category: "civic",      coordinates: [19.1018, 73.102],  nearestStationId: "pendhar",              distanceKm: 0.05 },
  { id: "pendhar_market",        name: "Pendhar Local Market",                      category: "shopping",   coordinates: [19.103,  73.103],  nearestStationId: "pendhar",              distanceKm: 0.2  },
  { id: "navi_mumbai_intl_airport","name":"Navi Mumbai International Airport (UC)", category: "transport",  coordinates: [18.986,  73.059],  nearestStationId: "pendhar",              distanceKm: 13   },

  // ── General Navi Mumbai POIs ──
  { id: "dy_patil_stadium",      name: "DY Patil Stadium",                          category: "park",       coordinates: [19.044,  73.017],  nearestStationId: "cbd_belapur",          distanceKm: 2.5  },
  { id: "wonder_park_kharghar",  name: "Wonder Park Kharghar",                      category: "park",       coordinates: [19.059,  73.067],  nearestStationId: "kharghar_village",      distanceKm: 0.5  },
];
