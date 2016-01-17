import Util from './modules/util.js';
import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';

const glMatrix = require('gl-matrix');
const mat4 = glMatrix.mat4;
const glslify = require('glslify');

const canvas = document.getElementById('webgl-contents');
const gl = canvas.getContext('webgl');
const mMatrix = mat4.identity(mat4.create());
const vMatrix = mat4.identity(mat4.create());
const pMatrix = mat4.identity(mat4.create());
const vertices1 = [
  -0.5, 0.6, 0,
  -0.3, 0.4, 0,
  -0.1, 0.6, 0,
  0.1, 0.4, 0,
  0.3, 0.6, 0,
  0.5, 0.4, 0,
];
const vertices2 = [
  -0.5, -0.1, 0,
  -0.3, 0.1, 0,
  -0.1, -0.1, 0,
  0.1, 0.1, 0,
  0.3, -0.1, 0,
  0.5, 0.1, 0,
];
const vertices3 = [
  -0.5, -0.6, 0,
  -0.3, -0.4, 0,
  -0.1, -0.6, 0,
  0.1, -0.4, 0,
  0.3, -0.6, 0,
  0.5, -0.4, 0,
];

const init = () => {
  resizeWindow(canvas);
  isSupportedWebGL(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const program = loadProgram(gl, glslify('./002.vs'), glslify('./002.fs'));
  const attr_position = gl.getAttribLocation(program, 'position');
  const vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attr_position);
  gl.drawArrays(gl.LINE_LOOP, 0, vertices1.length / 3);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attr_position);
  gl.drawArrays(gl.LINES, 0, vertices2.length / 3);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices3), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attr_position);
  gl.drawArrays(gl.LINE_STRIP, 0, vertices3.length / 3);
};
init();
