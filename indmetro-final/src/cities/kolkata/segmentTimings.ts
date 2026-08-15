/**
 * Kolkata Metro — Segment Timings
 * Blue:   31.4 km · 26 stations · ~55 min E2E · 5 min peak · 10 min off-peak
 * Green:  16.6 km · 12 stations · ~30 min E2E · 7 min peak · 15 min off-peak
 * Orange: 9 operational stations (south section)
 * Purple: 6 operational stations (Joka → Taratala)
 */
import { LINE_STATIONS } from "./metroData";

export const CUMULATIVE: Record<string, number[]> = {
  blue:   [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,52],
  green:  [0,2,4,7,10,13,17,20,23,25,28,30],
  orange: [0,2,4,6,8,10,12,15,20,28],
  purple: [0,3,6,9,12,15,18,21,24,27,30,33,36,39,42],
};

// Trim to actual station count
for (const line of Object.keys(CUMULATIVE) as (keyof typeof CUMULATIVE)[]) {
  CUMULATIVE[line] = CUMULATIVE[line].slice(0, LINE_STATIONS[line as "blue"|"green"|"orange"|"purple"].length);
}

export const FIRST_TRAIN = { blue:"06:50", green:"06:30", orange:"06:00", purple:"07:00" };
export const LAST_TRAIN  = { blue:"21:45", green:"22:47", orange:"21:45", purple:"21:00" };
export const PEAK_HW     = { blue:5,  green:7,  orange:10, purple:15 };
export const OFFPEAK_HW  = { blue:10, green:15, orange:15, purple:20 };

export const getTravelTime = (line:string, fromId:string, toId:string):number|null => {
  const arr=LINE_STATIONS[line as "blue"|"green"|"orange"|"purple"];
  const cum=CUMULATIVE[line]; if(!arr||!cum) return null;
  const fi=arr.indexOf(fromId),ti=arr.indexOf(toId); if(fi===-1||ti===-1) return null;
  return Math.abs(cum[ti]-cum[fi]);
};

export const isPeakHour=(d:Date):boolean=>{const h=d.getHours();return(h>=7&&h<=10)||(h>=17&&h<=20);};
export const getHeadway=(line:string,d:Date):number=>
  isPeakHour(d)?PEAK_HW[line as keyof typeof PEAK_HW]:OFFPEAK_HW[line as keyof typeof OFFPEAK_HW];
