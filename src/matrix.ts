import { Coords } from "./coords";
import Vector2 from "./vector2";

const NOT_POSITIVE_VALUE_ERROR = "Данное значение не может быть ниже нуля или равняться нулю";

export class Matrix {
  public static resolveCoords(coords: Coords) {
    return Array.isArray(coords)
      ? { x: coords[0], y: coords[1] }
      : coords;
  }

  private _value: string[][];

  public constructor(
    private _height: number,
    private _width: number,
    public readonly fill: string = "#",
  ) {
    if (_height <= 0) {
      throw new Error(NOT_POSITIVE_VALUE_ERROR);
    }

    if (_width <= 0) {
      throw new Error(NOT_POSITIVE_VALUE_ERROR);
    }

    this._value = this.toArray();
  }

  public toString() {
    return this._value.map(v => v.join("")).join("\n");
  }

  public toArray(): string[][] {
    return Array.from({ length: this._height }, () =>
      Array.from({ length: this._width }, () => this.fill)
    );
  }

  public at(coords: Coords) {
    const { x, y } = Matrix.resolveCoords(coords);
    return this._value[y][x];
  }

  public draw(coords: Coords, fill: string) {
    const { x, y } = Matrix.resolveCoords(coords);
    this._value[y][x] = fill;
  }

  public move(vector2: Vector2) {
    const element = this.at(vector2.start);
    
    this.draw(vector2.start, this.fill);
    this.draw(vector2.end, element);

    return vector2.end;
  };

  public setHeight(value: number) {
    return this.setValue("height", value);
  }

  public setWidth(value: number) {
    return this.setValue("width", value);
  }

  private setValue(type: "height"|"width", value: number) {
    if (value <= 0) {
      throw new Error(NOT_POSITIVE_VALUE_ERROR);
    }

    this[`_${type}`] = value;
    this._value = this.toArray();

    return this;
  }

  public get height() {
    return this._height;
  }

  public get width() {
    return this._width;
  }
}

export default Matrix;
