/// <reference path="../webglutil.js"/>
/// <reference path="../cuon-matrix.js"/>

function main() {
    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);
    const nf = document.getElementById('nearFar');

    const vs = document.getElementById('vs').textContent;
    const fs = document.getElementById('fs').textContent;
    const program = initShaders(gl, vs, fs);

    const n = initVertexBuffers(gl, program);

   const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');

    const projMatrix = new Matrix4();
    document.onkeydown = function(ev) {
        keyDown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
    }


    projMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

let g_near = 0.00, g_far = 0.50;

function keyDown(ev, gl, n, u_ProjMatrix, projMatrix, nf) {
    switch(ev.keyCode) {
        case 39: g_near += 0.01; break;
        case 37: g_near -= 0.01; break;
        case 38: g_far += 0.01; break;
        case 40: g_far -= 0.01; break;
        default: return;
    }

    draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(gl, n, u_ProjMatrix, projMatrix, nf) {
    // 设置视点和视线
    projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

    // 将视图矩阵传递给u_ProjMatrix变量
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT); // 清除canvas
    gl.drawArrays(gl.TRIANGLES, 0, n);

    nf.innerHTML = 'near: ' +Math.round(g_near * 100) / 100 + ", far: " + Math.round(g_far*100)/100;
}

function initVertexBuffers(gl, program) {
    const verticesColors = new Float32Array([
        // 顶点坐标和颜色
         0.0,  0.5, -0.4, 0.4, 1.0, 0.4, // 绿色三角形在最后面
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
         0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

         0.5,  0.4, -0.2, 1.0, 0.4, 0.4, //黄色中间
        -0.5,  0.4, -0.2, 1.0, 1.0, 0.4,
         0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

         0.0,  0.5,  0.0, 0.4, 0.4, 1.0, //蓝色最前
        -0.5, -0.5,  0.0, 0.4, 0.4, 1.0,
         0.5, -0.5,  0.0, 1.0, 0.4, 0.4
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