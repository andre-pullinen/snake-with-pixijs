import { Graphics, InteractionEvent, Point, Text, TextStyle } from "pixi.js";
import { Scene } from "pixi-scenes";

import { Board } from "../objects/board";
import { getRandomFood } from "../objects/food";
import { points, ropeLength, snake } from "../objects/snake";

interface MousePosition extends Point {
    x: number;
    y: number;
}

export default class GameScene extends Scene {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private score: Text;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private snake: any;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private snakeDebug: Graphics;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private board: Board;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private count: number;

    public init(): void {
        if (this.app === null) return;
        this.count = 0;
        const scoreStyle = new TextStyle({
            fontFamily: "RubikMonoOne",
            fontSize: 16,
        });
        this.board = new Board(this.app); // создания игрового поля
        this.score = new Text(`Your score: ${this.count}`, scoreStyle);
        this.score.x = 5;
        this.score.y = 10;

        //gsap.to(this.keyToStart, { alpha: 0.5, angle: 2.4, yoyo: true, repeat: -1 });

        this.snake = snake;
        this.snakeDebug = new Graphics();
        this.addChild(this.board);
        this.addChild(this.score);
        this.board.addChild(this.snake);
        // this.board.addChild(this.snakeDebug); // СКЕЛЕТ
    }

    public start(): void {
        window.addEventListener("keydown", this.onkeydownHandler, false);
        //window.addEventListener("mousemove", (e) => this.onmousemoveHandler(e));
    }

    private onkeydownHandler(e: KeyboardEvent) {
        console.log(e);
    }

    public stop() {
        window.removeEventListener("keydown", this.onkeydownHandler);
    }

    public update(delta: number) {
        if (this.app === null) return;
        if (this.snake === null) return;
        // до 80 строки просчет движения змеи
        const pointOfMouse = this.app.renderer.plugins.interaction.mouse.getLocalPosition(this.board); // мышка
        const pointOfHead = pointOfMouse.subtract(points[points.length - 1]).normalize();
        points[points.length - 1] = points[points.length - 1].add(pointOfHead);

        for (let i = points.length - 1; i > 0; i--) {
            const segment = points[i];
            const nextSegment = points[i - 1];
            let pointOfSegment = segment.subtract(nextSegment).normalize();
            pointOfSegment = pointOfSegment.multiplyScalar(ropeLength);
            const vector = segment.subtract(pointOfSegment);
            nextSegment.set(vector.x, vector.y);
        }

        this.snakeDebug.clear();
        this.snakeDebug.lineStyle(2, 0xffc2c2);
        this.snakeDebug.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            this.snakeDebug.lineTo(points[i].x, points[i].y);
        }

        for (let i = 1; i < points.length; i++) {
            this.snakeDebug.beginFill(0xff0022);
            this.snakeDebug.drawCircle(points[i].x, points[i].y, 10);
            this.snakeDebug.endFill();
        }

        this.updateFood();

        this.board.position.set(this.app.renderer.screen.width / 2, this.app.renderer.screen.height / 2);
        this.board.pivot?.set(points[points.length - 1].x, points[points.length - 1].y);
    }

    private clipInput(k: number, arr: number[]): number {
        if (k < 0) k = 0;
        if (k > arr.length - 1) k = arr.length - 1;
        return arr[k];
    }

    private getTangent(k: number, factor: number, array: number[]) {
        return (factor * (this.clipInput(k + 1, array) - this.clipInput(k - 1, array))) / 2;
    }

    private getRandomPointInRadius(center: Point, radius: number): Point {
        const ang = Math.random() * 2 * Math.PI,
            hyp = Math.sqrt(Math.random()) * radius,
            adj = Math.cos(ang) * hyp,
            opp = Math.sin(ang) * hyp;
        return new Point(center.x + adj, center.y + opp);
    }

    private readonly maxFoodCount = 50;

    private updateFood() {
        const foodInRadius = this.board.getFoodInRadius();
        if (foodInRadius > this.maxFoodCount) return;
        for (let i = foodInRadius; i < this.maxFoodCount; i++) {
            const randomPoint = this.getRandomPointInRadius(points[points.length - 1], 1000); // ранд точка
            const food = getRandomFood(); // ранд еда
            food.position.set(randomPoint.x, randomPoint.y);
            this.board.foodLayer.addChild(food);
        }
    }
}
