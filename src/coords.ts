export interface ObjectCoords {
  x: number,
  y: number
}

export type ArrayCoords = [ number, number ];

export type MaybePartial<IsPartial extends boolean, T> =
  IsPartial extends true ? Partial<T>|undefined : T;

export class Coords<IsPartial extends boolean = false> implements Partial<ObjectCoords> {
  public static from(coords: ObjectCoords|ArrayCoords): Coords {
    return new Coords(...Array.isArray(coords)
      ? coords
      : <ArrayCoords>[coords.x, coords.y]);
  }

  private _0: MaybePartial<IsPartial, number>;
  private _1: MaybePartial<IsPartial, number>;
  private _x: MaybePartial<IsPartial, number>;
  private _y: MaybePartial<IsPartial, number>;

  public constructor(
    x: MaybePartial<IsPartial, number>,
    y: MaybePartial<IsPartial, number>
  ) {
    this._x = x;
    this._y = y;

    this._0 = x;
    this._1 = y;
  }

  public inverse() {
    return new Coords(-(this.x||0), -(this.y||0));
  }

  public copy() {
    return new Coords(this.x, this.y);
  }

  public set(coords: Coords<true>|Coords) {
    if (coords.x) {
      this.setX(coords.x);
    }

    if (coords.y) {
      this.setY(coords.y);
    }

    return this;
  }

  public summ(coords: Coords<true>|Coords) {
    if (coords.x) {
      this.setX((this.x||0) + coords.x);
    }

    if (coords.y) {
      this.setY((this.y||0) + coords.y);
    }

    return this;
  }

  public setX(x: number) {
    this._x = x;
    this._0 = x;

    return this;
  }
  
  public setY(y: number) {
    this._y = y;
    this._1 = y;

    return this;
  }

  public get 0(): MaybePartial<IsPartial, number> {
    return this._0;
  }
  
  public get 1(): MaybePartial<IsPartial, number> {
    return this._1;
  }

  public get x(): MaybePartial<IsPartial, number> {
    return this._x;
  }

  public get y(): MaybePartial<IsPartial, number> {
    return this._y;
  }

  public set 0(value: number) {
    this.setX(value);
  }
  
  public set 1(value: number) {
    this.setY(value);
  }

  public set x(value: number) {
    this.setX(value);
  }

  public set y(value: number) {
    this.setY(value);
  }

  public get [Symbol.iterator]() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    return function*() {
      yield context.x;
      yield context.y;
      return;
    }
  }
}

export default Coords;
