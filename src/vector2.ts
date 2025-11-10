import { Coords, ICoords } from "./coords";

export class Vector2 {
  private _move_to: Coords;

  public constructor(...moveTo: ICoords[]) {
    this._move_to = Coords.from(Coords.summ(...moveTo));
  }

  public execute(coords: ICoords) {
    return Coords.from(coords).summ(this._move_to);
  }

  public get moveTo(): Coords {
    return this._move_to;
  }
}

export default Vector2;
