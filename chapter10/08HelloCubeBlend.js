function main() {
    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);

    const vs = document.getElementById('vs').textContent;
    const fs = document.getElementById('fs').textContent;
    const program = initShaders(gl, vs, fs);

    const n = initVertexBuffers(gl, program);

    gl.clearColor(0, 0, 0, 1);
    // Enable the hidden surface removal function            
    //gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');

    const mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30,1,1,100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Clear the color and depth buffer
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

    const vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([     // Colors with alpha
        0.4,0.4,1.0,0.4, 0.4,0.4,1.0,0.4, 0.4,0.4,1.0,0.4, 0.4, 0.4, 1.0,0.4,  // v0-v1-v2-v3 front(blue)
        0.4,1.0,0.4,0.4, 0.4,1.0,0.4,0.4, 0.4,1.0,0.4,0.4, 0.4, 1.0, 0.4,0.4,  // v0-v3-v4-v5 right(green)
        1.0,0.4,0.4,0.4, 1.0,0.4,0.4,0.4, 1.0,0.4,0.4,0.4, 1.0, 0.4, 0.4,0.4,  // v0-v5-v6-v1 up(red)
        1.0,1.0,0.4,0.4, 1.0,1.0,0.4,0.4, 1.0,1.0,0.4,0.4, 1.0, 1.0, 0.4,0.4,  // v1-v6-v7-v2 left
        1.0,1.0,1.0,0.4, 1.0,1.0,1.0,0.4, 1.0,1.0,1.0,0.4, 1.0, 1.0, 1.0,0.4,  // v7-v4-v3-v2 down
        0.4,1.0,1.0,0.4, 0.4,1.0,1.0,0.4, 0.4,1.0,1.0,0.4, 0.4, 1.0, 1.0,0.4   // v4-v7-v6-v5 back
    ]);

    const indices = new Uint8Array([       // Indices of the vertices
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);


    if (!initArrayBuffer(gl, program, vertices, 3, gl.FLOAT, 'a_Position')) {
        return -1;
    }
    if (!initArrayBuffer(gl, program, colors, 4, gl.FLOAT, 'a_Color')) {
        return -1;
    }

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

main();