const xTrans = 0.5;
        const yTrans = 0.5;
        const zTrans = 0.0;

        function main() {
            let canvas = document.getElementById('webgl');
            let gl = getWebGLContext(canvas);

            let vs = document.getElementById('vs').textContent;
            let fs = document.getElementById('fs').textContent;
            let program = initShaders(gl, vs, fs);

            let vertices = new Float32Array([
                 0.0, 0.5, 
                -0.5, -0.5, 
                 0.5, -0.5
            ]);
            
            let n = initVertexBuffers(gl, program, vertices, 2);
            if (n < 0) {
                console.log('Failed to set the positions of the vertices...');
                return;
            }
            
            let u_Translation = gl.getUniformLocation(program, 'u_Translation');
            gl.uniform4f(u_Translation, xTrans, yTrans, zTrans, 0.0);

            // background color
            initColor(gl, 0.0,0.0,0.0,1.0);
            gl.clearColor(0.0,0.0,0.0,1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);            
            
            gl.drawArrays(gl.TRIANGLES, 0, n);
            
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