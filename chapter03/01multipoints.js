/// <reference path="../webglutil.js"/>

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);

    let vs = document.getElementById('vs').textContent;
    let fs = document.getElementById('fs').textContent;
    let program = initShaders(gl, vs, fs);

    let vertices = new Float32Array([
         0.0, 0.5, 
        -0.5, -0.5, 
         0.5, -0.5
    ]);
    
    let n = initVertexBuffers(gl, program, vertices, 2);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices...');
        return;
    }

    // background color
    initColor(gl, 0.0,0.0,0.0,1.0);
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    let startIndex = 0;
    let drawNumber = n - startIndex;
    gl.drawArrays(gl.POINTS, startIndex, drawNumber); 
}        

function getColor(x, y) {
    if (x >= 0.0 && y >= 0.0) {
        return [1.0, 0.0, 0.0, 1.0];
    } else if (x < 0 && y < 0) {
        return [0.0, 1.0, 0.0, 1.0];
    } else {
        return [1.0, 1.0, 1.0, 1.0];
    }
}

main();