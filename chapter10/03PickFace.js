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

    gl.clearColor(0, 0, 0, 1);
    // Enable the hidden surface removal function            
    gl.enable(gl.DEPTH_TEST);

    const viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100);
    viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    const u_PickedFace = gl.getUniformLocation(program, 'u_PickedFace');
    gl.uniform1i(u_PickedFace, -1); // Initialize selected surface

    let currentAngle = 0.0;
    canvas.onmousedown = function (ev) {
        const x = ev.clientX;
        const y = ev.clientY;
        const rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            const x_in_canvas = x - rect.left;
            const y_in_canvas = rect.bottom - y;
            const face = checkFace(gl, n, x_in_canvas, y_in_canvas, currentAngle, u_PickedFace,
                viewProjMatrix, u_MvpMatrix);
            gl.uniform1i(u_PickedFace, face);
            console.log(face);
            draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
        }
    }

    let tick = function () {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
        requestAnimationFrame(tick, canvas);
    }

    tick();
}

const g_MvpMatrix = new Matrix4();

function draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix) {
    g_MvpMatrix.set(viewProjMatrix);
    g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0);
    g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0);
    g_MvpMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);

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
    const vertices = new Float32Array([ // Vertex coordinates
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([ // Colors
        0.2, 0.58, 0.82, 0.2, 0.58, 0.82, 0.2, 0.58, 0.82, 0.2, 0.58, 0.82, // v0-v1-v2-v3 front
        0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69, // v0-v3-v4-v5 right
        0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61, // v0-v5-v6-v1 up
        0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, // v1-v6-v7-v2 left
        0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, // v7-v4-v3-v2 down
        0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // right
        8, 9, 10, 8, 10, 11, // up
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // down
        20, 21, 22, 20, 22, 23 // back
    ]);

    const faces = new Uint8Array([ // Faces
        1, 1, 1, 1, // v0-v1-v2-v3 front
        2, 2, 2, 2, // v0-v3-v4-v5 right
        3, 3, 3, 3, // v0-v5-v6-v1 up
        4, 4, 4, 4, // v1-v6-v7-v2 left
        5, 5, 5, 5, // v7-v4-v3-v2 down
        6, 6, 6, 6, // v4-v7-v6-v5 back
    ]);

    initArrayBuffer(gl, program, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, program, colors, 3, gl.FLOAT, 'a_Color');
    initArrayBuffer(gl, program, faces, 1, gl.UNSIGNED_BYTE, 'a_Face');

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function checkFace(gl, n, x, y, currentAngle, u_PickedFace, viewProjMatrix, u_MvpMatrix) {
    gl.uniform1i(u_PickedFace, 0); // Draw by writing surface number into alpha value, tell that mouse is clicked
    draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);

    // Read pixel at the clicked position
    const pixels = new Uint8Array(4);
    // Read the pixel value of the clicked position. pixels[3] is the surface number
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    return pixels[3];
}

let last = Date.now();

function animate(angle) {
    let now = Date.now();
    const elapsed = now - last;
    last = now;
    // Update the current rotation angle
    const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}

main();