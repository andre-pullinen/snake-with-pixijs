import gsap from "gsap";
import { Scene } from "pixi-scenes";
import { Graphics, InteractionEvent, Point, Text, TextStyle } from "pixi.js";
import { snake, points, ropeLength } from "../objects/snake";
import { Board } from "../objects/board";
import { getRandomFood } from "../objects/food";

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
    private historyMouseX: number[];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private historyMouseY: number[];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private mousePosition: MousePosition;
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
        this.historyMouseX = [];
        this.historyMouseY = [];
        const scoreStyle = new TextStyle({
            fontFamily: "RubikMonoOne",
            fontSize: 16,
        });
        this.board = new Board(this.app);
        this.mousePosition = new Point(0, 0);
        this.score = new Text(`Your score: ${this.count}`, scoreStyle);
        this.score.x = 5;
        this.score.y = 10;

        //gsap.to(this.keyToStart, { alpha: 0.5, angle: 2.4, yoyo: true, repeat: -1 });

        this.snake = snake;
        this.snakeDebug = new Graphics();
        this.addChild(this.board);
        this.addChild(this.score);
        this.board.addChild(this.snake);
        this.board.addChild(this.snakeDebug);
        //this.snakeDebug.x = points[points.length - 1].x - ropeLength * 20;
        //this.snakeDebug.y = points[points.length - 1].y;
        // this.app.ticker.add(() => {
        // });
    }

    public start(): void {
        this.app?.stage.on("mousemove", (e) => this.onmousemoveHandler(e));
        window.addEventListener("keydown", this.onkeydownHandler, false);
        //window.addEventListener("mousemove", (e) => this.onmousemoveHandler(e));
    }

    private onkeydownHandler(e: KeyboardEvent) {
        console.log(e);
    }

    private onmousemoveHandler(e: InteractionEvent) {
        this.mousePosition = e.data.getLocalPosition(this.board);
        this.historyMouseX.push(this.mousePosition.x);
        this.historyMouseY.push(this.mousePosition.y);
        if (this.historyMouseX.length > ropeLength) {
            this.historyMouseX.shift();
        }
        if (this.historyMouseY.length > ropeLength) {
            this.historyMouseY.shift();
        }
    }

    private isInRadius(radius = 50) {
        return (
            Math.sqrt(
                Math.pow(points[points.length - 1].x - this.mousePosition.x, 2) +
                    Math.pow(points[points.length - 1].y - this.mousePosition.y, 2),
            ) < radius
        );
    }

    public stop() {
        window.removeEventListener("keydown", this.onkeydownHandler);
    }

    public update(delta: number) {
        if (this.snake === null) return;
        if (this.mousePosition === undefined) return;
        this.count += 0.1;
        //const pointSnake = new Point(this.snake.x, this.snake.y);
        const pointOfMouse = this.app.renderer.plugins.interaction.mouse.getLocalPosition(this.board);
        const pointOfHead = pointOfMouse.subtract(points[points.length - 1]).normalize();
        points[points.length - 1] = points[points.length - 1].add(pointOfHead);
        // snake.x = points[points.length - 1].x;
        // snake.y = points[points.length - 1].y;
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
        // const angle = (anchor: IPoint, point: MousePosition) =>
        //     (Math.atan2(anchor.y - point.y, anchor.x - point.x) * 180) / Math.PI + 180;
        // const toAngle = angle(this.snake.position, this.mousePosition);
        // this.snake.angle = toAngle;

        if (this.isInRadius(50)) {
            this.snake.speed = 0;
        } else {
            this.snake.speed = 1;
        }
        // if (this.snake.speed > 0) {
        //     const pointToMove = this.mousePosition
        //         .subtract(points[points.length - 1])
        //         .normalize()
        //         .multiplyScalar(this.snake.speed);
        //
        //     points[points.length - 1] = points[points.length - 1].add(pointToMove);
        // }
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

    private cubicInterpolation(array: number[], t: number, tangentFactor: number | null) {
        if (tangentFactor == null) tangentFactor = 1;

        const k = Math.floor(t);
        const m = [this.getTangent(k, tangentFactor, array), this.getTangent(k + 1, tangentFactor, array)];
        const p = [this.clipInput(k, array), this.clipInput(k + 1, array)];
        t -= k;
        const t2 = t * t;
        const t3 = t * t2;
        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
    }

    private getAcceleration() {
        return 0;
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
            const randomPoint = this.getRandomPointInRadius(points[points.length - 1], 400);
            const food = getRandomFood();
            food.position.set(randomPoint.x, randomPoint.y);
            this.board.foodLayer.addChild(food);
        }
    }
}
