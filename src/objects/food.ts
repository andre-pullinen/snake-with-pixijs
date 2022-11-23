import { Graphics } from "pixi.js";
import gsap from "gsap";
import _ from "lodash";

export class Food extends Graphics {
    private readonly _color: FoodColor;
    private readonly _size: number;
    private readonly _radius: number;
    constructor(size: number, color: FoodColor) {
        super();
        this._size = size;
        this._color = color;
        this._radius = 1.1 * size;
        gsap.to(this, { pixi: { scale: 1.05 }, yoyo: true, repeat: -1 });
        //gsap.ticker.add(this.animateSpawn);
        this.reDraw();
    }

    private reDraw() {
        this.clear();
        this.beginFill(this._color);
        this.drawCircle(30, 30, this._radius);
        this.endFill();
    }

    private animateSpawn() {
        // line below shows the problem
        if (this._radius < 1.1 * this._size) {
            console.log(this._radius);
        }
        //gsap.to(this, { _radius: 100 });
    }
    private animateStay() {
        //gsap.to(this, pixi: { scale: 0.5, yoyo: true, repeat: -1 });
    }
}

enum FoodColor {
    Red = 0x8b0000,
    Blue = 0x00bfff,
    Green = 0x006400,
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomValueFromEnum<E>(enumeration: { [s: string]: E } | ArrayLike<E>): E {
    return _.sample(Object.values(enumeration)) as E;
}

export function getRandomFood(): Food {
    return new Food(getRandomInt(15, 30), getRandomValueFromEnum(FoodColor) as FoodColor);
}
