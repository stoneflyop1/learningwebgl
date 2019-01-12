/// <reference path="../webglutil.js"/>

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);

    var vs = document.getElementById('vs').textContent;
    var fs = document.getElementById('fs').textContent;
    var program = initShaders(gl, vs, fs);

    var a_Position = gl.getAttribLocation(program, 'a_Position');

    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_Position);
    }

    gl.vertexAttrib3f(a_Position, 0.3,0.0,0.0);

    // background color
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];

function click(ev, gl, canvas, a_Position) {

    // get clicked position
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x-rect.left) - canvas.height/2) / (canvas.height/2);
    y = ((canvas.width/2)-(y-rect.top)) / (canvas.width/2);

    // clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // multi points
    g_points.push(x);
    g_points.push(y);
    var len = g_points.length;
    for(var i = 0;i<len;i+=2) {
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }

    /*
    // one point only
    gl.vertexAttrib3f(a_Position, x, y, 0.0);
    gl.drawArrays(gl.POINTS, 0, 1);*/
}

main();