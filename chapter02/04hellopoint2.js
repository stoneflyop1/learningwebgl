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

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    gl.vertexAttrib3f(a_Position, 0.3,0.0,0.0);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);

}





main();