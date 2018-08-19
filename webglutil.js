
/**
 * @summary get webgl context from canvas object
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {WebGLRenderingContext} webgl context
 */
function getWebGLContext(canvas) {
    return canvas.getContext('webgl');
}

/**
 * @summary load webgl shader with type
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {number} type webgl shader type
 * @param {string} source webgl shader source
 * @returns {WebGLShader} compiled webgl shader
 */
function loadShader(gl, type, source) {
    //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader
    const shader = gl.createShader(type);
    //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/shaderSource
    gl.shaderSource(shader, source);
    //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader
    gl.compileShader(shader);
    //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderParameter
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {                
        alert('An error occurred compiling the shaders: ' + 
            //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderInfoLog
            gl.getShaderInfoLog(shader));
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

/**
 * @summary initialize vertext and fragment shaders
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string} vs vertext shader string
 * @param {string} fs fragment shader string
 * @param {boolean} noUseProgram not use the created program immediately
 * @returns {WebGLProgram} webgl context program
 */
function initShaders(gl, vs, fs, noUseProgram) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createProgram
    const program = gl.createProgram();
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/attachShader
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/linkProgram
    gl.linkProgram(program);

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + 
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramInfoLog
            gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }

    if (!noUseProgram) {
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram
        gl.useProgram(program);
    }    

    return program;
}

/**
 * @summary initialize color for webgl context
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Number} r red: 0.0 ~ 1.0
 * @param {Number} g green: 0.0 ~ 1.0
 * @param {Number} b blue: 0.0 ~ 1.0
 * @param {Number} a alpha: 0.0 ~ 1.0
 */
function initColor(gl, r, g, b, a) {
    r = r || 0.0;
    g = g || 0.0;
    b = b || 0.0;
    a = a || 0.0;
    //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor
    gl.clearColor(r,g,b,a);
    //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear
    gl.clear(gl.COLOR_BUFFER_BIT);
}

/********************************
 * @summary 初始化顶点缓冲区，或者顶点的点尺寸
 * @param {Number} nCoordinates 点的维度(1,2,3), default is 2
 * @param {Float32Array} vertices
 * @param {String} variableName varialbe name in shader, default is a_Position
 * @param {WebGLProgram} program webgl program
 * @param {WebGLRenderingContext} gl
 *********************************/
function initVertexBuffers(gl, program, vertices, nCoordinates, variableName) {
    
    variableName = variableName || 'a_Position';

    nCoordinates = nCoordinates || 2;

    let n = Math.floor(vertices.length/nCoordinates);

    // 创建缓冲区对象
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object...');
        return -1;
    }
    // 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 数据写入缓冲区
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(program, variableName);
    // 分配给一个attribute变量
    gl.vertexAttribPointer(a_Position, nCoordinates, gl.FLOAT, false, 0, 0);
    // 启用attribute变量
    gl.enableVertexAttribArray(a_Position);

    return n;
}
/********************************
 * @summary 初始化顶点缓冲区，或者顶点的点尺寸
 * @param {Number} size 点的维度(1,2,3)
 * @param {Number} type gl.FLOAT OR gl.UNSIGNED_BYTE etc
 * @param {Float32Array} TypedArray data
 * @param {String} variableName varialbe name in shader
 * @param {WebGLProgram} program webgl program
 * @param {WebGLRenderingContext} gl
 *********************************/
function initArrayBuffer(gl, program, data, size, type, attribute) {
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const a_attribute = gl.getAttribLocation(program, attribute);
    gl.vertexAttribPointer(a_attribute, size, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return true;
}