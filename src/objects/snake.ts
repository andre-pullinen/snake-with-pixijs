import { Point, SimpleRope, Texture } from "pixi.js";

export const ropeLength = 918 / 40; // размер куска - Дл.карт / кол-во частей

export const points: Point[] = [];

for (let i = 0; i < 40; i++) {
    points.push(new Point(i * ropeLength, 0));
}

const strip = new SimpleRope(Texture.from("./assets/snake.png"), points);

strip.x = 0;
strip.y = 0;

export const snake = strip;
