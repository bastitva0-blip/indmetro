/**
 * Kanpur Metro — Local Places & Landmarks
 * ~50 key places mapped to nearest operational/WIP station
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
  // IIT Kanpur area
  { id: "iitk_campus", name: "IIT Kanpur Campus", category: "education", coordinates: [26.5123, 80.2329], nearestStationId: "iit_kanpur", distanceKm: 0.2 },
  { id: "iitk_library", name: "IIT Kanpur Central Library", category: "education", coordinates: [26.5138, 80.2304], nearestStationId: "iit_kanpur", distanceKm: 0.4 },
  { id: "iitk_hospital", name: "IIT Kanpur Hospital", category: "hospital", coordinates: [26.5099, 80.2318], nearestStationId: "iit_kanpur", distanceKm: 0.3 },
  { id: "kanpur_zoo", name: "Kanpur Zoological Park", category: "entertainment", coordinates: [26.4792, 80.2897], nearestStationId: "vishwavidyalaya", distanceKm: 1.1 },

  // Kalyanpur area
  { id: "kalyanpur_market", name: "Kalyanpur Market", category: "shopping", coordinates: [26.5015, 80.2551], nearestStationId: "kalyanpur", distanceKm: 0.3 },
  { id: "sjs_inter_college", name: "S.J.S. Inter College", category: "education", coordinates: [26.4992, 80.2589], nearestStationId: "kalyanpur", distanceKm: 0.6 },

  // SPN Hospital area
  { id: "spn_hospital_knp", name: "S.P.N. Hospital", category: "hospital", coordinates: [26.4946, 80.2701], nearestStationId: "spn_hospital", distanceKm: 0.1 },
  { id: "gsvm_medical", name: "GSVM Medical College", category: "education", coordinates: [26.4905, 80.2734], nearestStationId: "spn_hospital", distanceKm: 0.5 },
  { id: "ursula_hospital", name: "Ursula Hospital", category: "hospital", coordinates: [26.4962, 80.2675], nearestStationId: "spn_hospital", distanceKm: 0.4 },

  // Vishwavidyalaya area
  { id: "csjm_university", name: "CSJM University (Kanpur University)", category: "education", coordinates: [26.4872, 80.2865], nearestStationId: "vishwavidyalaya", distanceKm: 0.2 },
  { id: "kanpur_museum", name: "Kanpur Museum", category: "heritage", coordinates: [26.4861, 80.2891], nearestStationId: "vishwavidyalaya", distanceKm: 0.4 },
  { id: "phool_bagh", name: "Phool Bagh Park", category: "park", coordinates: [26.4838, 80.2921], nearestStationId: "vishwavidyalaya", distanceKm: 0.6 },

  // Gurudev Crossing area
  { id: "kidwai_nagar_market", name: "Kidwai Nagar Market", category: "shopping", coordinates: [26.4829, 80.3024], nearestStationId: "gurudev_crossing", distanceKm: 0.4 },
  { id: "jk_temple", name: "J.K. Temple (Radha Madhav)", category: "religious", coordinates: [26.4798, 80.3071], nearestStationId: "gurudev_crossing", distanceKm: 0.8 },

  // Geeta Nagar area
  { id: "geeta_nagar_park", name: "Geeta Nagar Park", category: "park", coordinates: [26.4776, 80.3149], nearestStationId: "geeta_nagar", distanceKm: 0.2 },
  { id: "hbtu_kanpur", name: "HBTU Kanpur", category: "education", coordinates: [26.4752, 80.3198], nearestStationId: "geeta_nagar", distanceKm: 0.7 },

  // Rawatpur area
  { id: "rawatpur_market", name: "Rawatpur Market", category: "shopping", coordinates: [26.4712, 80.3299], nearestStationId: "rawatpur", distanceKm: 0.3 },
  { id: "airforce_station_knp", name: "Air Force Station Kanpur", category: "civic", coordinates: [26.4651, 80.3378], nearestStationId: "rawatpur", distanceKm: 1.0 },

  // Kanpur Central area (WIP)
  { id: "kanpur_central_station", name: "Kanpur Central Railway Station", category: "transport", coordinates: [26.4618, 80.3484], nearestStationId: "kanpur_central", distanceKm: 0.3 },
  { id: "kanpur_anwarganj_station", name: "Kanpur Anwarganj Station", category: "transport", coordinates: [26.4634, 80.3456], nearestStationId: "kanpur_central", distanceKm: 0.5 },
  { id: "birhana_road", name: "Birhana Road Market", category: "shopping", coordinates: [26.4592, 80.3521], nearestStationId: "kanpur_central", distanceKm: 0.6 },

  // Motijheel area (WIP)
  { id: "motijheel_park", name: "Motijheel Park", category: "park", coordinates: [26.4588, 80.3594], nearestStationId: "motijheel", distanceKm: 0.2 },
  { id: "nana_rao_park", name: "Nana Rao Park", category: "heritage", coordinates: [26.4575, 80.3612], nearestStationId: "motijheel", distanceKm: 0.4 },
  { id: "memorial_church_knp", name: "Memorial Church (1875)", category: "heritage", coordinates: [26.4619, 80.3548], nearestStationId: "motijheel", distanceKm: 0.8 },

  // Chunniganj (WIP)
  { id: "chunniganj_market", name: "Chunniganj Cloth Market", category: "shopping", coordinates: [26.4551, 80.3659], nearestStationId: "chunniganj", distanceKm: 0.3 },
  { id: "shiv_temple_chunniganj", name: "Shiv Temple Chunniganj", category: "religious", coordinates: [26.4538, 80.3671], nearestStationId: "chunniganj", distanceKm: 0.4 },

  // Naveen Market (WIP)
  { id: "naveen_market_knp", name: "Naveen Market Shopping Hub", category: "shopping", coordinates: [26.4497, 80.3716], nearestStationId: "naveen_market", distanceKm: 0.1 },
  { id: "mall_road_knp", name: "Mall Road", category: "shopping", coordinates: [26.4512, 80.3698], nearestStationId: "naveen_market", distanceKm: 0.3 },
  { id: "elgin_mills", name: "Elgin Mills Heritage Site", category: "heritage", coordinates: [26.4479, 80.3738], nearestStationId: "naveen_market", distanceKm: 0.5 },

  // Bada Chauraha (WIP)
  { id: "bada_chauraha_market", name: "Bada Chauraha Market", category: "shopping", coordinates: [26.4459, 80.3778], nearestStationId: "bada_chauraha", distanceKm: 0.1 },
  { id: "collectorate_knp", name: "District Collectorate Kanpur", category: "civic", coordinates: [26.4471, 80.3761], nearestStationId: "bada_chauraha", distanceKm: 0.3 },

  // Nayaganj (WIP)
  { id: "sisamau_nala", name: "Sisamau Market", category: "shopping", coordinates: [26.4428, 80.3851], nearestStationId: "nayaganj", distanceKm: 0.4 },
  { id: "holi_gate", name: "Holi Gate Heritage", category: "heritage", coordinates: [26.4414, 80.3866], nearestStationId: "nayaganj", distanceKm: 0.6 },

  // Transport Nagar (WIP)
  { id: "transport_nagar_bus", name: "Transport Nagar Bus Stand", category: "transport", coordinates: [26.4375, 80.3924], nearestStationId: "transport_nagar_knp", distanceKm: 0.2 },

  // Juhi (WIP)
  { id: "juhi_bus_stand", name: "Juhi Bus Stand", category: "transport", coordinates: [26.4341, 80.4008], nearestStationId: "juhi", distanceKm: 0.2 },

  // Chakeri (WIP)
  { id: "chakeri_air_force", name: "Chakeri Air Force Base", category: "civic", coordinates: [26.4251, 80.4128], nearestStationId: "chakeri", distanceKm: 0.7 },

  // Airport (WIP)
  { id: "kanpur_airport", name: "Kanpur Airport (Civil Aerodrome)", category: "transport", coordinates: [26.4044, 80.4103], nearestStationId: "airport_kanpur", distanceKm: 1.8 },

  // Naubasta (WIP)
  { id: "naubasta_market", name: "Naubasta Market", category: "shopping", coordinates: [26.4122, 80.4424], nearestStationId: "naubasta", distanceKm: 0.2 },
];
