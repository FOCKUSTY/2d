import type { Matrix } from "./matrix.screen";
import { AnimationFrame } from "@frame";

export interface AdditionProperties {
  fill: {
    void: string;
    air: string;
  };
}

export class Screen {
  private _martix: Matrix;
  private _fill: AdditionProperties["fill"];

  public constructor(
    matrix: Matrix,
    additionalProperties: AdditionProperties,
    public readonly animationFrame: AnimationFrame = new AnimationFrame()
  ) {
    this._fill = additionalProperties.fill;
    this._martix = matrix;
    this._martix.setFill(this._fill.void);
  }

  public execute() {
    this.animationFrame.execute();
  }

  public get matrix(): Matrix {
    return this._martix;
  }
}

export default Screen;
