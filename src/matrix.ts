import { Coords } from "./coords";
import Vector2 from "./vector2";

const NOT_POSITIVE_VALUE_ERROR =
  "Данное значение не может быть ниже нуля или равняться нулю";

export class Matrix {
  private _value: string[][];
  private _height: number;
  private _width: number;

  public constructor(
    height: number,
    width: number,
    public readonly fill: string = "#"
  ) {
    if (height <= 0) {
      throw new Error(NOT_POSITIVE_VALUE_ERROR);
    }

    if (width <= 0) {
      throw new Error(NOT_POSITIVE_VALUE_ERROR);
    }

    this._height = height;
    this._width = width;

    this._value = this.toArray();
  }

  public toString() {
    return this._value.map((v) => v.join("")).join("\n");
  }

  public toArray(): string[][] {
    return Array.from({ length: this._height }, () =>
      Array.from({ length: this._width }, () => this.fill)
    );
  }

  public at(coords: Coords) {
    const { x, y } = coords;
    return this._value[y][x];
  }

  public draw(coords: Coords, fill: string) {
    if (this.isOutOfBounds(coords)) {
      return this;
    }

    const { x, y } = coords;
    this._value[y][x] = fill;

    return this;
  }

  public drawMany(coords: Coords[], fill: string) {
    coords.forEach((value) => this.draw(value, fill));
    return this;
  }

  public move(vector2: Vector2): this {
    const element = this.at(vector2.start);

    this.draw(vector2.start, this.fill);
    this.draw(vector2.end, element);

    return this;
  }

  public isOutOfBoundsWithPositions(coords: Coords) {
    const { x, y } = coords;

    const xOutOfBounds = x < 0 || this._width  <= x;
    const yOutOfBounds = y < 0 || this._height <= y;

    return {
      xOutOfBounds,
      yOutOfBounds
    };
  }

  public isOutOfBounds(coords: Coords): boolean {
    const { xOutOfBounds, yOutOfBounds } =
      this.isOutOfBoundsWithPositions(coords);

    return xOutOfBounds || yOutOfBounds;
  }

  public getTeleportPosition(coords: Coords): Coords|null {
    const { xOutOfBounds, yOutOfBounds } =
      this.isOutOfBoundsWithPositions(coords);

    if (!xOutOfBounds && !yOutOfBounds) {
      return null;
    }

    const x = coords.x < 0 ? this._width  - 1 : 0;
    const y = coords.y < 0 ? this._height - 1 : 0;

    return Coords.from([x, y], coords.matrix).toggleTeleport(
      coords.teleportEnabled
    );
  }

  public setHeight(value: number) {
    return this.setValue("height", value);
  }

  public setWidth(value: number) {
    return this.setValue("width", value);
  }

  public set height(height: number) {
    this.setHeight(height);
  }

  public get height() {
    return this._height;
  }

  public set width(width: number) {
    this.setWidth(width);
  }

  public get width() {
    return this._width;
  }

  public get value(): string[][] {
    return this._value;
  }

  private setValue(type: "height" | "width", value: number) {
    if (value <= 0) {
      throw new Error(NOT_POSITIVE_VALUE_ERROR);
    }

    this[`_${type}`] = value;
    this._value = this.toArray();

    return this;
  }
}

export default Matrix;
