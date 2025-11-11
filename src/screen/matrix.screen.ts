import type { IMatrix, MatrixSize, MatrixValue } from "./types.screen";
import type { ICoords } from "@coords";
import type { Element } from "@object";

import { Coords } from "@coords";
import { MatrixObject } from "@object";

import { ERRORS } from "@errors";

export class Matrix {
  public static validateMatrixValue(value: MatrixValue): MatrixSize {
    const height = value.length;
    if (height <= 0) {
      throw new Error(ERRORS.NOT_POSITIVE_VALUE_ERROR);
    }

    const width = value[0].length;
    if (width <= 0) {
      throw new Error(ERRORS.NOT_POSITIVE_VALUE_ERROR);
    }

    const lengthSame = value.every((element) => element.length === width);
    if (!lengthSame) {
      throw new Error(ERRORS.NOT_EQUALS_ARRAY_LENGTH);
    }

    return {
      height,
      width
    };
  }

  public static from(value: IMatrix, fill: string): Matrix {
    if (value instanceof Matrix) {
      return value;
    }

    const size = this.validateMatrixValue(value);
    if (!size) {
      throw new Error(ERRORS.BAD_VALIDATION);
    }

    const matrix = new Matrix(size.height, size.width, fill);
    matrix.dangerousSetValue(value);

    return matrix;
  }

  private _value: MatrixValue;
  private _height: number;
  private _width: number;
  private _fill: string;

  private _objects: Map<number, MatrixObject[]> = new Map();

  public constructor(height: number, width: number, fill: string = "#") {
    if (height <= 0) {
      throw new Error(ERRORS.NOT_POSITIVE_VALUE_ERROR);
    }

    if (width <= 0) {
      throw new Error(ERRORS.NOT_POSITIVE_VALUE_ERROR);
    }

    this._height = height;
    this._width = width;

    this._fill = fill;

    this._value = this.getClearMatrix();
  }

  public toString() {
    this.clear();
    this.drawObjects();

    return this._value
      .map((_, i, arr) => arr[arr.length - 1 - i].join(""))
      .join("\n");
  }

  public getClearMatrix(): MatrixValue {
    return Array.from({ length: this._height }, () =>
      Array.from({ length: this._width }, () => this.fill)
    );
  }

  public at(coords: ICoords) {
    const { x, y } = Coords.getXYZ(coords);
    return this._value[y][x];
  }

  public drawObjects() {
    const sortedObjects = this.getObjectSortedByZ();

    for (const objects of sortedObjects.values()) {
      for (const object of objects) {
        const elements = MatrixObject.resolveElementCoords(
          object.center,
          object.elements
        );
        this.drawElements(elements);
      }
    }

    return this;
  }

  public getObjectSortedByZ() {
    const entriesArray = Array.from(this._objects.entries());
    const sortedEntries = entriesArray.sort(([previous, _a], [current, _b]) => {
      return previous - current;
    });

    return new Map(sortedEntries);
  }

  public createOneObject(
    coords: ICoords,
    fill: string,
    teleportEnabled?: boolean
  ): MatrixObject {
    const object = new MatrixObject({
      center: Coords.from(coords, { matrix: this, teleportEnabled }),
      defaultFill: fill,
      elements: [
        Coords.from([0, 0, 0], {
          matrix: this,
          teleportEnabled
        })
      ]
    });

    this.addObject(object);

    return object;
  }

  public createObject(object: MatrixObject): this {
    return this.addObject(object);
  }

  public drawElement(element: Element) {
    return this.draw(element.coords, element.fill);
  }

  public drawElements(elements: Element[]) {
    elements.forEach((element) => this.drawElement(element));
    return this;
  }

  /** @deprecated */
  public draw(coords: ICoords, fill: string) {
    const resolvedCoords = Coords.from(coords);
    if (this.isOutOfBounds(resolvedCoords)) {
      return this;
    }

    const { x, y } = resolvedCoords;
    this._value[y][x] = fill;

    return this;
  }

  /** @deprecated */
  public drawMany(coords: ICoords[], fill: string) {
    coords.forEach((value) => this.draw(value, fill));
    return this;
  }

  public isOutOfBoundsWithPositions(coords: ICoords) {
    const { x, y } = Coords.getXYZ(coords);

    const xOutOfBounds = x < 0 || this._width <= x;
    const yOutOfBounds = y < 0 || this._height <= y;

    return {
      xOutOfBounds,
      yOutOfBounds
    };
  }

  public isOutOfBounds(coords: ICoords): boolean {
    const { xOutOfBounds, yOutOfBounds } =
      this.isOutOfBoundsWithPositions(coords);

    return xOutOfBounds || yOutOfBounds;
  }

  public getTeleportPositionX(x: number, xOutOfBounds: boolean): number {
    if (!xOutOfBounds) {
      return x;
    }

    return x < 0 ? this._width - 1 : 0;
  }

  public getTeleportPositionY(y: number, yOutOfBounds: boolean): number {
    if (!yOutOfBounds) {
      return y;
    }

    return y < 0 ? this._height - 1 : 0;
  }

  public getTeleportPosition(coords: Coords): Coords | null {
    const { xOutOfBounds, yOutOfBounds } =
      this.isOutOfBoundsWithPositions(coords);

    if (!xOutOfBounds && !yOutOfBounds) {
      return null;
    }

    const x = this.getTeleportPositionX(coords.x, xOutOfBounds);
    const y = this.getTeleportPositionY(coords.y, yOutOfBounds);

    return Coords.from([x, y, coords.z], coords.additionalProperties);
  }

  public setHeight(value: number) {
    return this.setValue("height", value);
  }

  public setWidth(value: number) {
    return this.setValue("width", value);
  }

  public dangerousSetValue(value: MatrixValue) {
    this._value = value;
    return this;
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

  public get value(): MatrixValue {
    return this._value;
  }

  public set fill(fill: string) {
    this.setFill(fill);
  }

  public get fill(): string {
    return this._fill;
  }

  public get [Symbol.iterator]() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    return function* () {
      for (const y in context._value) {
        for (const x in context._value[y]) {
          const coords = Coords.from([+x, +y, 0]);
          const element = context.at(coords);

          yield {
            coords,
            element
          };
        }
      }

      return;
    };
  }

  private setValue(type: "height" | "width", value: number) {
    if (value <= 0) {
      throw new Error(ERRORS.NOT_POSITIVE_VALUE_ERROR);
    }

    this[`_${type}`] = value;
    this._value = this.getClearMatrix();

    return this;
  }

  private addObject(object: MatrixObject): this {
    const existed = this._objects.get(object.zIndex) || [];
    this._objects.set(object.zIndex, [...existed, object]);
    return this;
  }

  private clear() {
    return this.dangerousSetValue(this.getClearMatrix());
  }
}

export default Matrix;
