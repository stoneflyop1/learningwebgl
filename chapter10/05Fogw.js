/// <reference path="../webglutil.js"/>
/// <reference path="../cuon-matrix.js"/>

let ANGLE_STEP = 20.0;

function main() {
    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);

    const vs = document.getElementById('vs').textContent;
    const fs = document.getElementById('fs').textContent;
    const program = initShaders(gl, vs, fs);

    const n = initVertexBuffers(gl, program);

    const fogColor = new Float32Array([0.137, 0.231, 0.423]);
    const fogDist = new Float32Array([55, 80]);
    const eye = new Float32Array([25, 65, 35, 1.0]);
    const u_FogColor = gl.getUniformLocation(program, 'u_FogColor');
    gl.uniform3fv(u_FogColor, fogColor);
    const u_FogDist = gl.getUniformLocation(program, 'u_FogDist');
    gl.uniform2fv(u_FogDist, fogDist);
    const u_Eye = gl.getUniformLocation(program, 'u_Eye');
    gl.uniform4fv(u_Eye, eye);

    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
    // Enable the hidden surface removal function            
    gl.enable(gl.DEPTH_TEST);

    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    const modelMatrix = new Matrix4();
    modelMatrix.setScale(10, 10, 10);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);


    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    const mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 1000);
    mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    let currentAngle = 0.0;

    document.onkeydown = function (ev) {
        switch (ev.keyCode) {
            case 38:
                fogDist[1] += 1;
                break;
            case 40:
                if (fogDist[1] > fogDist[0]) fogDist[1] -= 1;
                break;
            default:
                return;
        }
        console.log(fogDist);
        gl.uniform2fv(u_FogDist, fogDist);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    };

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

}


function initVertexBuffers(gl, program) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var vertices = new Float32Array([ // Vertex coordinates
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 // v4-v7-v6-v5 back
    ]);

    var colors = new Float32Array([ // Colors
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, // v0-v1-v2-v3 front
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, // v0-v3-v4-v5 right
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, // v0-v5-v6-v1 up
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, // v1-v6-v7-v2 left
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v7-v4-v3-v2 down
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0 // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // right
        8, 9, 10, 8, 10, 11, // up
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // down
        20, 21, 22, 20, 22, 23 // back
    ]);

    initArrayBuffer(gl, program, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, program, colors, 3, gl.FLOAT, 'a_Color');

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}


main();