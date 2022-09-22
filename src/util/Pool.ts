import { BlendPoolMarkers } from "../data/BlendPoolMarkers";
import { GetSiloData } from "../data/SiloData";

export function isPoolDeprecated(pool: BlendPoolMarkers) {
  return GetSiloData(pool.silo0Address.toLowerCase())?.deprecated || GetSiloData(pool.silo1Address.toLowerCase())?.deprecated || false;
}
