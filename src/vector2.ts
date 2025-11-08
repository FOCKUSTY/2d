import { ArrayCoords, Coords, ObjectCoords } from "./coords";

export class Vector2 {
  private _current: Coords;
  private _move_to: Coords;

  public constructor(
    current: Coords,
    moveTo: Coords | ArrayCoords | ObjectCoords
  ) {
    this._current = current;
    this._move_to = moveTo instanceof Coords ? moveTo : Coords.from(moveTo);
  }

  public execute() {
    return this._current.summ(this._move_to);
  }

  public get current(): Coords {
    return this._current;
  }

  public get moveTo(): Coords {
    return this._move_to;
  }
}

export default Vector2;
