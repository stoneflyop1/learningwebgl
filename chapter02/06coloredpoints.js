/// <reference path="../webglutil.js"/>

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);

    var vs = document.getElementById('vs').textContent;
    var fs = document.getElementById('fs').textContent;
    var program = initShaders(gl, vs, fs);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position, u_FragColor);
    }

    // background color
    initColor(gl, 0.0,0.0,0.0,1.0);
    //gl.clearColor(0.0,0.0,0.0,1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];

function click(ev, gl, canvas, a_Position, u_FragColor) {
    // get clicked position
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = ((canvas.width / 2) - (y - rect.top)) / (canvas.width / 2);

    g_points.push([x, y]);

    var color = getColor(x, y);
    g_colors.push(color);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var rgba = g_colors[i];
        var xy = g_points[i];

        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function getColor(x, y) {
    if (x >= 0.0 && y >= 0.0) {
        return [1.0, 0.0, 0.0, 1.0];
    } else if (x < 0 && y < 0) {
        return [0.0, 1.0, 0.0, 1.0];
    } else {
        return [1.0, 1.0, 1.0, 1.0];
    }
}

main();