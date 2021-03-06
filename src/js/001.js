import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';

export default function() {
  // const glMatrix = require('gl-matrix');
  // const mat4 = glMatrix.mat4;
  const glslify = require('glslify');

  const canvas = document.getElementById('webgl-contents');
  const gl = canvas.getContext('webgl');
  const mMatrix = mat4.identity(mat4.create());
  const vMatrix = mat4.identity(mat4.create());
  const pMatrix = mat4.identity(mat4.create());
  const vertices = [
    0, 0.5, 0,
    0.333, -0.5, 0,
    -0.333, -0.5, 0
  ];

  const init = () => {
    resizeWindow(canvas);
    isSupportedWebGL(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const program = loadProgram(gl, glslify('../glsl/001.vs'), glslify('../glsl/001.fs'));

    const attr_position = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr_position);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
  };
  init();
};
