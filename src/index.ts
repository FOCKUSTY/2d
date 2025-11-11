import "fock-logger/config";
import { Colors } from "fock-logger";
import { emitKeypressEvents } from "readline";

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

import { DIRECTIONS } from "./directions";

import Coords from "./coords";
import AnimationFrame from "./frame";
import Matrix from "./matrix";
import Vector2 from "./vector2";

import Screen from "./screen";
import Keyboard from "./keyboard";

const VOID = Colors.bgBrightCyan + " " + Colors.reset;
const FILL = Colors.bgMagenta + " " + Colors.reset;

const matrix = new Matrix(5, 30, VOID);
const animationFrame = new AnimationFrame(30);

const drawCoords = new Coords([0, 0, 0], { matrix });
const drawCoords2 = new Coords([-1, 1, 0], { matrix });

/**
 * ДОБАВИТЬ ПОДДЕРЖКУ ДЛИННЫЙ СИМВОЛОВ (FILL)
 * ДОБАВИТЬ ПОДДЕРЖКУ ТЕКСТА
 *
 * НЕ ЗАБЫТЬ СДЕЛАТЬ ПЕРЕМЕЩЕНИЕ ОБЪЕКТА
 * ГЛАВНАЯ ИДЕЯ МАТРИЦЫ: СДЕЛАТЬ ВИРТУАЛЬНЫЕ ЭЛЕМЕНТЫ, КОТОРЫЕ
 * РАСПОГАЮТСЯ ПО Z КООРДИНАТЕ, ЧТОБЫ МОЖНО БЫЛО ЛЕГЧЕ ОТРИСОВЫВАТЬ
 * ЭЛЕМЕНТЫ
 */

drawCoords.enableTeleport();
drawCoords2.enableTeleport();
const object = matrix.createOneObject(drawCoords, FILL, true);
const object2 = matrix.createOneObject(drawCoords2, FILL, true);

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

  // object.move(new Vector2(DIRECTIONS.RIGHT, DIRECTIONS.UP));
  object2.move(new Vector2(DIRECTIONS.LEFT, DIRECTIONS.DOWN));

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
