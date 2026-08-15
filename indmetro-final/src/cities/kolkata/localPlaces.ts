import type { LocalPlace } from "@/types/city";

export const localPlaces: LocalPlace[] = [
  // ── Blue Line ──────────────────────────────────────────────────────────────
  { id:"dakshineswar_temple",  name:"Dakshineswar Kali Temple",                category:"religious",  coordinates:[22.6548,88.3579], nearestStationId:"dakshineswar",      distanceKm:0.3  },
  { id:"belur_math",           name:"Belur Math (Ramakrishna Mission HQ)",      category:"religious",  coordinates:[22.6369,88.3517], nearestStationId:"baranagar",          distanceKm:1.5  },
  { id:"dum_dum_airport",      name:"Netaji Subhas Chandra Bose Int'l Airport", category:"transport",  coordinates:[22.6541,88.4465], nearestStationId:"dum_dum",            distanceKm:3.5  },
  { id:"dum_dum_rly",          name:"Dum Dum Railway Station",                  category:"transport",  coordinates:[22.6184,88.3802], nearestStationId:"dum_dum",            distanceKm:0.1  },
  { id:"shyambazar_5pt",       name:"Shyambazar Five-Point Crossing",           category:"transport",  coordinates:[22.5968,88.3812], nearestStationId:"shyambazar",         distanceKm:0.05 },
  { id:"marble_palace",        name:"Marble Palace (Mullick Mansion)",          category:"heritage",   coordinates:[22.5895,88.3625], nearestStationId:"shobhabazar",        distanceKm:0.5  },
  { id:"college_street",       name:"College Street (Book Market / CU)",        category:"shopping",   coordinates:[22.5775,88.3668], nearestStationId:"girish_park",        distanceKm:0.4  },
  { id:"victoria_memorial_kol","name":"Victoria Memorial (Museum)",             category:"heritage",   coordinates:[22.5448,88.3426], nearestStationId:"maidan",             distanceKm:0.3  },
  { id:"kolkata_maidan",       name:"Kolkata Maidan (Grounds)",                 category:"park",       coordinates:[22.5486,88.3421], nearestStationId:"maidan",             distanceKm:0.1  },
  { id:"fort_william",         name:"Fort William",                             category:"heritage",   coordinates:[22.5517,88.3396], nearestStationId:"maidan",             distanceKm:0.5  },
  { id:"park_street_food",     name:"Park Street (Food & Nightlife)",           category:"shopping",   coordinates:[22.5532,88.3522], nearestStationId:"park_street",        distanceKm:0.05 },
  { id:"esplanade_area",       name:"Esplanade (Shopping & Bus Hub)",           category:"transport",  coordinates:[22.5644,88.3517], nearestStationId:"esplanade",          distanceKm:0.05 },
  { id:"new_market_kol",       name:"New Market (Hogg Market)",                 category:"shopping",   coordinates:[22.5644,88.3492], nearestStationId:"chandni_chowk_kol",  distanceKm:0.3  },
  { id:"st_pauls_cathedral",   name:"St. Paul's Cathedral",                     category:"religious",  coordinates:[22.5466,88.3448], nearestStationId:"maidan",             distanceKm:0.6  },
  { id:"kalighat_temple",      name:"Kalighat Kali Temple",                     category:"religious",  coordinates:[22.5200,88.3446], nearestStationId:"kalighat",           distanceKm:0.1  },
  { id:"rabindra_sarobar_lake","name":"Rabindra Sarobar (Dhakuria Lake)",        category:"park",       coordinates:[22.4938,88.3584], nearestStationId:"rabindra_sarobar",   distanceKm:0.3  },
  { id:"tollygunge_club",      name:"Tollygunge Club (Golf & Leisure)",         category:"park",       coordinates:[22.4696,88.3594], nearestStationId:"tollygunge",         distanceKm:0.05 },
  { id:"south_city_mall",      name:"South City Mall, Prince Anwar Shah Road",  category:"shopping",   coordinates:[22.4736,88.3614], nearestStationId:"tollygunge",         distanceKm:0.5  },
  { id:"science_city_kol",     name:"Science City Kolkata",                     category:"heritage",   coordinates:[22.5338,88.3968], nearestStationId:"park_street",        distanceKm:3.0  },
  { id:"indian_museum",        name:"Indian Museum (Oldest in Asia)",           category:"heritage",   coordinates:[22.5577,88.3539], nearestStationId:"park_street",        distanceKm:0.5  },

  // ── Green Line ─────────────────────────────────────────────────────────────
  { id:"howrah_station",       name:"Howrah Railway Station (Major hub)",       category:"transport",  coordinates:[22.5830,88.3420], nearestStationId:"howrah",             distanceKm:0.2  },
  { id:"howrah_bridge",        name:"Howrah Bridge (Rabindra Setu)",            category:"heritage",   coordinates:[22.5842,88.3488], nearestStationId:"howrah",             distanceKm:0.5  },
  { id:"sealdah_station",      name:"Sealdah Railway Station",                  category:"transport",  coordinates:[22.5690,88.3722], nearestStationId:"sealdah",            distanceKm:0.05 },
  { id:"salt_lake_sec5_hub",   name:"Salt Lake Sector V (IT Hub / Bidhannagar)",category:"civic",      coordinates:[22.5692,88.4152], nearestStationId:"salt_lake_sec5",     distanceKm:0.05 },
  { id:"city_centre_mall",     name:"City Centre Salt Lake (Mall)",             category:"shopping",   coordinates:[22.5808,88.4416], nearestStationId:"city_centre",        distanceKm:0.05 },
  { id:"nicco_park",           name:"Nicco Park (Amusement Park)",              category:"park",       coordinates:[22.5772,88.4262], nearestStationId:"salt_lake_stadium",  distanceKm:0.1  },
  { id:"yuba_bharati_stadium", name:"Vivekananda Yuba Bharati Krirangan (Stadium)", category:"park",   coordinates:[22.5732,88.4262], nearestStationId:"salt_lake_stadium",  distanceKm:0.05 },
  { id:"central_park_kol_park","name":"Central Park Salt Lake (Large Green)",   category:"park",       coordinates:[22.5828,88.4496], nearestStationId:"central_park_kol",   distanceKm:0.05 },
  { id:"millennium_park",      name:"Millennium Park (Ganges Riverfront)",      category:"park",       coordinates:[22.5732,88.3392], nearestStationId:"mahakaran",          distanceKm:0.5  },

  // ── Orange Line ────────────────────────────────────────────────────────────
  { id:"hemanta_area",         name:"New Garia / Hemanta Mukhopadhyay Market",  category:"shopping",   coordinates:[22.4600,88.3960], nearestStationId:"hemanta_mukho",      distanceKm:0.05 },
  { id:"sonarpur_station",     name:"Sonarpur Railway Station",                 category:"transport",  coordinates:[22.4180,88.4321], nearestStationId:"sonarpur_metro",     distanceKm:0.5  },

  // ── Purple Line ────────────────────────────────────────────────────────────
  { id:"joka_area",            name:"Joka Market Area",                         category:"shopping",   coordinates:[22.4393,88.3124], nearestStationId:"joka",               distanceKm:0.05 },
  { id:"dps_behala",           name:"DPS Behala / Educational Hub",             category:"education",  coordinates:[22.4862,88.3352], nearestStationId:"behala_chowrasta",   distanceKm:0.05 },
  { id:"taratala_industrial",  name:"Taratala Industrial Area",                 category:"civic",      coordinates:[22.5150,88.3448], nearestStationId:"taratala",           distanceKm:0.05 },

  // ── General Kolkata ────────────────────────────────────────────────────────
  { id:"eden_gardens",         name:"Eden Gardens Cricket Stadium",             category:"park",       coordinates:[22.5644,88.3426], nearestStationId:"esplanade",          distanceKm:0.6  },
  { id:"kumartuli",            name:"Kumartuli (Idol Makers Colony)",           category:"heritage",   coordinates:[22.5962,88.3672], nearestStationId:"shobhabazar",        distanceKm:0.5  },
  { id:"birla_planetarium_kol","name":"Birla Planetarium Kolkata",              category:"heritage",   coordinates:[22.5467,88.3429], nearestStationId:"maidan",             distanceKm:0.4  },
  { id:"kali_ghat_area",       name:"Kidderpore / Budge Budge Trunk Road",     category:"transport",  coordinates:[22.5290,88.3300], nearestStationId:"netaji_bhawan",      distanceKm:1.5  },
];
