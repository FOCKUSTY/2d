import { DIRECTIONS, Directions } from "./directions";
import Matrix from "./matrix";

export interface ObjectCoords {
  x: number;
  y: number;
}

export interface AdditionalCoordsProperties {
  matrix: Matrix,
  teleportEnabled: boolean
};

export type ArrayCoords = [number, number];

export type MaybePartial<IsPartial extends boolean, T> = IsPartial extends true
  ? Partial<T> | undefined
  : T;

export class Coords<IsPartial extends boolean = false>
  implements Partial<ObjectCoords>
{
  public static from(
    coords: ObjectCoords | ArrayCoords,
    additional?: Partial<AdditionalCoordsProperties>
  ): Coords {
    return new Coords(
      ...(Array.isArray(coords) ? coords : <ArrayCoords>[coords.x, coords.y]),
      additional
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
    additional?: Partial<AdditionalCoordsProperties>
  ) {
    this._x = x;
    this._y = y;

    this._0 = x;
    this._1 = y;

    this._matrix = additional?.matrix;
    this.toggleTeleport(additional?.teleportEnabled);
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
    return new Coords(-x, -y, this.additionalProperties);
  }

  public copy() {
    return new Coords(this.x, this.y, this.additionalProperties);
  }

  public moveTo(direction: Directions): this {
    return this.summ(
      Coords.from(DIRECTIONS[direction], this.additionalProperties)
    )
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

    this.dangerousSetX(x);
    this.dangerousSetY(y);
    this.setMatrix(matrix);

    return this;
  }

  public copyAndSumm(coords: Coords<true> | Coords): Coords {
    const previous = this.getClearCoords();
    const current = coords.getClearCoords();

    return Coords.from(
      [previous.x + current.x, previous.y + current.y],
      coords.additionalProperties
    );
  }

  public summ(coords: Coords<true> | Coords): this {
    const previous = this.getClearCoords();
    const { x, y } = this.onCoordsChange(
      previous,
      previous.copyAndSumm(coords)
    );

    this.dangerousSetX(x);
    this.dangerousSetY(y);

    return this;
  }

  public setX(x: number): this {
    const previous = this.getClearCoords();
    const current = this.onCoordsChange(
      previous,
      Coords.from([x, previous.y], this.additionalProperties)
    );

    return this.dangerousSetX(current.x);
  }

  public setY(y: number): this {
    const previous = this.getClearCoords();
    const current = this.onCoordsChange(
      previous,
      Coords.from([previous.x, y], this.additionalProperties)
    );

    return this.dangerousSetY(current.y);
  }

  public dangerousSetX(x: number): this {
    this._x = x;
    this._0 = x;

    return this;
  }

  public dangerousSetY(y: number): this {
    this._y = y;
    this._1 = y;

    return this;
  }

  public setMatrix(martix: Matrix | undefined): this {
    this._matrix = martix;
    return this;
  }

  public getClearCoords(): Coords {
    return Coords.from([this.x || 0, this.y || 0], this.additionalProperties);
  }

  public getAdditionalProperties(): Partial<AdditionalCoordsProperties> {
    return {
      matrix: this.matrix,
      teleportEnabled: this.teleportEnabled
    };
  }

  public get additionalProperties(): Partial<AdditionalCoordsProperties> {
    return this.getAdditionalProperties();
  }

  public get teleportEnabled(): boolean {
    return this._teleport_enabled;
  }

  public get matrix(): Matrix | undefined {
    return this._matrix;
  }

  public set matrix(matrix: Matrix | undefined) {
    this.setMatrix(matrix);
  }

  public get 0(): MaybePartial<IsPartial, number> {
    return this._0;
  }

  public set 0(value: number) {
    this.setX(value);
  }

  public get 1(): MaybePartial<IsPartial, number> {
    return this._1;
  }

  public set 1(value: number) {
    this.setY(value);
  }

  public get x(): MaybePartial<IsPartial, number> {
    return this._x;
  }

  public set x(value: number) {
    this.setX(value);
  }

  public get y(): MaybePartial<IsPartial, number> {
    return this._y;
  }

  public set y(value: number) {
    this.setY(value);
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

    const position = matrix.getTeleportPosition(Coords.from([x, y], current.additionalProperties));

    if (position === null) {
      return current;
    }

    this.enableTeleport();
    this.dangerousSetX(position.x);
    this.dangerousSetY(position.y);

    return this;
  }
}

export default Coords;
