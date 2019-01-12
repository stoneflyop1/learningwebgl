/// <reference path="../webglutil.js"/>
/// <reference path="../cuon-matrix.js"/>

function main() {
    var vs = document.getElementById('vs').textContent;
    var fs = document.getElementById('fs').textContent;

    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) return;
    
    var program = initShaders(gl, vs, fs);
    if (!program) {
        console.log("Failed to init shaders");
        return;
    }

    const n = initVertexBuffers(gl, program);
    if (n < 0) {
        console.log('Failed to set vertices info');
        return;
    }

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, n);

}


function initVertexBuffers(gl, program) {
    const vertices = new Float32Array([
        0,0.5, -0.5,-0.5, 0.5,-0.5
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.enableVertexAttribArray(a_Position);

    return 3;  // The number of vertices
}
main();