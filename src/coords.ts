import { DIRECTIONS, Directions } from "./directions";
import Matrix from "./matrix";
import Vector2 from "./vector2";

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

export class Coords implements Partial<ObjectCoords> {
  public static from(
    coords: ICoords,
    additional?: Partial<AdditionalCoordsProperties>
  ): Coords {
    if (coords instanceof Coords) {
      return coords;
    }

    return new Coords(
      Array.isArray(coords)
        ? coords
        : <ArrayCoords>[coords.x, coords.y, coords.z],
      additional
    );
  }

  public static getXYZ(coords: ICoords): ObjectCoords {
    return Array.isArray(coords)
      ? { x: coords[0], y: coords[1], z: coords[2] }
      : coords;
  }

  public static summ(...coords: (Coords | ObjectCoords | ArrayCoords)[]) {
    return coords.reduce((previous, current) => {
      const previousCoords =
        previous instanceof Coords ? previous : Coords.from(previous);

      const currentCoords =
        current instanceof Coords ? current : Coords.from(current);

      return previousCoords.summ(currentCoords);
    });
  }

  private _0: number;
  private _1: number;
  private _2: number;
  private _x: number;
  private _y: number;
  private _z: number;

  private _matrix?: Matrix;
  private _teleport_enabled: boolean = false;

  public constructor(
    coords: ArrayCoords | ObjectCoords,
    additional?: Partial<AdditionalCoordsProperties>
  ) {
    const { x, y, z } = Coords.getXYZ(coords);

    this._x = x;
    this._y = y;
    this._z = z;

    this._0 = x;
    this._1 = y;
    this._2 = z;

    this._matrix = additional?.matrix;
    this.toggleTeleport(additional?.teleportEnabled);
  }

  public toggleTeleport(state?: boolean): this {
    if (!state) {
      this._teleport_enabled = false;
      return this;
    }

    if (!this._matrix) {
      throw new Error("Matrix not found");
    }

    this._teleport_enabled = true;
    const coords = this._matrix.getTeleportPosition(this);

    if (coords === null) {
      return this;
    }

    return this.set(coords);
  }

  public enableTeleport(): this {
    return this.toggleTeleport(true);
  }

  public disableTeleport(): this {
    return this.toggleTeleport(false);
  }

  public inverse(): Coords {
    const { x, y, z } = this;
    return new Coords([-x, -y, -z], this.additionalProperties);
  }

  public copy() {
    return new Coords([this.x, this.y, this.z], this.additionalProperties);
  }

  public moveTo(direction: Directions): this {
    return this.summ(
      Coords.from(DIRECTIONS[direction], this.additionalProperties)
    );
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

  public move(vector2: Vector2): this {
    return this.set(vector2.execute(this));
  }

  public set(coords: Coords): this {
    this.onCoordsChange(this, coords);

    return this;
  }

  public copyAndSubtract(coords: Coords): Coords {
    return Coords.from(
      [this.x - coords.x, this.y - coords.y, this.z - coords.z],
      coords.additionalProperties
    );
  }

  public copyAndSumm(coords: Coords): Coords {
    return Coords.from(
      [this.x + coords.x, this.y + coords.y, this.z - coords.z],
      coords.additionalProperties
    );
  }

  public subtract(coords: Coords): this {
    this.onCoordsChange(this, this.copyAndSubtract(coords));

    return this;
  }

  public summ(coords: Coords): this {
    this.onCoordsChange(this, this.copyAndSumm(coords));

    return this;
  }

  public setX(x: number): this {
    this.onCoordsChange(
      this,
      Coords.from([x, this.y, this.z], this.additionalProperties)
    );

    return this;
  }

  public setY(y: number): this {
    this.onCoordsChange(
      this,
      Coords.from([this.x, y, this.z], this.additionalProperties)
    );

    return this;
  }

  public setZ(z: number): this {
    this.onCoordsChange(
      this,
      Coords.from([this.x, this.y, z], this.additionalProperties)
    );

    return this;
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

  public dangerousSetZ(z: number): this {
    this._z = z;
    this._2 = z;

    return this;
  }

  public setMatrix(martix: Matrix | undefined): this {
    this._matrix = martix;
    return this;
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

  public get 0(): number {
    return this._0;
  }

  public set 0(value: number) {
    this.setX(value);
  }

  public get 1(): number {
    return this._1;
  }

  public set 1(value: number) {
    this.setY(value);
  }

  public get 2(): number {
    return this._2;
  }

  public set 2(value: number) {
    this.setZ(value);
  }

  public get x(): number {
    return this._x;
  }

  public set x(value: number) {
    this.setX(value);
  }

  public get y(): number {
    return this._y;
  }

  public set y(value: number) {
    this.setY(value);
  }

  public get z(): number {
    return this._z;
  }

  public set z(value: number) {
    this.setZ(value);
  }

  public get [Symbol.iterator]() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    return function* () {
      yield context.x;
      yield context.y;
      yield context.z;
      return;
    };
  }

  private handleTeleport(coords: Coords | this) {
    if (!this._teleport_enabled) {
      return coords;
    }

    const matrix = coords.matrix || this.matrix;
    if (!matrix) {
      throw new Error("Matrix not found, but teleport enabled");
    }

    const position = matrix.getTeleportPosition(coords);
    if (position === null) {
      return coords;
    }

    this.enableTeleport();
    this.dangerousSetX(position.x);
    this.dangerousSetY(position.y);
    this.dangerousSetZ(position.z);

    return this;
  }

  private onCoordsChange(previous: Coords, current: Coords): void {
    this.dangerousSetX(current.x);
    this.dangerousSetY(current.y);
    this.dangerousSetZ(current.z);

    if (current.matrix) {
      this.setMatrix(this.matrix);
    }

    this.handleTeleport(current);
  }
}

export default Coords;
