import { Station, stations, LINE_STATIONS } from "./metroData";
import { calculateFare } from "./fareData";
import { getTravelTimeMinutes, getHeadwayMinutes } from "./segmentTimings";
import { getISTDate } from "@/lib/utils";
export interface RouteStep { type:"board"|"travel"|"alight"; line?:"aqua"; stationId?:string; stationName?:string; direction?:string; numStops?:number; durationMinutes?:number; }
export interface PlannedRoute { origin:Station; destination:Station; steps:RouteStep[]; totalStations:number; totalTime:number; interchangeCount:number; fare:number; discountedFare?:number; isDirect:boolean; departureTime?:string; arrivalTime?:string; }
const fmt = (m:number) => `${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(Math.round(m%60)).padStart(2,"0")}`;
export const planRoute = (originId:string, destinationId:string, hasCard=false): PlannedRoute|null => {
  const origin=stations[originId], destination=stations[destinationId];
  if (!origin||!destination||originId===destinationId) return null;
  const arr=LINE_STATIONS.aqua, fi=arr.indexOf(originId), ti=arr.indexOf(destinationId);
  if (fi===-1||ti===-1) return null;
  const stops=Math.abs(ti-fi), travel=getTravelTimeMinutes("aqua",originId,destinationId)??stops*2.2;
  const now=getISTDate(), wait=getHeadwayMinutes("aqua",now)/2, curr=now.getHours()*60+now.getMinutes();
  const dirStation=fi<ti?stations[arr[arr.length-1]]:stations[arr[0]];
  return {
    origin,destination,
    steps:[
      {type:"board",line:"aqua",stationId:originId,stationName:origin.name,direction:`towards ${dirStation.name}`},
      {type:"travel",line:"aqua",numStops:stops,durationMinutes:travel},
      {type:"alight",stationId:destinationId,stationName:destination.name},
    ],
    totalStations:stops,totalTime:Math.round(wait+travel),interchangeCount:0,
    fare:calculateFare(stops),discountedFare:calculateFare(stops,true),isDirect:true,
    departureTime:fmt(curr+wait),arrivalTime:fmt(curr+wait+travel),
  };
};
