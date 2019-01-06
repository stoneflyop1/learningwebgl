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
    gl.drawArrays(gl.POINTS, startIndex, drawNumber); 
}
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLProgram} program 
 */
function initVertexBuffers(gl, program) {
    const vertices = new Float32Array([
         0.0,  0.5, 10.0,
        -0.5, -0.5, 20.0,
         0.5, -0.5, 30.0
    ]);

    const n = 3;

    const vertexSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const FSIZE = vertices.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE *3, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*3, FSIZE*2);
    gl.enableVertexAttribArray(a_PointSize);

    return n;

}

main();