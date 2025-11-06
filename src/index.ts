import "fock-logger/config";
import { Colors } from "fock-logger";

import Coords from "./coords";
import AnimationFrame from "./frame";
import Matrix from "./matrix";

const VOID = Colors.bgBrightCyan + " " + Colors.reset;
const FILL = Colors.bgMagenta + " " + Colors.reset;

const matrix = new Matrix(10, 30, VOID);
const animationFrame = new AnimationFrame(20);

const drawCoords = new Coords(0, 0, matrix);

/**
 * ДОБАВИТЬ ПОДДЕРЖКУ ДЛИННЫЙ СИМВОЛОВ (FILL)
 * ДОБАВИТЬ ПОДДЕРЖКУ ТЕКСТА
 */

// animationFrame.setPrerender(() => null);

drawCoords.enableTeleport();

animationFrame.setRender(() => {
  matrix.draw(drawCoords, FILL);
  matrix.draw(drawCoords.copy().toLeft(), VOID);

  drawCoords.toRight();
  drawCoords.setMatrix(matrix);

  return matrix.toString();
});

animationFrame.execute();
