/// <reference path="../webglutil.js"/>

function main() {
    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);

    const vs = document.getElementById('vs').textContent;
    const fs = document.getElementById('fs').textContent;
    const program = initShaders(gl, vs, fs);

    const n = initVertexBuffers(gl, program);

    // background color
    initColor(gl, 0.0,0.0,0.0,1.0);
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    const startIndex = 0;
    const drawNumber = n - startIndex;
    gl.drawArrays(gl.TRIANGLES, startIndex, drawNumber); 
}
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLProgram} program 
 */
function initVertexBuffers(gl, program) {
    const vertices = new Float32Array([
         0.0,  0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
         0.5, -0.5, 0.0, 0.0, 1.0
    ]);

    const n = 3;

    const vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const FSIZE = vertices.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*5, FSIZE*2);
    gl.enableVertexAttribArray(a_Color);

    return n;

}

main();