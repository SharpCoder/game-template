<script lang="ts">
    import type { Engine } from 'webgl-engine';

    let webglCanvas: HTMLCanvasElement;
    let initialized = false;

    $: {
        // @ts-ignore
        const engine: Engine<unknown> = window['gameEngine'];

        if (webglCanvas && !initialized) {
            initialized = true;
            engine.initialize(webglCanvas);
        } else if (webglCanvas) {
            engine.setCanvas(webglCanvas);
        }
    }
</script>

<canvas id="canvas" bind:this={webglCanvas} />

<style>
    #canvas {
        width: 100%;
        height: 100%;
        flex-grow: 1;
    }
</style>
