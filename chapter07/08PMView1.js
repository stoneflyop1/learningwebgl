/// <reference path="../webglutil.js"/>
/// <reference path="../cuon-matrix.js"/>

function main() {
    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);

    const vs = document.getElementById('vs').textContent;
    const fs = document.getElementById('fs').textContent;
    const program = initShaders(gl, vs, fs);

    const n = initVertexBuffers(gl, program);

    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');

    const modelMatrix = new Matrix4();
    modelMatrix.setTranslate(0.75, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    const viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    const projMatrix = new Matrix4();
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initVertexBuffers(gl, program) {
    const verticesColors = new Float32Array([
        // 顶点坐标和颜色
        0.0, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green triangle
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, 0.4, 0.4,

        0.0, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow triangle
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.0, 1.0, 0.0, 0.4, 0.4, 1.0, // The front blue triangle
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
    ]);

    const n = 9;

    const vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    
    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}

main();