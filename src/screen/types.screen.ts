import type { Matrix } from "./matrix.screen";

export type MatrixValue = string[][];

export interface MatrixSize {
  readonly height: number;
  readonly width: number;
}

export type IMatrix = Matrix | MatrixValue;