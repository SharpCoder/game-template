import './app.css';
import App from './App.svelte';
import { Engine } from 'webgl-engine';
import { DefaultScene } from './scenes/defaultScene';
import { DefaultScene2D } from './scenes/scene2D';

const engine = new Engine();

// @ts-ignore
window['gameEngine'] = engine;

// TODO: Manage scenes
engine.addScene(DefaultScene2D);
engine.addScene(DefaultScene);

function draw() {
    engine.draw();
    requestAnimationFrame(draw.bind(engine));
}

function update() {
    engine.update();
    requestAnimationFrame(update.bind(engine));
}

draw();
update();

const app = new App({
    target: document.getElementById('app') ?? document.createElement('div'),
});

export default app;
