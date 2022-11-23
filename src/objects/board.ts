import { Application, Container, Graphics } from "pixi.js";
export class Board extends Container {
    get foodLayer(): Container {
        return this._foodLayer;
    }
    private _app: Application;
    private _foodLayer: Container;
    constructor(app: Application) {
        super();
        this._app = app;
        this._foodLayer = new Container();
        this.init();
    }

    private init() {
        // region print #
        this.x = 0;
        this.y = 0;
        this.width = 10000;
        this.height = 10000;
        const g = new Graphics();
        const maxI = 10000 / 200;
        g.lineStyle(2, 0xffc2c2);
        for (let i = 0; i < maxI; i++) {
            g.moveTo(i * 200, 0);
            g.lineTo(i * 200, 10000);
            g.moveTo(0, i * 200);
            g.lineTo(10000, i * 200);
        }
        this.addChild(g);
        //end region
        this.addChild(this._foodLayer);
    }

    getFoodInRadius(): number {
        return this._foodLayer.children.length;
    }
}
//this.app?.stage.position.set(this.app.renderer.screen.width / 2, this.app.renderer.screen.height / 2);
//this.app?.stage.pivot?.set(this.snake.x, this.snake.y);
