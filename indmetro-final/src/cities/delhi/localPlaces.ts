import type { LocalPlace } from "@/types/city";
export const localPlaces: LocalPlace[] = [
  // ── Old Delhi ──────────────────────────────────────────────────────────────
  { id: "red_fort",           name: "Red Fort (Lal Qila)",            category: "heritage",     coordinates: [28.6562, 77.2410], nearestStationId: "lal_quila",            distanceKm: 0.1 },
  { id: "jama_masjid_mosque", name: "Jama Masjid",                    category: "religious",    coordinates: [28.6507, 77.2334], nearestStationId: "jama_masjid",          distanceKm: 0.2 },
  { id: "chandni_chowk_mkt",  name: "Chandni Chowk Market",          category: "shopping",     coordinates: [28.6568, 77.2311], nearestStationId: "chandni_chowk",        distanceKm: 0.1 },
  { id: "spice_market",       name: "Khari Baoli Spice Market",       category: "shopping",     coordinates: [28.6558, 77.2218], nearestStationId: "chandni_chowk",        distanceKm: 0.8 },

  // ── Central Delhi ──────────────────────────────────────────────────────────
  { id: "india_gate",         name: "India Gate",                     category: "heritage",     coordinates: [28.6129, 77.2295], nearestStationId: "central_secretariat",  distanceKm: 1.5 },
  { id: "rashtrapati_bhavan", name: "Rashtrapati Bhavan",             category: "heritage",     coordinates: [28.6144, 77.1993], nearestStationId: "central_secretariat",  distanceKm: 1.8 },
  { id: "parliament_house",   name: "Parliament House (Sansad Bhavan)",category: "civic",       coordinates: [28.6172, 77.2085], nearestStationId: "central_secretariat",  distanceKm: 1.2 },
  { id: "connaught_place",    name: "Connaught Place (CP)",           category: "shopping",     coordinates: [28.6328, 77.2197], nearestStationId: "rajiv_chowk",          distanceKm: 0.05 },
  { id: "national_museum",    name: "National Museum",                category: "heritage",     coordinates: [28.6118, 77.2198], nearestStationId: "central_secretariat",  distanceKm: 0.8 },

  // ── South Delhi ────────────────────────────────────────────────────────────
  { id: "qutub_minar_mon",    name: "Qutub Minar (UNESCO)",           category: "heritage",     coordinates: [28.5244, 77.1855], nearestStationId: "qutab_minar",          distanceKm: 0.5 },
  { id: "hauz_khas_village",  name: "Hauz Khas Village (Cafés & Ruins)",category: "entertainment",coordinates: [28.5495, 77.1988], nearestStationId: "hauz_khas",         distanceKm: 0.8 },
  { id: "lotus_temple",       name: "Lotus Temple (Bahá'í House)",    category: "religious",    coordinates: [28.5535, 77.2588], nearestStationId: "kalkaji_mandir",       distanceKm: 1.0 },
  { id: "iskcon_delhi",       name: "ISKCON Temple Delhi",            category: "religious",    coordinates: [28.6272, 77.2178], nearestStationId: "rajiv_chowk",          distanceKm: 3.5 },
  { id: "lajpat_nagar_mkt",   name: "Lajpat Nagar Central Market",   category: "shopping",     coordinates: [28.5698, 77.2418], nearestStationId: "lajpat_nagar",         distanceKm: 0.1 },
  { id: "select_city_walk",   name: "Select City Walk Mall (Saket)",  category: "shopping",     coordinates: [28.5228, 77.2108], nearestStationId: "saket",               distanceKm: 0.2 },

  // ── North Delhi ────────────────────────────────────────────────────────────
  { id: "delhi_university",   name: "Delhi University (North Campus)", category: "education",   coordinates: [28.6986, 77.2088], nearestStationId: "vishwavidyalaya",      distanceKm: 0.2 },
  { id: "st_stephens",        name: "St. Stephen's College",          category: "education",    coordinates: [28.6988, 77.2088], nearestStationId: "vishwavidyalaya",      distanceKm: 0.3 },
  { id: "delhi_haat_ina",     name: "Delhi Haat (INA)",               category: "shopping",     coordinates: [28.5698, 77.2098], nearestStationId: "ina",                 distanceKm: 0.1 },
  { id: "aiims_hospital",     name: "AIIMS Hospital",                  category: "hospital",     coordinates: [28.5668, 77.2118], nearestStationId: "aiims_yellow",         distanceKm: 0.05 },

  // ── Airport ────────────────────────────────────────────────────────────────
  { id: "igi_airport_t3",     name: "IGI Airport Terminal 3",         category: "transport",    coordinates: [28.5568, 77.0938], nearestStationId: "igi_t3",              distanceKm: 0.1 },
  { id: "igi_airport_t1",     name: "IGI Airport Terminal 1",         category: "transport",    coordinates: [28.5668, 77.1018], nearestStationId: "terminal_1_igi",       distanceKm: 0.1 },

  // ── Railway Stations ───────────────────────────────────────────────────────
  { id: "new_delhi_rly",      name: "New Delhi Railway Station",       category: "transport",    coordinates: [28.6431, 77.2191], nearestStationId: "new_delhi",            distanceKm: 0.5 },
  { id: "old_delhi_rly",      name: "Old Delhi Railway Station (DLI)", category: "transport",    coordinates: [28.6608, 77.2297], nearestStationId: "chandni_chowk",        distanceKm: 1.2 },
  { id: "hazrat_nizamuddin",  name: "Hazrat Nizamuddin Railway Station",category: "transport",   coordinates: [28.5906, 77.2531], nearestStationId: "mandi_house",          distanceKm: 4.5 },

  // ── East Delhi / Noida ─────────────────────────────────────────────────────
  { id: "akshardham_temple",  name: "Akshardham Temple",              category: "religious",    coordinates: [28.6127, 77.2773], nearestStationId: "akshardham",           distanceKm: 0.5 },
  { id: "noida_film_city",    name: "Noida Film City",                category: "entertainment",coordinates: [28.5748, 77.3678], nearestStationId: "noida_sec_34",         distanceKm: 0.8 },

  // ── Gurgaon ────────────────────────────────────────────────────────────────
  { id: "ambience_mall",      name: "Ambience Mall Gurgaon",          category: "shopping",     coordinates: [28.4808, 77.0932], nearestStationId: "sikanderpur",          distanceKm: 0.5 },
  { id: "cyber_hub_gurgaon",  name: "Cyber Hub DLF Gurgaon",          category: "entertainment",coordinates: [28.4948, 77.0888], nearestStationId: "sikanderpur",          distanceKm: 1.5 },

  // ── West Delhi ─────────────────────────────────────────────────────────────
  { id: "dwarka_sector_10_park","name":"Dwarka Sector 10 Local Park",  category: "park",         coordinates: [28.5848, 77.0918], nearestStationId: "dwarka_sec_10",        distanceKm: 0.3 },
  { id: "najafgarh_lake",     name: "Najafgarh Lake (Ramsar Wetland)", category: "park",         coordinates: [28.6068, 77.0148], nearestStationId: "najafgarh",           distanceKm: 0.2 },

  // ── Museums & Culture ──────────────────────────────────────────────────────
  { id: "national_gallery",   name: "National Gallery of Modern Art",  category: "heritage",    coordinates: [28.6128, 77.2288], nearestStationId: "central_secretariat",  distanceKm: 0.8 },
  { id: "craft_museum",       name: "National Crafts Museum",          category: "heritage",     coordinates: [28.6198, 77.2448], nearestStationId: "indraprastha",         distanceKm: 1.2 },
  { id: "humayuns_tomb",      name: "Humayun's Tomb (UNESCO)",         category: "heritage",     coordinates: [28.5933, 77.2507], nearestStationId: "jlnt_stadium_nearby",  distanceKm: 1.5 },
  { id: "safdarjung_tomb",    name: "Safdarjung's Tomb",               category: "heritage",     coordinates: [28.5908, 77.2068], nearestStationId: "ina",                 distanceKm: 1.8 },
  { id: "lodhi_garden",       name: "Lodhi Garden",                   category: "park",         coordinates: [28.5930, 77.2197], nearestStationId: "jor_bagh",             distanceKm: 0.5 },
  { id: "nehru_planetarium",  name: "Nehru Planetarium",              category: "education",    coordinates: [28.6058, 77.1908], nearestStationId: "lok_kalyan_marg",      distanceKm: 0.8 },
  { id: "zoo_delhi",          name: "National Zoological Park",       category: "park",         coordinates: [28.6418, 77.2448], nearestStationId: "supreme_court",        distanceKm: 1.5 },
  { id: "purana_qila",        name: "Purana Qila (Old Fort)",         category: "heritage",     coordinates: [28.6098, 77.2438], nearestStationId: "indraprastha",         distanceKm: 1.5 },
  { id: "garden_of_5_senses", name: "Garden of Five Senses",          category: "park",         coordinates: [28.5068, 77.1988], nearestStationId: "saket",               distanceKm: 2.0 },
];
