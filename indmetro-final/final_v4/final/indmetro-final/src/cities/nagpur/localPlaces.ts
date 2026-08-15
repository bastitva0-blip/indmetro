import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── Automotive Square (N terminal) ──
  { id: "automotive_sq_area",    name: "Automotive Square Area",                  category: "transport",  coordinates: [21.18573, 79.11968], nearestStationId: "automotive_square",  distanceKm: 0.05 },
  { id: "midc_butibori",         name: "MIDC Butibori Industrial Area",           category: "civic",      coordinates: [21.130,  79.060],   nearestStationId: "automotive_square",  distanceKm: 8.0  },

  // ── Indora / Nari Road ──
  { id: "nari_road_market",      name: "Nari Road Market",                        category: "shopping",   coordinates: [21.179,  79.110],   nearestStationId: "nari_road",          distanceKm: 0.1  },
  { id: "indora_chowk",          name: "Indora Chowk",                            category: "transport",  coordinates: [21.173,  79.100],   nearestStationId: "indora_square",      distanceKm: 0.05 },

  // ── Kasturchand Park ──
  { id: "kasturchand_park_garden","name":"Kasturchand Park (Public Garden)",      category: "park",       coordinates: [21.155,  79.082],   nearestStationId: "kasturchand_park",   distanceKm: 0.05 },
  { id: "central_nagpur_area",   name: "Central Nagpur Commercial Area",          category: "shopping",   coordinates: [21.153,  79.080],   nearestStationId: "kasturchand_park",   distanceKm: 0.3  },

  // ── Sitabuldi (Interchange) ──
  { id: "sitabuldi_fort",        name: "Sitabuldi Fort",                          category: "heritage",   coordinates: [21.142,  79.083],   nearestStationId: "sitabuldi",          distanceKm: 0.05 },
  { id: "nagpur_bus_stand",      name: "Nagpur Central Bus Stand (MSRTC)",        category: "transport",  coordinates: [21.140,  79.085],   nearestStationId: "sitabuldi",          distanceKm: 0.3  },
  { id: "empress_mall",          name: "Empress Mall, Nagpur",                    category: "shopping",   coordinates: [21.144,  79.076],   nearestStationId: "sitabuldi",          distanceKm: 0.6  },
  { id: "nagpur_zero_mile",      name: "Zero Mile Stone (Geographic Centre)",     category: "heritage",   coordinates: [21.153,  79.085],   nearestStationId: "sitabuldi",          distanceKm: 1.0  },

  // ── Congress Nagar / Ajni ──
  { id: "ajni_market",           name: "Ajni Square Market",                      category: "shopping",   coordinates: [21.120,  79.074],   nearestStationId: "ajni_square",        distanceKm: 0.05 },
  { id: "vidhan_bhavan",         name: "Vidhan Bhavan (Maharashtra Legislature)", category: "civic",      coordinates: [21.136,  79.075],   nearestStationId: "congress_nagar",     distanceKm: 0.5  },

  // ── Airport ──
  { id: "dr_ambedkar_airport",   name: "Dr. Babasaheb Ambedkar International Airport", category: "transport", coordinates: [21.0922, 79.0472], nearestStationId: "airport_nagpur", distanceKm: 0.4  },
  { id: "mihan_sez",             name: "MIHAN SEZ (Multi-modal Int'l Hub)",       category: "civic",      coordinates: [21.060,  79.052],   nearestStationId: "mihan",              distanceKm: 0.1  },

  // ── Khapri (S terminal) ──
  { id: "khapri_village",        name: "Khapri Village",                          category: "civic",      coordinates: [21.026,  79.030],   nearestStationId: "khapri",             distanceKm: 0.1  },

  // ── Nagpur Railway Station (Aqua) ──
  { id: "nagpur_rly_station",    name: "Nagpur Railway Station (Junction)",       category: "transport",  coordinates: [21.145,  79.089],   nearestStationId: "rly_station_ngp",    distanceKm: 0.1  },
  { id: "imax_nagpur",           name: "IMAX Theatre, Nagpur",                    category: "civic",      coordinates: [21.146,  79.091],   nearestStationId: "rly_station_ngp",    distanceKm: 0.3  },

  // ── Zero Mile (Aqua) ──
  { id: "zero_mile_stone",       name: "Zero Mile Stone Monument",                category: "heritage",   coordinates: [21.138,  79.035],   nearestStationId: "zero_mile_ngp",      distanceKm: 0.1  },
  { id: "seminary_hills",        name: "Seminary Hills Nature Reserve",           category: "park",       coordinates: [21.156,  79.061],   nearestStationId: "zero_mile_ngp",      distanceKm: 2.8  },

  // ── Gandhibagh ──
  { id: "gandhibagh_market",     name: "Gandhibagh Market (Textiles)",            category: "shopping",   coordinates: [21.148,  79.108],   nearestStationId: "gandhibagh",         distanceKm: 0.05 },
  { id: "mahal_market",          name: "Mahal Market (Old Nagpur)",               category: "shopping",   coordinates: [21.149,  79.103],   nearestStationId: "gandhibagh",         distanceKm: 0.5  },

  // ── Agrasen Square ──
  { id: "agrasen_sq_area",       name: "Agrasen Square Junction",                 category: "transport",  coordinates: [21.155,  79.115],   nearestStationId: "agrasen_square",     distanceKm: 0.05 },
  { id: "mata_mandir",           name: "Mata Mandir Temple",                      category: "religious",  coordinates: [21.156,  79.118],   nearestStationId: "agrasen_square",     distanceKm: 0.3  },

  // ── Ambedkar Square ──
  { id: "ambedkar_sq_area",      name: "Ambedkar Square",                         category: "civic",      coordinates: [21.160,  79.125],   nearestStationId: "ambedkar_square",    distanceKm: 0.05 },
  { id: "trimurti_nagar",        name: "Trimurti Nagar Market",                   category: "shopping",   coordinates: [21.162,  79.128],   nearestStationId: "ambedkar_square",    distanceKm: 0.4  },

  // ── Laxmi Nagar ──
  { id: "laxmi_nagar_mkt",       name: "Laxmi Nagar Market",                      category: "shopping",   coordinates: [21.158,  79.138],   nearestStationId: "laxmi_nagar",        distanceKm: 0.05 },
  { id: "nagpur_golf_club",      name: "Nagpur Golf Club",                        category: "park",       coordinates: [21.163,  79.140],   nearestStationId: "laxmi_nagar",        distanceKm: 0.6  },

  // ── Shankar Nagar ──
  { id: "shankar_nagar_sq",      name: "Shankar Nagar Square",                    category: "transport",  coordinates: [21.155,  79.150],   nearestStationId: "shankar_nagar",      distanceKm: 0.05 },
  { id: "nagpur_hc",             name: "Nagpur High Court (Bombay HC Bench)",     category: "civic",      coordinates: [21.153,  79.148],   nearestStationId: "shankar_nagar",      distanceKm: 0.3  },

  // ── Dharampeth ──
  { id: "dharampeth_market",     name: "Dharampeth Market",                       category: "shopping",   coordinates: [21.152,  79.162],   nearestStationId: "dharampeth",         distanceKm: 0.05 },
  { id: "sadar_bazar",           name: "Sadar Bazar, Nagpur",                     category: "shopping",   coordinates: [21.150,  79.155],   nearestStationId: "dharampeth",         distanceKm: 0.5  },

  // ── Chhatrapati Square ──
  { id: "chhatrapati_sq_area",   name: "Chhatrapati Square",                      category: "transport",  coordinates: [21.149,  79.175],   nearestStationId: "chhatrapati_square", distanceKm: 0.05 },

  // ── Variety Square ──
  { id: "variety_sq_area",       name: "Variety Square",                          category: "transport",  coordinates: [21.146,  79.188],   nearestStationId: "variety_square",     distanceKm: 0.05 },
  { id: "manish_nagar",          name: "Manish Nagar",                            category: "civic",      coordinates: [21.145,  79.190],   nearestStationId: "variety_square",     distanceKm: 0.2  },

  // ── Wadi / Hingna Mount View (E terminal) ──
  { id: "wadi_railway",          name: "Wadi Railway Station",                    category: "transport",  coordinates: [21.135,  79.240],   nearestStationId: "wadi",               distanceKm: 0.1  },
  { id: "hingna_industrial",     name: "Hingna Industrial Area (MIDC)",           category: "civic",      coordinates: [21.128,  79.258],   nearestStationId: "hingna_mount_view",  distanceKm: 0.5  },

  // ── General Nagpur ──
  { id: "deekshabhoomi",         name: "Deekshabhoomi (Ambedkar Memorial)",       category: "heritage",   coordinates: [21.133,  79.066],   nearestStationId: "congress_nagar",     distanceKm: 0.8  },
  { id: "nagpur_zoo",            name: "Maharaj Bagh Zoo",                        category: "park",       coordinates: [21.150,  79.090],   nearestStationId: "sitabuldi",          distanceKm: 0.7  },
  { id: "futala_lake",           name: "Futala Lake",                             category: "park",       coordinates: [21.152,  79.050],   nearestStationId: "zero_mile_ngp",      distanceKm: 2.5  },
  { id: "ambazari_lake",         name: "Ambazari Lake & Garden",                  category: "park",       coordinates: [21.136,  79.047],   nearestStationId: "prajapati_nagar",    distanceKm: 3.5  },
  { id: "wardha_road_malls",     name: "Wardha Road Shopping (Big Bazaar area)",  category: "shopping",   coordinates: [21.100,  79.068],   nearestStationId: "rahate_colony",      distanceKm: 1.0  },
];
