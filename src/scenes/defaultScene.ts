import { DefaultShader, Flatten, Repeat, Scene, cuboid } from 'webgl-engine';
import type { Obj3d } from 'webgl-engine';

export const DefaultScene = new Scene<unknown>({
    title: 'Default Scene',
    shaders: [DefaultShader],
    once: (engine) => {},
    update: (time, engine) => {},
    init: (engine) => {
        engine.settings.fogColor = [1, 1, 1, 1];
        const { camera } = DefaultScene;

        camera.setZ(-600);
    },
    status: 'initializing',
});

// Add a cuboid
const cube: Obj3d = {
    name: 'cuboid',
    vertexes: cuboid(1, 1, 1),
    colors: Flatten([
        Repeat([253, 231, 37], 6),
        Repeat([122, 209, 81], 6),
        Repeat([34, 168, 132], 6),
        Repeat([42, 120, 142], 6),
        Repeat([65, 68, 135], 6),
        Repeat([68, 1, 84], 6),
    ]),
    scale: [50, 50, 50],
    offsets: [-25, -25, -25],
    position: [0, 0, 0],
    rotation: [0, 0, 0],

    update: (time, engine) => {
        cube.rotation[0] += 0.03;
        cube.rotation[2] -= 0.02;
    },
};

DefaultScene.addObject(cube);
DefaultScene.status = 'ready';
