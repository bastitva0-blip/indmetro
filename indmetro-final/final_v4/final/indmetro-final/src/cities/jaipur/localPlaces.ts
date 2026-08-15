/**
 * Jaipur Metro — Local Places & Landmarks
 * 35 key places mapped to nearest station
 *
 * Tourist-heavy walled city stations (Badi Chaupar, Chhoti Chaupar)
 * serve Hawa Mahal, City Palace, Jantar Mantar etc.
 */

export interface LocalPlace {
  id: string;
  name: string;
  category:
    | "heritage"
    | "shopping"
    | "park"
    | "education"
    | "hospital"
    | "transport"
    | "civic"
    | "religious"
    | "entertainment"
    | "sports";
  coordinates: [number, number];
  nearestStationId: string;
  distanceKm: number;
}

export const localPlaces: LocalPlace[] = [
  // ── Badi Chaupar ─────────────────────────────────────────────────────────
  {
    id: "hawa_mahal",
    name: "Hawa Mahal (Palace of Winds)",
    category: "heritage",
    coordinates: [26.9239, 75.8267],
    nearestStationId: "badi_chaupar",
    distanceKm: 0.1,
  },
  {
    id: "johari_bazaar",
    name: "Johari Bazaar",
    category: "shopping",
    coordinates: [26.9220, 75.8260],
    nearestStationId: "badi_chaupar",
    distanceKm: 0.2,
  },
  {
    id: "tripolia_bazaar",
    name: "Tripolia Bazaar",
    category: "shopping",
    coordinates: [26.9228, 75.8230],
    nearestStationId: "badi_chaupar",
    distanceKm: 0.4,
  },
  {
    id: "badi_chaupar_chowk",
    name: "Badi Chaupar Chowk",
    category: "heritage",
    coordinates: [26.9229, 75.8268],
    nearestStationId: "badi_chaupar",
    distanceKm: 0.05,
  },

  // ── Chhoti Chaupar ────────────────────────────────────────────────────────
  {
    id: "city_palace",
    name: "City Palace Jaipur",
    category: "heritage",
    coordinates: [26.9258, 75.8235],
    nearestStationId: "chhoti_chaupar",
    distanceKm: 0.5,
  },
  {
    id: "jantar_mantar",
    name: "Jantar Mantar (UNESCO)",
    category: "heritage",
    coordinates: [26.9246, 75.8245],
    nearestStationId: "chhoti_chaupar",
    distanceKm: 0.4,
  },
  {
    id: "govind_dev_ji",
    name: "Govind Dev Ji Temple",
    category: "religious",
    coordinates: [26.9271, 75.8238],
    nearestStationId: "chhoti_chaupar",
    distanceKm: 0.6,
  },
  {
    id: "chhoti_chaupar_chowk",
    name: "Chhoti Chaupar Chowk",
    category: "heritage",
    coordinates: [26.9247, 75.8185],
    nearestStationId: "chhoti_chaupar",
    distanceKm: 0.05,
  },

  // ── Chandpole ─────────────────────────────────────────────────────────────
  {
    id: "chandpole_gate",
    name: "Chandpole Gate (Walled City Entry)",
    category: "heritage",
    coordinates: [26.9269, 75.8076],
    nearestStationId: "chandpole",
    distanceKm: 0.2,
  },
  {
    id: "nahargarh_fort",
    name: "Nahargarh Fort",
    category: "heritage",
    coordinates: [26.9429, 75.8063],
    nearestStationId: "chandpole",
    distanceKm: 2.5,
  },
  {
    id: "amber_fort",
    name: "Amer (Amber) Fort",
    category: "heritage",
    coordinates: [26.9855, 75.8513],
    nearestStationId: "chandpole",
    distanceKm: 9.5,
  },
  {
    id: "jaigarh_fort",
    name: "Jaigarh Fort",
    category: "heritage",
    coordinates: [26.9878, 75.8415],
    nearestStationId: "chandpole",
    distanceKm: 10.5,
  },

  // ── Sindhi Camp ───────────────────────────────────────────────────────────
  {
    id: "sindhi_camp_bus",
    name: "Sindhi Camp Bus Terminal (RSRTC)",
    category: "transport",
    coordinates: [26.9225, 75.7996],
    nearestStationId: "sindhi_camp",
    distanceKm: 0.1,
  },

  // ── Railway Station ───────────────────────────────────────────────────────
  {
    id: "jaipur_junction",
    name: "Jaipur Junction Railway Station",
    category: "transport",
    coordinates: [26.9185, 75.7899],
    nearestStationId: "railway_station",
    distanceKm: 0.1,
  },
  {
    id: "jaipur_wax_museum",
    name: "Jaipur Wax Museum",
    category: "entertainment",
    coordinates: [26.9195, 75.7915],
    nearestStationId: "railway_station",
    distanceKm: 0.3,
  },
  {
    id: "mi_road",
    name: "MI Road (Commercial Hub)",
    category: "shopping",
    coordinates: [26.9178, 75.7922],
    nearestStationId: "railway_station",
    distanceKm: 0.4,
  },
  {
    id: "rawat_mishtan",
    name: "Rawat Mishtan Bhandar",
    category: "entertainment",
    coordinates: [26.9188, 75.7912],
    nearestStationId: "railway_station",
    distanceKm: 0.3,
  },

  // ── Civil Lines ───────────────────────────────────────────────────────────
  {
    id: "albert_hall_museum",
    name: "Albert Hall Museum",
    category: "heritage",
    coordinates: [26.9100, 75.7892],
    nearestStationId: "civil_lines",
    distanceKm: 0.2,
  },
  {
    id: "sms_hospital",
    name: "SMS Hospital",
    category: "hospital",
    coordinates: [26.9095, 75.7818],
    nearestStationId: "civil_lines",
    distanceKm: 0.4,
  },
  {
    id: "raj_mandir_cinema",
    name: "Raj Mandir Cinema",
    category: "entertainment",
    coordinates: [26.9130, 75.7835],
    nearestStationId: "civil_lines",
    distanceKm: 0.5,
  },
  {
    id: "birla_mandir",
    name: "Birla Mandir (Laxmi Narayan Temple)",
    category: "religious",
    coordinates: [26.9025, 75.7872],
    nearestStationId: "civil_lines",
    distanceKm: 0.9,
  },
  {
    id: "central_park_jaipur",
    name: "Central Park Jaipur",
    category: "park",
    coordinates: [26.9097, 75.7760],
    nearestStationId: "civil_lines",
    distanceKm: 0.5,
  },
  {
    id: "statue_circle",
    name: "Statue Circle",
    category: "civic",
    coordinates: [26.9124, 75.7784],
    nearestStationId: "civil_lines",
    distanceKm: 0.3,
  },
  {
    id: "world_trade_park",
    name: "World Trade Park (WTP Mall)",
    category: "shopping",
    coordinates: [26.9087, 75.7798],
    nearestStationId: "civil_lines",
    distanceKm: 0.6,
  },
  {
    id: "jaipur_collectorate",
    name: "District Collectorate Jaipur",
    category: "civic",
    coordinates: [26.9112, 75.7802],
    nearestStationId: "civil_lines",
    distanceKm: 0.4,
  },

  // ── Ram Nagar ─────────────────────────────────────────────────────────────
  {
    id: "jal_mahal",
    name: "Jal Mahal (Water Palace)",
    category: "heritage",
    coordinates: [26.9344, 75.8467],
    nearestStationId: "ram_nagar",
    distanceKm: 8.2,
  },
  {
    id: "ram_nagar_market",
    name: "Ram Nagar Market",
    category: "shopping",
    coordinates: [26.9021, 75.7749],
    nearestStationId: "ram_nagar",
    distanceKm: 0.3,
  },

  // ── Shyam Nagar ───────────────────────────────────────────────────────────
  {
    id: "shyam_nagar_market",
    name: "Shyam Nagar Market",
    category: "shopping",
    coordinates: [26.8968, 75.7715],
    nearestStationId: "shyam_nagar",
    distanceKm: 0.2,
  },

  // ── Vivek Vihar ───────────────────────────────────────────────────────────
  {
    id: "vivek_vihar_market",
    name: "Vivek Vihar Market",
    category: "shopping",
    coordinates: [26.8892, 75.7688],
    nearestStationId: "vivek_vihar",
    distanceKm: 0.2,
  },

  // ── New Aatish Market ─────────────────────────────────────────────────────
  {
    id: "aatish_market",
    name: "Aatish Market",
    category: "shopping",
    coordinates: [26.8806, 75.7648],
    nearestStationId: "new_aatish_market",
    distanceKm: 0.1,
  },
  {
    id: "new_sanganer_road",
    name: "New Sanganer Road",
    category: "transport",
    coordinates: [26.8812, 75.7642],
    nearestStationId: "new_aatish_market",
    distanceKm: 0.2,
  },

  // ── Mansarovar ────────────────────────────────────────────────────────────
  {
    id: "mansarovar_market",
    name: "Mansarovar Market Complex",
    category: "shopping",
    coordinates: [26.8800, 75.7505],
    nearestStationId: "mansarovar",
    distanceKm: 0.3,
  },
  {
    id: "jmrc_depot",
    name: "JMRC Metro Depot",
    category: "transport",
    coordinates: [26.8785, 75.7492],
    nearestStationId: "mansarovar",
    distanceKm: 0.4,
  },
  {
    id: "sanganer_airport_area",
    name: "Jaipur International Airport (area)",
    category: "transport",
    coordinates: [26.8242, 75.8122],
    nearestStationId: "mansarovar",
    distanceKm: 6.5,
  },
];
