// @ts-nocheck

import { m3, type ProgramTemplate } from 'webgl-engine';

const default2DVertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;

    uniform mat3 u_proj;
    uniform mat3 u_mat;

    varying vec4 v_color;
    varying vec2 v_texcoord;

    void main() {
        gl_Position = vec4(vec3(u_proj * u_mat * vec3(a_position, 1)).xy, 0, 1);
        v_color = a_color;
    }
`;

const default2DFragmentShader = `
    precision mediump float;
    varying vec4 v_color;
    
    void main() {
        gl_FragColor = v_color;
    }
`;

const gl = document.createElement('canvas').getContext('webgl');
export const DefaultShader2D: ProgramTemplate = {
    name: 'default',
    order: 0,
    objectDrawArgs: {
        components: 2,
        depthFunc: gl?.LESS,
        mode: gl?.TRIANGLES,
    },
    vertexShader: default2DVertexShader,
    fragmentShader: default2DFragmentShader,
    attributes: {
        a_color: {
            components: 3,
            type: gl?.UNSIGNED_BYTE,
            normalized: true,
            generateData: (engine) => {
                return new Uint8Array(engine.activeScene.colors);
            },
        },
        a_position: {
            components: 2,
            type: gl?.FLOAT,
            normalized: false,
            generateData: (engine) => {
                return new Float32Array(engine.activeScene.vertexes);
            },
        },
    },
    staticUniforms: {
        u_proj: (engine, loc) => {
            const { gl } = engine;
            gl.uniformMatrix3fv(
                loc,
                false,
                m3.projection(gl.canvas.width, -gl.canvas.height)
            );
        },
    },
    dynamicUniforms: {
        u_mat: (engine, loc, obj) => {
            const { gl } = engine;

            gl.uniformMatrix3fv(
                loc,
                false,
                m3.combine([
                    m3.translate(obj.position[0], -obj.position[1]),
                    m3.rotate(obj.rotation[0], obj.rotation[1]),
                    m3.scale(
                        obj.scales?.[0] ?? 1,
                        obj.scales?.[1] ?? 1,
                        obj.scales?.[2] ?? 1
                    ),
                    m3.translate(
                        obj.offsets[0],
                        obj.offsets[1],
                        obj.offsets[2]
                    ),
                ])
            );
        },
    },
};
