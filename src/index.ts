import "fock-logger/config";
import { Colors } from "fock-logger";
import { emitKeypressEvents } from "readline";

import { Coords } from "@coords";
import { Vector2 } from "@coords";

import { AnimationFrame } from "@frame";
import { Matrix } from "@screen";
import { Screen } from "@screen";

import { DIRECTIONS } from "@utils";
import MatrixObject from "@object/index.object";

const VOID = Colors.bgBrightCyan + " " + Colors.reset;
const FILL = Colors.bgMagenta + " " + Colors.reset;

const matrix = new Matrix(5, 30, VOID);
const animationFrame = new AnimationFrame(100);

const drawCoords = new Coords([0, 0, 0], { matrix });
const drawCoords2 = new Coords([-1, 1, 0], { matrix });

/**
 * ДОБАВИТЬ ПОДДЕРЖКУ ЛИНЕЙНЫЕ ОБЪЕКТОВ (ЛО)
 * ЛО БУДЕТ БУДУТ ИМЕТЬ ГЛАВНЫЙ ЭЛЕМЕНТ, ЗА КОТОРЫМ БУДУТ ДВИГАТЬСЯ
 * ВСЕ ОСТАЛЬНЫЕ ЭЛЕМЕНТЫ
 */

/**
 *     +++++>
 * +++++
 * 
 * ---
 * 
 *     ++++++
 *  ++++    |
 */

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

drawCoords.enableTeleport();
drawCoords2.enableTeleport();
const object = matrix.createOneObject(drawCoords, FILL, true);
const object2 = matrix.createOneObject(drawCoords2, FILL, true);
const object3 = MatrixObject.createObjectByMatrix({
  matrix: [
    "+привет"
      .split("")
      .map((v) => Colors.red + Colors.bgBrightCyan + v + Colors.reset)
  ],
  fill: {
    air: VOID,
    void: VOID,
    center: Colors.red + Colors.bgBrightCyan + "+" + Colors.reset,
    defaultFill: VOID,
    elements: "привет"
      .split("")
      .map((v) => Colors.red + Colors.bgBrightCyan + v + Colors.reset)
  },
  config: {
    centerIsElement: false
  }
});

object3.center.setMatrix(matrix);
object3.center.enableTeleport();
object3.transformElements((elements) =>
  elements.map((element) => {
    element.coords.setMatrix(matrix);
    element.coords.enableTeleport();
    return element;
  })
);
matrix.createObject(object3);

matrix.drawObjects();

animationFrame.addEventListener("keypress", (data, key) => {
  const name = key.name?.toUpperCase();
  if (!name) {
    return;
  }

  const direction = (<Record<string, [number, number, number]>>DIRECTIONS)[
    name
  ];
  if (!direction) {
    return;
  }

  object.move(new Vector2(direction));
});

animationFrame.setRender(() => {
  animationFrame.prerender();

  object3.move(new Vector2(DIRECTIONS.RIGHT));

  // object.move(new Vector2(DIRECTIONS.RIGHT, DIRECTIONS.UP));
  // object2.move(new Vector2(DIRECTIONS.LEFT, DIRECTIONS.DOWN));

  return matrix.toString();
});

animationFrame.render(-1);

const screen = new Screen(
  matrix,
  {
    fill: {
      void: VOID,
      air: "AIR"
    }
  },
  animationFrame
);

screen.execute();
