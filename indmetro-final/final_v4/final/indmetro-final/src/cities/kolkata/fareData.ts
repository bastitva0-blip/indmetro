/**
 * Kolkata Metro — Fare Systems
 * Blue (Indian Railways): ₹5–₹30 (distance-based, cheaper)
 * Green/Orange/Purple (KMRC): ₹5–₹40 (distance-based, slightly higher)
 * Smart Card: 10% discount on all lines (separate cards but same discount).
 */
import { stations, LINE_STATIONS } from "./metroData";

export interface FareZone { minKm: number; maxKm: number; fare: number; }

export const BLUE_FARES: FareZone[] = [
  { minKm:0,  maxKm:2,  fare:5  },
  { minKm:2,  maxKm:5,  fare:10 },
  { minKm:5,  maxKm:10, fare:15 },
  { minKm:10, maxKm:18, fare:20 },
  { minKm:18, maxKm:24, fare:25 },
  { minKm:24, maxKm:Infinity, fare:30 },
];

export const KMRC_FARES: FareZone[] = [
  { minKm:0,  maxKm:2,  fare:5  },
  { minKm:2,  maxKm:5,  fare:10 },
  { minKm:5,  maxKm:10, fare:20 },
  { minKm:10, maxKm:16, fare:30 },
  { minKm:16, maxKm:Infinity, fare:40 },
];

export const SMART_CARD = { name:"Smart Card (Kolkata)", discountPercent:10, depositRupees:40 };

const haversine = ([la1,lo1]:[number,number],[la2,lo2]:[number,number]):number => {
  const R=6371,dLat=(la2-la1)*Math.PI/180,dLon=(lo2-lo1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
};

export const getDistanceKm = (fromId:string, toId:string, line:"blue"|"green"|"orange"|"purple"):number => {
  const arr=LINE_STATIONS[line]; const fi=arr.indexOf(fromId),ti=arr.indexOf(toId);
  if(fi===-1||ti===-1) return 0;
  const [a,b]=fi<ti?[fi,ti]:[ti,fi]; let d=0;
  for(let i=a;i<b;i++){const sa=stations[arr[i]],sb=stations[arr[i+1]];if(sa&&sb)d+=haversine(sa.coordinates,sb.coordinates);}
  return Math.round(d*10)/10;
};

const calcFare=(distKm:number,zones:FareZone[],hasCard:boolean):number=>{
  const base=(zones.find(z=>distKm>=z.minKm&&distKm<z.maxKm)??zones[zones.length-1]).fare;
  return hasCard?Math.round(base*0.9):base;
};

export const calculateFare=(distKm:number,line:"blue"|"green"|"orange"|"purple",hasCard=false):number=>
  calcFare(Math.max(0.01,distKm), line==="blue"?BLUE_FARES:KMRC_FARES, hasCard);
