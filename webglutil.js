
/**
 * get webgl context from canvas object
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {WebGLRenderingContext} webgl context
 */
function getWebGLContext(canvas) {
    return canvas.getContext('webgl');
}

/**
 * load webgl shader with type
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
        const err = 'An error occurred compiling the shaders: ' + 
        //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderInfoLog
        gl.getShaderInfoLog(shader);
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
        gl.deleteShader(shader);
        console.error(err);
        return null;
    }
    return shader;
}

/**
 * initialize vertext and fragment shaders
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string} vs vertext shader string
 * @param {string} fs fragment shader string
 * @returns {WebGLProgram} webgl context program
 */
function initShaders(gl, vs, fs) {
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
        const err = 'Unable to initialize the shader program: ' + 
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramInfoLog
        gl.getProgramInfoLog(shaderProgram);
        console.error(err);
        return null;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram
    gl.useProgram(program);

    return program;
}

/**
 * initialize color for webgl context
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
 * initialize vertex buffers or point size buffers
 * @param {Number} nCoordinates vertex dimensions (1,2,3), default is 2
 * @param {Float32Array} vertices
 * @param {String} variableName varialbe name in shader, default is a_Position
 * @param {WebGLProgram} program webgl program
 * @param {WebGLRenderingContext} gl
 *********************************/
function initVertexBuffers(gl, program, vertices, nCoordinates, variableName) {
    
    variableName = variableName || 'a_Position';

    nCoordinates = nCoordinates || 2;

    let n = Math.floor(vertices.length/nCoordinates);

    // 1. create buffer
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object...');
        return -1;
    }
    // 2. bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 3. write data to buffer
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(program, variableName);
    // 4. assign an attribute
    gl.vertexAttribPointer(a_Position, nCoordinates, gl.FLOAT, false, 0, 0);
    // 5. enable attribute
    gl.enableVertexAttribArray(a_Position);

    return n;
}
/********************************
 *  initialize array buffers
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