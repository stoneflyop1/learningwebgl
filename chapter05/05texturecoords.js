function main() {
    const canvas = document.getElementById('webgl');
    const gl = getWebGLContext(canvas);

    const vs = document.getElementById('vs').textContent;
    const fs = document.getElementById('fs').textContent;
    const program = initShaders(gl, vs, fs);

    const n = initVertexBuffers(gl, program);

    if (!initTextures(gl, program, n)) {
        alert('failed texture');
        return;
    }

    // // background color
    // initColor(gl, 0.0,0.0,0.0,1.0);
    // gl.clearColor(0.0,0.0,0.0,1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    
    // const startIndex = 0;
    // const drawNumber = n - startIndex;
    // gl.drawArrays(gl.TRIANGLES, startIndex, drawNumber); 
}

function initVertexBuffers(gl, program) {
    const vertices = new Float32Array([
        // -0.5,  0.5, 0.0, 1.0,
        // -0.5, -0.5, 0.0, 0.0,
        //  0.5,  0.5, 1.0, 1.0,
        //  0.5, -0.5, 1.0, 0.0
         -0.5,  0.5, -0.3, 1.7,
        -0.5, -0.5, -0.3, -0.2,
         0.5,  0.5,  1.7,  1.7,
         0.5, -0.5,  1.7, -0.2
    ]);

    const n = 4; //顶点数目

    const vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const FSIZE = vertices.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE*4, FSIZE*2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;

}

function initTextures(gl, program, n) {
    const texture = gl.createTexture();

    const u_Sampler = gl.getUniformLocation(program, 'u_Sampler');

    const image = new Image();
    image.onload = function() {
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    image.src = 'images/sky.JPG';
    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 对纹理图像进行Y轴反转
    gl.activeTexture(gl.TEXTURE0); // 开启0号纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture); // 向target绑定纹理对象

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); // 配置纹理图像

    gl.uniform1i(u_Sampler, 0); // 将0号纹理传递给着色器

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

}

main();