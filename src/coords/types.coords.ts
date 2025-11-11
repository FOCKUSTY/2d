import type { Matrix } from "@screen";
import type { Coords } from "./index.coords";

export interface ObjectCoords {
  x: number;
  y: number;
  z: number;
}

export interface AdditionalCoordsProperties {
  matrix: Matrix;
  teleportEnabled: boolean;
}

export type ArrayCoords = [number, number, number];

export type ICoords = ObjectCoords | ArrayCoords | Coords;
