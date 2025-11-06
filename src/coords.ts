import { DIRECTIONS, Directions } from "./directions";
import Matrix from "./matrix";

export interface ObjectCoords {
  x: number;
  y: number;
}

export type ArrayCoords = [number, number];

export type MaybePartial<IsPartial extends boolean, T> = IsPartial extends true
  ? Partial<T> | undefined
  : T;

export class Coords<IsPartial extends boolean = false>
  implements Partial<ObjectCoords>
{
  public static from(
    coords: ObjectCoords | ArrayCoords,
    matrix?: Matrix
  ): Coords {
    return new Coords(
      ...(Array.isArray(coords) ? coords : <ArrayCoords>[coords.x, coords.y]),
      matrix
    );
  }

  private _0: MaybePartial<IsPartial, number>;
  private _1: MaybePartial<IsPartial, number>;
  private _x: MaybePartial<IsPartial, number>;
  private _y: MaybePartial<IsPartial, number>;

  private _matrix?: Matrix;
  private _teleport_enabled: boolean = false;

  public constructor(
    x: MaybePartial<IsPartial, number>,
    y: MaybePartial<IsPartial, number>,
    martix?: Matrix
  ) {
    this._x = x;
    this._y = y;

    this._0 = x;
    this._1 = y;

    this._matrix = martix;
  }

  public toggleTeleport(state?: boolean): this {
    if (!this._matrix) {
      throw new Error("Matrix not found");
    }

    this._teleport_enabled =
      state === undefined ? !this._teleport_enabled : state;

    return this;
  }

  public enableTeleport(): this {
    return this.toggleTeleport(true);
  }

  public disableTeleport(): this {
    return this.toggleTeleport(false);
  }

  public inverse(): Coords {
    const { x, y } = this.getClearCoords();
    return new Coords(-x, -y, this._matrix).toggleTeleport(
      this.teleportEnabled
    );
  }

  public copy() {
    return new Coords(this.x, this.y, this.matrix).toggleTeleport(
      this.teleportEnabled
    );
  }

  public moveTo(direction: Directions): this {
    return this.summ(
      Coords.from(DIRECTIONS[direction], this._matrix)
    ).toggleTeleport(this.teleportEnabled);
  }

  public toUp(): this {
    return this.moveTo(Directions.up);
  }

  public toRight(): this {
    return this.moveTo(Directions.right);
  }

  public toDown(): this {
    return this.moveTo(Directions.down);
  }

  public toLeft(): this {
    return this.moveTo(Directions.left);
  }

  public set(coords: Coords<true> | Coords): this {
    const previous = this.getClearCoords();
    const { x, y, matrix } = this.onCoordsChange(
      previous,
      previous.copyAndSumm(coords)
    );

    this.setDangerousX(x);
    this.setDangerousY(y);
    this.setMatrix(matrix);

    return this;
  }

  public copyAndSumm(coords: Coords<true> | Coords): Coords {
    const previous = this.getClearCoords();
    const current = coords.getClearCoords();

    return Coords.from(
      [previous.x + current.x, previous.y + current.y],
      coords.matrix
    );
  }

  public summ(coords: Coords<true> | Coords): this {
    const previous = this.getClearCoords();
    const { x, y } = this.onCoordsChange(
      previous,
      previous.copyAndSumm(coords)
    );

    this.setDangerousX(x);
    this.setDangerousY(y);

    return this;
  }

  public setX(x: number): this {
    const previous = this.getClearCoords();
    const current = this.onCoordsChange(
      previous,
      Coords.from([x, previous.y], this.matrix)
    );

    return this.setDangerousX(current.x);
  }

  public setY(y: number): this {
    const previous = this.getClearCoords();
    const current = this.onCoordsChange(
      previous,
      Coords.from([previous.x, y], this.matrix)
    );

    return this.setDangerousY(current.y);
  }

  public setDangerousX(x: number): this {
    this._x = x;
    this._0 = x;

    return this;
  }

  public setDangerousY(y: number): this {
    this._y = y;
    this._1 = y;

    return this;
  }

  public setMatrix(martix: Matrix | undefined): this {
    this._matrix = martix;
    return this;
  }

  public getClearCoords(): Coords {
    return Coords.from([this.x || 0, this.y || 0], this._matrix).toggleTeleport(
      this.teleportEnabled
    );
  }

  public get teleportEnabled(): boolean {
    return this._teleport_enabled;
  }

  public get matrix(): Matrix | undefined {
    return this._matrix;
  }

  public set matrix(matrix: Matrix) {
    this.setMatrix(matrix);
  }

  public get 0(): MaybePartial<IsPartial, number> {
    return this._0;
  }

  public set 0(value: number) {
    this.setDangerousX(value);
  }

  public get 1(): MaybePartial<IsPartial, number> {
    return this._1;
  }

  public set 1(value: number) {
    this.setDangerousY(value);
  }

  public get x(): MaybePartial<IsPartial, number> {
    return this._x;
  }

  public set x(value: number) {
    this.setDangerousX(value);
  }

  public get y(): MaybePartial<IsPartial, number> {
    return this._y;
  }

  public set y(value: number) {
    this.setDangerousY(value);
  }

  public get [Symbol.iterator]() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    return function* () {
      yield context.x;
      yield context.y;
      return;
    };
  }

  private onCoordsChange(previous: Coords, current: Coords) {
    if (!this._teleport_enabled) {
      return current;
    }

    const { x, y, matrix } = current;

    if (!matrix) {
      throw new Error("Matrix not found, but teleport enabled");
    }

    const position = matrix.getTeleportPosition(Coords.from([x, y], matrix));

    if (position === false) {
      return current;
    }

    this.enableTeleport();
    this.setDangerousX(position.x);
    this.setDangerousY(position.y);

    return this;
  }
}

export default Coords;
