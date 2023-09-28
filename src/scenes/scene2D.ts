import {
    DefaultShader,
    Flatten,
    Repeat,
    Scene,
    cuboid,
    rads,
    rect2D,
    zeros,
} from 'webgl-engine';
import type { Obj3d } from 'webgl-engine';
import { DefaultShader2D } from '../shaders/default2DShader';

export const DefaultScene2D = new Scene<unknown>({
    title: 'Default Scene',
    shaders: [DefaultShader2D],
    once: (engine) => {},
    update: (time, engine) => {},
    init: (engine) => {
        engine.settings.fogColor = [1, 1, 1, 1];
        const { camera } = DefaultScene2D;
    },
    status: 'initializing',
});

const w = 200;
const h = 200;

const rectangle: Obj3d = {
    name: 'rectangle',
    vertexes: rect2D(w, h),
    colors: Flatten([
        [253, 231, 37],
        [253, 231, 37],
        [253, 231, 37],
        [255, 0, 128],
        [255, 0, 128],
        [255, 0, 128],
    ]),
    offsets: [-w / 2, -h / 2, 0],
    position: [200, 200, 0],
    rotation: [0, 0, 0],
    texture: {
        uri: 'assets/stick.png',
        enabled: true,
        repeat_horizontal: 'clamp_to_edge',
        repeat_vertical: 'clamp_to_edge',
    },
    texcoords: rect2D(1, 1),
    update: (time, engine) => {
        const { gl } = engine;
        rectangle.rotation[0] += rads(time / 20);
    },
};

DefaultScene2D.addObject(rectangle);
