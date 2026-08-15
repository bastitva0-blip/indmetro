import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  { id: "taj_mahal_monument", name: "Taj Mahal", category: "heritage", coordinates: [27.1751, 78.0421], nearestStationId: "taj_mahal", distanceKm: 0.5 },
  { id: "taj_east_gate_entry", name: "Taj Mahal East Gate", category: "heritage", coordinates: [27.1724, 78.0432], nearestStationId: "taj_east_gate", distanceKm: 0.2 },
  { id: "agra_fort", name: "Agra Fort", category: "heritage", coordinates: [27.1798, 78.0219], nearestStationId: "dr_ambedkar_chowk", distanceKm: 0.4 },
  { id: "mehtab_bagh", name: "Mehtab Bagh", category: "park", coordinates: [27.1784, 78.0388], nearestStationId: "taj_east_gate", distanceKm: 0.8 },
  { id: "itimad_ud_daulah", name: "Itimad-ud-Daulah (Baby Taj)", category: "heritage", coordinates: [27.1981, 78.0323], nearestStationId: "mankameshwar", distanceKm: 2.5 },
  { id: "mankameshwar_temple", name: "Mankameshwar Temple", category: "religious", coordinates: [27.1782, 78.0186], nearestStationId: "mankameshwar", distanceKm: 0.2 },
  { id: "kinari_bazar", name: "Kinari Bazar", category: "shopping", coordinates: [27.1801, 78.0204], nearestStationId: "dr_ambedkar_chowk", distanceKm: 0.5 },
  { id: "sadar_bazar_agra", name: "Sadar Bazar Market", category: "shopping", coordinates: [27.1645, 78.0104], nearestStationId: "dr_ambedkar_chowk", distanceKm: 1.2 },
  { id: "taj_nature_walk", name: "Taj Nature Walk", category: "park", coordinates: [27.1669, 78.0461], nearestStationId: "taj_east_gate", distanceKm: 0.6 },
  { id: "sikandra_akbar_tomb", name: "Sikandra (Akbar's Tomb)", category: "heritage", coordinates: [27.2210, 79.9582], nearestStationId: "sikandra", distanceKm: 0.3 },
  { id: "fatehabad_road_hotels", name: "Fatehabad Road Hotel Zone", category: "transport", coordinates: [27.1684, 78.0255], nearestStationId: "fatehabad_road", distanceKm: 0.1 },
  { id: "agra_cantt_railway", name: "Agra Cantt Railway Station", category: "transport", coordinates: [27.1558, 78.0082], nearestStationId: "agra_cantt", distanceKm: 0.1 },
  { id: "dayal_bagh", name: "Dayalbagh Gardens", category: "park", coordinates: [27.2172, 78.0298], nearestStationId: "guru_ka_taal", distanceKm: 1.4 },
  { id: "guru_ka_taal_gurdwara", name: "Guru Ka Taal Gurdwara", category: "religious", coordinates: [27.2105, 79.9618], nearestStationId: "guru_ka_taal", distanceKm: 0.2 },
  { id: "isbt_agra_bus", name: "Agra ISBT Bus Stand", category: "transport", coordinates: [27.2041, 79.9692], nearestStationId: "isbt_agra", distanceKm: 0.2 },
  { id: "taj_museum", name: "Taj Museum", category: "heritage", coordinates: [27.1742, 78.0405], nearestStationId: "taj_east_gate", distanceKm: 0.4 },
  { id: "agra_college_building", name: "Agra College", category: "education", coordinates: [27.1871, 79.9928], nearestStationId: "agra_college", distanceKm: 0.1 },
  { id: "sn_medical_college", name: "SN Medical College", category: "hospital", coordinates: [27.1823, 78.0022], nearestStationId: "medical_college", distanceKm: 0.2 },
  { id: "collectorate_agra", name: "District Collectorate", category: "civic", coordinates: [27.1748, 79.9891], nearestStationId: "collectorate", distanceKm: 0.1 },
  { id: "rbs_college_agra", name: "RBS College", category: "education", coordinates: [27.1978, 79.9765], nearestStationId: "rbs_college", distanceKm: 0.1 },
];
