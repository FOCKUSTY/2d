import "fock-logger/config";
import { Colors } from "fock-logger";

import { DIRECTIONS } from "./directions";

import Coords from "./coords";
import AnimationFrame from "./frame";
import Matrix from "./matrix";
import Vector2 from "./vector2";

import Screen from "./screen";
import MatrixObject from "./object";

const VOID = Colors.bgBrightCyan + " " + Colors.reset;
const FILL = Colors.bgMagenta + " " + Colors.reset;

const matrix = new Matrix(5, 30, VOID);
const animationFrame = new AnimationFrame(30);

const drawCoords = new Coords(0, 0, {matrix});
const drawCoords2 = new Coords(-1, 1, {matrix});

/**
 * ДОБАВИТЬ ПОДДЕРЖКУ ДЛИННЫЙ СИМВОЛОВ (FILL)
 * ДОБАВИТЬ ПОДДЕРЖКУ ТЕКСТА
 */

// animationFrame.setPrerender(() => null);

drawCoords.enableTeleport();
drawCoords2.enableTeleport();
matrix.draw(drawCoords, FILL);

const object = MatrixObject.createObjectByMatrix({
  matrix: [
    [VOID,VOID,VOID],
    ["-","+","-"],
    [VOID,VOID,VOID],
  ],
  fill: {
    air: "AIR",
    center: "+",
    elements: ["-"],
    void: VOID,
    defaultFill: VOID
  },
  config: {
    centerIsElement: true,
    centerFillReplaceString: "-"
  }
});

animationFrame.setRender(() => {
  const vector2 = new Vector2(drawCoords, Coords.summ(DIRECTIONS.RIGHT));
  matrix.move(vector2);
  
  return matrix.toString();
});

const screen = new Screen(matrix, {
  fill: {
    void: VOID,
    air: "NULL"
  },
}, animationFrame);

// screen.execute();
