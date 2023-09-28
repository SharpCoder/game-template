// @ts-nocheck

import { m3, type ProgramTemplate } from 'webgl-engine';

const default2DVertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    attribute vec2 a_texcoord;

    uniform mat3 u_proj;
    uniform mat3 u_camera;
    uniform mat3 u_mat;

    varying vec4 v_color;
    varying vec2 v_texcoord;

    void main() {
        gl_Position = vec4(vec3(u_proj * u_camera * u_mat * vec3(a_position, 1)).xy, 0, 1);
        v_color = a_color;
        v_texcoord = vec2(a_texcoord.x, 1.0 - a_texcoord.y);
    }
`;

const default2DFragmentShader = `
    precision mediump float;
    varying vec4 v_color;
    varying vec2 v_texcoord;
    
    // The texture
    uniform sampler2D u_texture;
    uniform bool u_showtex;

    void main() {
        if (u_showtex) {
            gl_FragColor = texture2D(u_texture, v_texcoord);
        } else {
            gl_FragColor = v_color;
        }
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
        a_texcoord: {
            components: 2,
            type: gl?.FLOAT,
            normalized: false,
            generateData: (engine) => {
                return new Float32Array(engine.activeScene.texcoords);
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
        u_camera: (engine, loc) => {
            const { gl } = engine;
            const { camera } = engine.activeScene;

            gl.uniformMatrix3fv(
                loc,
                false,
                m3.combine([
                    m3.translate(camera.position[0], camera.position[1]),
                    m3.rotate(camera.rotation[0]),
                    m3.translate(camera.offset[0], camera.offset[1]),
                ])
            );
        },
    },
    dynamicUniforms: {
        u_showtex: (engine, loc, obj) => {
            const { gl } = engine;
            gl.uniform1i(
                loc,
                obj.texture && obj.texture.enabled !== false ? 1 : 0
            );
        },
        u_texture: (engine, loc, obj) => {
            const { gl } = engine;
            /// Apply the current texture if relevant
            // Check if the current texture is loaded
            if (obj && obj.texture && obj.texture.enabled !== false) {
                const { webglTexture, square } = obj.texture._computed;
                if (obj.texture._computed) {
                    gl.texParameteri(
                        gl.TEXTURE_2D,
                        gl.TEXTURE_WRAP_S,
                        gl.CLAMP_TO_EDGE
                    );
                    gl.texParameteri(
                        gl.TEXTURE_2D,
                        gl.TEXTURE_WRAP_T,
                        gl.CLAMP_TO_EDGE
                    );
                }

                // This ensures the image is loaded into
                // u_texture properly.
                gl.uniform1i(loc, 0);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, webglTexture);
            }
        },
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
