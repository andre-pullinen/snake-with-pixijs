import gsap from "gsap";
import { Scene } from "pixi-scenes";
import { Text, TextStyle } from "pixi.js";

export default class MenuScene extends Scene {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private header: Text;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private keyToStart: Text;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private keydownHandler: (e) => void;

    public init(): void {
        if (this.app === null) return;
        const headerStyle = new TextStyle({
            fontFamily: "RubikGlitch",
            fontSize: 48,
        });
        this.header = new Text("SnakeIt", headerStyle);
        this.header.x = this.app.screen.width / 2;
        this.header.y = this.app.screen.height / 2;
        this.header.anchor.set(0.5);

        const keyToStartStyle = new TextStyle({
            fontFamily: "PressStart2P",
            fontSize: 16,
        });
        this.keyToStart = new Text("Press any key to start", keyToStartStyle);
        this.keyToStart.x = this.app.screen.width / 2;
        this.keyToStart.y = this.app.screen.height - 50;
        this.keyToStart.angle = -1.2;
        this.keyToStart.anchor.set(0.5);

        gsap.to(this.keyToStart, { alpha: 0.5, angle: 2.4, yoyo: true, repeat: -1 });
        this.addChild(this.header);
        this.addChild(this.keyToStart);
    }

    public start(): void {
        this.keydownHandler = (e) => this.onkeydownHandler(e);
        window.addEventListener("keydown", this.keydownHandler, false);
    }

    private onkeydownHandler(e: KeyboardEvent) {
        console.log(e, this);
        this.scenes?.start("game");
    }

    public stop() {
        window.removeEventListener("keydown", this.keydownHandler);
    }
}
