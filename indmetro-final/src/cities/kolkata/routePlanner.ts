import { Station, stations, LINE_STATIONS, OPERATIONAL_STATIONS } from "./metroData";
import { getDistanceKm, calculateFare } from "./fareData";
import { getTravelTime, getHeadway } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";

export type KolLine="blue"|"green"|"orange"|"purple";
export interface RouteStep{type:"board"|"travel"|"interchange"|"alight";line?:KolLine;stationId?:string;stationName?:string;direction?:string;numStops?:number;durationMinutes?:number;walkMinutes?:number;}
export interface PlannedRoute{origin:Station;destination:Station;steps:RouteStep[];totalStations:number;totalTime:number;interchangeCount:number;fare:number;discountedFare:number;isDirect:boolean;departureTime?:string;arrivalTime?:string;gaugeNote?:string;}

const fmt=(m:number)=>`${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(Math.round(m%60)).padStart(2,"0")}`;

const commonLine=(a:string,b:string):KolLine|null=>{
  for(const l of["blue","green","orange","purple"] as KolLine[])
    if(LINE_STATIONS[l].includes(a)&&LINE_STATIONS[l].includes(b)) return l;
  return null;
};
const getLineForStation=(id:string):KolLine|null=>{
  for(const l of["blue","green","orange","purple"] as KolLine[])
    if(LINE_STATIONS[l].includes(id)) return l;
  return null;
};

const INTERCHANGES=[
  {via:"esplanade",     altVia:"esplanade_grn",  lines:["blue","green"]  as KolLine[], walkMin:3},
  {via:"kavi_subhash",  altVia:"hemanta_mukho",   lines:["blue","orange"] as KolLine[], walkMin:5},
];

export const planRoute=(originId:string,destinationId:string,hasCard=false):PlannedRoute|null=>{
  const origin=stations[originId],destination=stations[destinationId];
  if(!origin||!destination||originId===destinationId) return null;
  if(!OPERATIONAL_STATIONS.has(originId)||!OPERATIONAL_STATIONS.has(destinationId)) return null;

  const now=getISTDate(),curr=now.getHours()*60+now.getMinutes();

  // Direct
  const direct=commonLine(originId,destinationId);
  if(direct){
    const arr=LINE_STATIONS[direct],fi=arr.indexOf(originId),ti=arr.indexOf(destinationId);
    const stops=Math.abs(fi-ti);
    const distKm=getDistanceKm(originId,destinationId,direct);
    const travel=getTravelTime(direct,originId,destinationId)??stops*2;
    const wait=getHeadway(direct,now)/2;
    const dirSt=fi<ti?stations[arr[arr.length-1]]:stations[arr[0]];
    return{
      origin,destination,
      steps:[
        {type:"board",line:direct,stationId:originId,stationName:origin.name,direction:`towards ${dirSt?.name}`},
        {type:"travel",line:direct,numStops:stops,durationMinutes:travel},
        {type:"alight",stationId:destinationId,stationName:destination.name},
      ],
      totalStations:stops,totalTime:Math.round(wait+travel),interchangeCount:0,
      fare:calculateFare(distKm,direct,false),discountedFare:calculateFare(distKm,direct,true),
      isDirect:true,departureTime:fmt(curr+wait),arrivalTime:fmt(curr+wait+travel),
    };
  }

  // Interchange
  const oLine=getLineForStation(originId),dLine=getLineForStation(destinationId);
  if(!oLine||!dLine) return null;

  for(const ix of INTERCHANGES){
    if(!ix.lines.includes(oLine)||!ix.lines.includes(dLine)) continue;
    const ixOnO=LINE_STATIONS[oLine].includes(ix.via)?ix.via:ix.altVia;
    const ixOnD=LINE_STATIONS[dLine].includes(ix.altVia)?ix.altVia:ix.via;
    const l1=LINE_STATIONS[oLine],l2=LINE_STATIONS[dLine];
    const fi=l1.indexOf(originId),xi=l1.indexOf(ixOnO),dxi=l2.indexOf(ixOnD),di=l2.indexOf(destinationId);
    if(fi===-1||xi===-1||dxi===-1||di===-1) continue;

    const l1stops=Math.abs(fi-xi),l2stops=Math.abs(dxi-di);
    const d1=getDistanceKm(originId,ixOnO,oLine),d2=getDistanceKm(ixOnD,destinationId,dLine);
    const l1t=getTravelTime(oLine,originId,ixOnO)??l1stops*2;
    const l2t=getTravelTime(dLine,ixOnD,destinationId)??l2stops*2;
    const wait=getHeadway(oLine,now)/2;
    const f1=calculateFare(d1,oLine,false),f2=calculateFare(d2,dLine,false);
    const df1=calculateFare(d1,oLine,true),df2=calculateFare(d2,dLine,true);
    const l2dirSt=dxi<di?stations[l2[l2.length-1]]:stations[l2[0]];

    const gaugeNote=oLine==="blue"||dLine==="blue"
      ?"⚠️ Blue Line uses BROAD GAUGE — different fare system, separate ticket required at interchange":undefined;

    return{
      origin,destination,
      steps:[
        {type:"board",line:oLine,stationId:originId,stationName:origin.name,direction:`towards ${stations[ixOnO]?.name}`},
        {type:"travel",line:oLine,numStops:l1stops,durationMinutes:l1t},
        {type:"interchange",stationId:ix.via,stationName:stations[ixOnO]?.name??ix.via,walkMinutes:ix.walkMin},
        {type:"board",line:dLine,stationId:ixOnD,stationName:stations[ixOnD]?.name,direction:`towards ${l2dirSt?.name}`},
        {type:"travel",line:dLine,numStops:l2stops,durationMinutes:l2t},
        {type:"alight",stationId:destinationId,stationName:destination.name},
      ],
      totalStations:l1stops+l2stops,totalTime:Math.round(wait+l1t+ix.walkMin+l2t),
      interchangeCount:1,fare:f1+f2,discountedFare:df1+df2,isDirect:false,
      departureTime:fmt(curr+wait),arrivalTime:fmt(curr+wait+l1t+ix.walkMin+l2t),gaugeNote,
    };
  }
  return null;
};
