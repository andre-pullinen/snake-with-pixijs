import * as PIXI from "pixi.js";
import { Application, Loader, Texture, AnimatedSprite } from "pixi.js";
import { SceneManager } from "pixi-scenes";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import "./style.css";
import { gsap } from "gsap";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/GameScene";
declare const VERSION: string;
import "@pixi/math-extras";
import { PixiPlugin } from "gsap/PixiPlugin";

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

Loader.registerPlugin(WebfontLoaderPlugin);

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    resizeCanvas();

    const scenes = new SceneManager(app);
    scenes.add("menu", new MenuScene());
    scenes.add("game", new GameScene());
    scenes.start("menu");

    app.stage.interactive = true;
    app.stage.hitArea = app.screen;
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("rabbit", "./assets/simpleSpriteSheet.json");
        loader.add("pixie", "./assets/spine-assets/pixie.json");
        loader.add({ name: "PressStart2P", url: "./assets/fonts/PressStart2P-Regular.ttf" });
        loader.add({ name: "RubikGlitch", url: "./assets/fonts/RubikGlitch-Regular.ttf" });
        loader.add({ name: "RubikMonoOne", url: "./assets/fonts/RubikMonoOne-Regular.ttf" });

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}

function getBird(): AnimatedSprite {
    const bird = new AnimatedSprite([
        Texture.from("birdUp.png"),
        Texture.from("birdMiddle.png"),
        Texture.from("birdDown.png"),
    ]);

    bird.loop = true;
    bird.animationSpeed = 0.1;
    bird.play();
    bird.scale.set(3);

    return bird;
}
