import { Point, Texture, SimpleRope, Sprite, IPoint, Container } from "pixi.js";

export interface ISnake extends Container {
    speed: number | undefined;
}

// build a rope!
export const ropeLength = 918 / 40;

export const points: Point[] = [];

for (let i = 0; i < 40; i++) {
    points.push(new Point(i * ropeLength, 0));
}

const strip = new SimpleRope(Texture.from("./assets/snake.png"), points);

strip.x = 0;
strip.y = 0;
export const snake = strip;

// const snakeSprite = new Container();
// snakeSprite.x = 400;
// snakeSprite.y = 300;
//
// snakeSprite.scale.set(800 / 1900);
// snakeSprite.addChild(strip);
//
// export const snake = snakeSprite;

// app.ticker.add(() => {
//     count += 0.1;
//
//     // make the snake
//     for (let i = 0; i < points.length; i++) {
//         points[i].y = Math.sin(i * 0.5 + count) * 30;
//         points[i].x = i * ropeLength + Math.cos(i * 0.3 + count) * 20;
//     }
// });
