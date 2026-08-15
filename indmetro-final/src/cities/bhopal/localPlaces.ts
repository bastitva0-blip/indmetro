/**
 * Bhopal Metro — Local Places & Landmarks
 * 35+ key places mapped to nearest station
 */

export interface LocalPlace {
  id: string;
  name: string;
  category: "heritage" | "shopping" | "park" | "education" | "hospital" | "transport" | "civic" | "religious" | "entertainment" | "sports";
  coordinates: [number, number];
  nearestStationId: string;
  distanceKm: number;
}

export const localPlaces: LocalPlace[] = [
  // ── AIIMS ───────────────────────────────────────────────────────────────
  { id: "aiims_bhopal", name: "AIIMS Bhopal", category: "hospital", coordinates: [23.1932, 77.3991], nearestStationId: "aiims", distanceKm: 0.1 },
  { id: "kanha_fun_city", name: "Kanha Fun City", category: "entertainment", coordinates: [23.1745, 77.3982], nearestStationId: "aiims", distanceKm: 2.2 },
  { id: "bhimbetka", name: "Bhimbetka Rock Shelters (UNESCO)", category: "heritage", coordinates: [22.9390, 77.6122], nearestStationId: "aiims", distanceKm: 46.0 },

  // ── Alkapuri ────────────────────────────────────────────────────────────
  { id: "alkapuri_area", name: "Alkapuri Residential Colony", category: "civic", coordinates: [23.2065, 77.4098], nearestStationId: "alkapuri", distanceKm: 0.2 },
  { id: "habibganj_naka", name: "Habibganj Naka Square", category: "transport", coordinates: [23.2108, 77.4185], nearestStationId: "alkapuri", distanceKm: 0.9 },

  // ── DRM Office ──────────────────────────────────────────────────────────
  { id: "drm_office_bpl", name: "Divisional Railway Manager Office", category: "civic", coordinates: [23.2135, 77.4215], nearestStationId: "drm_office", distanceKm: 0.1 },
  { id: "hoshangabad_road", name: "Hoshangabad Road (commercial)", category: "shopping", coordinates: [23.2125, 77.4240], nearestStationId: "drm_office", distanceKm: 0.4 },

  // ── Rani Kamalapati (RKMP) ──────────────────────────────────────────────
  { id: "rkmp_station", name: "Rani Kamalapati Railway Station (RKMP)", category: "transport", coordinates: [23.2216, 77.4401], nearestStationId: "rani_kamalapati", distanceKm: 0.05 },
  { id: "rkmp_mall", name: "Rani Kamalapati Station Mall", category: "shopping", coordinates: [23.2220, 77.4410], nearestStationId: "rani_kamalapati", distanceKm: 0.1 },
  { id: "arera_colony", name: "Arera Colony (E-3, E-5)", category: "civic", coordinates: [23.2305, 77.4412], nearestStationId: "rani_kamalapati", distanceKm: 1.0 },
  { id: "people_mall", name: "People's Mall", category: "shopping", coordinates: [23.2190, 77.4375], nearestStationId: "rani_kamalapati", distanceKm: 0.5 },

  // ── MP Nagar ────────────────────────────────────────────────────────────
  { id: "mp_nagar_zone1", name: "MP Nagar Zone-1 Market", category: "shopping", coordinates: [23.2355, 77.4348], nearestStationId: "mp_nagar", distanceKm: 0.1 },
  { id: "mp_nagar_zone2", name: "MP Nagar Zone-2 Market", category: "shopping", coordinates: [23.2390, 77.4335], nearestStationId: "mp_nagar", distanceKm: 0.4 },
  { id: "gurudev_gupt_sq", name: "Gurudev Gupt Square", category: "civic", coordinates: [23.2365, 77.4355], nearestStationId: "mp_nagar", distanceKm: 0.2 },

  // ── Board Office Chauraha ────────────────────────────────────────────────
  { id: "db_city_mall", name: "DB City Mall", category: "shopping", coordinates: [23.2460, 77.4340], nearestStationId: "board_office_chauraha", distanceKm: 0.4 },
  { id: "mp_board_office", name: "MP Board of Secondary Education", category: "civic", coordinates: [23.2452, 77.4300], nearestStationId: "board_office_chauraha", distanceKm: 0.1 },
  { id: "new_market_bpl", name: "New Market", category: "shopping", coordinates: [23.2388, 77.4215], nearestStationId: "board_office_chauraha", distanceKm: 1.2 },
  { id: "tribal_museum", name: "Tribal Museum (Rashtriya Adivasi Mahasabha)", category: "heritage", coordinates: [23.2498, 77.4278], nearestStationId: "board_office_chauraha", distanceKm: 0.6 },
  { id: "sair_sapata", name: "Sair Sapata (lakeside recreation)", category: "entertainment", coordinates: [23.2502, 77.4245], nearestStationId: "board_office_chauraha", distanceKm: 0.8 },
  { id: "van_vihar", name: "Van Vihar National Park", category: "park", coordinates: [23.2575, 77.4200], nearestStationId: "board_office_chauraha", distanceKm: 1.5 },

  // ── Kendriya Vidyalaya ───────────────────────────────────────────────────
  { id: "kv_bhopal", name: "Kendriya Vidyalaya (main)", category: "education", coordinates: [23.2572, 77.4258], nearestStationId: "kendriya_vidyalaya", distanceKm: 0.1 },
  { id: "birla_museum", name: "Birla Museum", category: "heritage", coordinates: [23.2605, 77.4220], nearestStationId: "kendriya_vidyalaya", distanceKm: 0.5 },
  { id: "birla_mandir_bpl", name: "Birla Mandir Bhopal", category: "religious", coordinates: [23.2615, 77.4208], nearestStationId: "kendriya_vidyalaya", distanceKm: 0.6 },
  { id: "upper_lake", name: "Upper Lake (Bada Talab)", category: "park", coordinates: [23.2562, 77.4012], nearestStationId: "kendriya_vidyalaya", distanceKm: 2.5 },
  { id: "lower_lake", name: "Lower Lake (Chhota Talab)", category: "park", coordinates: [23.2578, 77.4098], nearestStationId: "kendriya_vidyalaya", distanceKm: 1.5 },

  // ── Subhash Nagar ────────────────────────────────────────────────────────
  { id: "subhash_nagar_depot", name: "MPMRCL Metro Depot", category: "transport", coordinates: [23.2685, 77.4238], nearestStationId: "subhash_nagar", distanceKm: 0.1 },
  { id: "taj_ul_masjid", name: "Taj-ul-Masjid (Asia's largest mosque)", category: "religious", coordinates: [23.2708, 77.4135], nearestStationId: "subhash_nagar", distanceKm: 1.2 },
  { id: "gohar_mahal", name: "Gohar Mahal", category: "heritage", coordinates: [23.2692, 77.4082], nearestStationId: "subhash_nagar", distanceKm: 1.7 },
  { id: "moti_masjid", name: "Moti Masjid", category: "religious", coordinates: [23.2702, 77.4092], nearestStationId: "subhash_nagar", distanceKm: 1.6 },
  { id: "shaukat_mahal", name: "Shaukat Mahal & Sadar Manzil", category: "heritage", coordinates: [23.2698, 77.4085], nearestStationId: "subhash_nagar", distanceKm: 1.8 },
  { id: "jama_masjid_bpl", name: "Jama Masjid Bhopal", category: "religious", coordinates: [23.2715, 77.4042], nearestStationId: "subhash_nagar", distanceKm: 2.2 },
  { id: "bharat_bhavan", name: "Bharat Bhavan (arts centre)", category: "entertainment", coordinates: [23.2548, 77.3998], nearestStationId: "subhash_nagar", distanceKm: 2.8 },
  { id: "sanchi_stupa_ref", name: "Sanchi Stupa (46 km by road)", category: "heritage", coordinates: [23.4793, 77.7394], nearestStationId: "subhash_nagar", distanceKm: 46.0 },
  { id: "archeological_museum", name: "Archaeological Museum Bhopal", category: "heritage", coordinates: [23.2688, 77.4195], nearestStationId: "subhash_nagar", distanceKm: 0.5 },
];
