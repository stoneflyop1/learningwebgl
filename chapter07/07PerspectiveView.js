/// <reference path="../webglutil.js"/>
/// <reference path="../cuon-matrix.js"/>

function main() {
    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);

    const vs = document.getElementById('vs').textContent;
    const fs = document.getElementById('fs').textContent;
    const program = initShaders(gl, vs, fs);

    const n = initVertexBuffers(gl, program);

   const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');

    const viewMatrix = new Matrix4();
    document.onkeydown = function(ev) {
        keyDown(ev, gl, n, u_ViewMatrix, viewMatrix);
    }


    viewMatrix.setLookAt(0,0,5,0,0,-100,0,1,0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    const projMatrix = new Matrix4();
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

let g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; //视点

function keyDown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if (ev.keyCode == 39) { // right
        g_eyeX += 0.01;
    } else if (ev.keyCode == 37){ // left
        g_eyeX -= 0.01;
    } else {
        return;
    }
    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
    // 设置视点和视线
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

    // 将视图矩阵传递给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT); // 清除canvas
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl, program) {
    const verticesColors = new Float32Array([
        // Three triangles on the right side
        0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The green triangle in back
        0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The yellow triangle in middle
        0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // The blue triangle in front
        0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
        1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

        // Three triangles on the left side
        -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The green triangle in back
        -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The yellow triangle in middle
        -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        -0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // The blue triangle in front
        -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
        -0.25, -1.0, 0.0, 1.0, 0.4, 0.4,
    ]);

    const n = 18; // Three vertices per triangle * 6

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