import { Coords } from "./coords";

export class Vector2 {
  private _start: Coords;
  private _end: Coords;

  public constructor(end: Coords, start: Coords = Coords.from([0, 0])) {
    this._start = start;
    this._end = end;
  }

  public setStart(coords: Coords<true>): Coords {
    return this.start.set(coords);
  }

  public summStart(coords: Coords<true>): Coords {
    return this.start.summ(coords);
  }

  public setEnd(coords: Coords<true>): Coords {
    return this.end.set(coords);
  }

  public summEnd(coords: Coords<true>): Coords {
    return this.end.summ(coords);
  }

  public get start() {
    return this._start;
  }

  public get end() {
    return this._end;
  }
}

export default Vector2;
