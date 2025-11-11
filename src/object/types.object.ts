import type { Coords, ICoords } from "@coords";
import type { Element } from "./index.object";

export interface IElement {
  readonly coords: Coords;
  readonly fill: string;
}

export type Fill = {
  center: string;
  elements: string[];
  void: string;
  air: string;
};

export type Config = {
  centerIsElement: boolean;
  centerFillReplaceString: string;
};

export type ElementOrCoords = Element | ICoords;

export type MartixObjectConstructorParameters = {
  center: ICoords;
  defaultFill: string;
  zIndex?: number;
  elements?: ElementOrCoords[];
};
