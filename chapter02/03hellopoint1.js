/// <reference path="../webglutil.js"/>

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

    gl.clearColor(0.0,0.0,1.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);

}

main();