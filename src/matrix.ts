import { Coords } from "./coords";
import Vector2 from "./vector2";

const NOT_POSITIVE_VALUE_ERROR =
  "Данное значение не может быть ниже нуля или равняться нулю";

export class Matrix {
  private _value: string[][];
  private _height: number;
  private _width: number;
  private _fill: string;

  public constructor(
    height: number,
    width: number,
    fill: string = "#"
  ) {
    if (height <= 0) {
      throw new Error(NOT_POSITIVE_VALUE_ERROR);
    }

    if (width <= 0) {
      throw new Error(NOT_POSITIVE_VALUE_ERROR);
    }

    this._height = height;
    this._width = width;

    this._fill = fill;

    this._value = this.toArray();
  }

  public toString() {
    return this._value.map((_, i, arr) => arr[arr.length-1-i].join("")).join("\n");
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
    const element = this.at(vector2.current);

    this.draw(vector2.current, this._fill);
    vector2.execute();
    this.draw(vector2.current, element);

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

  public getTeleportPositionX(x: number, xOutOfBounds: boolean): number {
    if (!xOutOfBounds) {
      return x;
    }

    return x < 0 ? this._width  - 1 : 0;
  }

  public getTeleportPositionY(y: number, yOutOfBounds: boolean): number {
    if (!yOutOfBounds) {
      return y;
    }

    return y < 0 ? this._width  - 1 : 0;
  }

  public getTeleportPosition(coords: Coords): Coords|null {
    const { xOutOfBounds, yOutOfBounds } =
      this.isOutOfBoundsWithPositions(coords);

    if (!xOutOfBounds && !yOutOfBounds) {
      return null;
    }

    const x = this.getTeleportPositionX(coords.x, xOutOfBounds);
    const y = this.getTeleportPositionY(coords.y, yOutOfBounds);

    return Coords.from([x, y], coords.additionalProperties);
  }

  public setHeight(value: number) {
    return this.setValue("height", value);
  }

  public setWidth(value: number) {
    return this.setValue("width", value);
  }

  public setFill(fill: string) {
    /**
     * ДОБАВИТЬ onFillChange
     */
    this._fill = fill;
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

  public set fill(fill: string) {
    this.setFill(fill);
  }

  public get fill(): string {
    return this._fill;
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
