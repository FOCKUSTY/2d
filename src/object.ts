import Coords, { ArrayCoords, ICoords } from "./coords";
import Counter from "./counter";
import Matrix, { IMatrix } from "./matrix";
import Vector2 from "./vector2";

const idCounter = new Counter();

export interface IElement {
  coords: Coords;
  fill: string;
}

export class Element {
  private _coords: Coords;

  public constructor(
    coords: ICoords,
    public readonly fill: string
  ) {
    this._coords = Coords.from(coords);
  }

  public move(vector2: Vector2) {
    this._coords = vector2.execute(this.coords);
    return this;
  }

  public get coords(): Coords {
    return this._coords;
  }
}

export type Fill = {
  center: string;
  elements: string[];
  void: string;
  air: string;
};

export type Config = {
  centerIsElement: boolean;
  centerFillReplaceString: string;
};

export type MartixObjectConstructorParameters = {
  center: ICoords;
  defaultFill: string;
  zIndex?: number;
  elements?: (Element | ICoords)[];
};

export class MatrixObject {
  public static resolvePartialElements(
    fill: string,
    elements?: (ICoords | Element)[]
  ): Element[] {
    if (!elements) {
      return [];
    }

    return elements.map((element) => {
      if (element instanceof Coords) {
        return new Element(element, fill);
      }

      if (element instanceof Element) {
        return element;
      }

      return new Element(Coords.from(element), fill);
    });
  }

  public static getElementsAndCenterByMatrixWithoutOffset({
    matrix,
    fill,
    config
  }: {
    matrix: IMatrix;
    fill: Fill;
    config?: Partial<Config>;
  }): { elements: Element[]; center: Coords } {
    const resolvedMatrix = Matrix.from(matrix, fill.void);

    const elements: Element[] = [];
    let center: Coords | null = null;

    const pushMatrixElement = (coords: Coords, fill: string) => {
      const element = new Element(coords, fill);
      elements.push(element);
    };

    for (const data of resolvedMatrix) {
      const { coords, element } = data;
      const isAirOrVoid = element === fill.air || element === fill.void;

      if (isAirOrVoid) {
        continue;
      }

      if (fill.elements.includes(element)) {
        pushMatrixElement(coords, element);
      }

      if (element === fill.center) {
        if (config?.centerIsElement) {
          pushMatrixElement(coords, config.centerFillReplaceString || element);
        }

        center = coords;
      }
    }

    if (center === null) {
      throw new Error("Cannot find center");
    }

    return {
      elements,
      center
    };
  }

  public static getElementsAndCenterByMatrixWithOffset({
    matrix,
    fill,
    config
  }: {
    matrix: IMatrix;
    fill: Fill;
    config?: Partial<Config>;
  }): { elements: Element[]; center: Coords } {
    const { elements: elementsWithoutOffset, center } =
      this.getElementsAndCenterByMatrixWithoutOffset({ matrix, fill, config });

    const elements = elementsWithoutOffset.map((element) => {
      const coords = element.coords.subtract(center);

      return new Element(coords, element.fill);
    });

    return {
      elements,
      center
    };
  }

  public static createObjectByMatrix({
    matrix,
    fill,
    config
  }: {
    matrix: IMatrix;
    fill: Fill & { defaultFill: string };
    config?: Partial<Config>;
  }): MatrixObject {
    const { elements, center } = this.getElementsAndCenterByMatrixWithOffset({
      matrix,
      fill,
      config
    });

    return new MatrixObject({
      center: center,
      defaultFill: fill.defaultFill,
      elements
    });
  }

  public static resolveElementCoords(center: Coords, elements: Element[]) {
    return elements.map((element) => {
      const coords = element.coords.copyAndSumm(center);
      return new Element(coords, element.fill);
    });
  }

  private _center: Coords;
  private _elements: Element[];
  private _default_fill: string;
  private _z_index: number;
  public readonly id: number;

  /**
   * @param center начало отчёта элементов
   * @param defaultFill заполнитель для элементов
   * @param elements элементы (их координаты назначаются относительно начала отчёта)
   *
   * @example
   * ```ts
   * new MartixObject(
   *   Coords.from([5, 5]),
   *   "#", [
   *     [0, 0],
   *     [0, 1]
   *   ]
   * ).toElements()
   * // вернёт:
   * // Element { coords: Coords { x: 5, y: 5, ... }, fill: "#" }
   * // Element { coords: Coords { x: 5, y: 6, ... }, fill: "#" }
   * ```
   */
  public constructor({
    center,
    defaultFill,
    elements,
    zIndex = 0
  }: MartixObjectConstructorParameters) {
    this._center = Coords.from(center);
    this._default_fill = defaultFill;
    this._elements = MatrixObject.resolvePartialElements(defaultFill, elements);
    this._z_index = zIndex;

    this.id = idCounter.execute();
  }

  public move(vector2: Vector2): Coords {
    return this._center.move(vector2);
  }

  public transformElements(callback: (elements: Element[]) => Element[]): this {
    this._elements = callback([...this._elements]);
    return this;
  }

  public setCenter(coords: Coords): this {
    this._center = coords;
    return this;
  }

  public setDefaultFill(fill: string): this {
    this._default_fill = fill;
    return this;
  }

  public setZIndex(zIndex: number): this {
    this._z_index = zIndex;
    return this;
  }

  public getCenter(): Coords {
    return this._center;
  }

  public getZIndex(): number {
    return this._z_index;
  }

  public getElements(): Element[] {
    return this._elements;
  }

  public getDefaultFill(): string {
    return this._default_fill;
  }

  public set center(coords: Coords) {
    this.setCenter(coords);
  }

  public set defaultFill(fill: string) {
    this.setDefaultFill(fill);
  }

  public set zIndex(zIndex: number) {
    this.setZIndex(zIndex);
  }

  public get zIndex(): number {
    return this.getZIndex();
  }

  public get center(): Coords {
    return this.getCenter();
  }

  public get elements(): Element[] {
    return this.getElements();
  }

  public get defaultFill(): string {
    return this.getDefaultFill();
  }
}

export default MatrixObject;
