
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
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {                
        alert('An error occurred compiling the shaders: ' + 
            gl.getShaderInfoLog(shader));
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
 * @returns {WebGLProgram} webgl context program
 */
function initShaders(gl, vs, fs) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + 
            gl.getProgramInfoLog(shaderProgram));
return null;
    }

    gl.useProgram(program);

    return program;
}