import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';

const canvas = document.getElementById('webgl-contents');
const gl = canvas.getContext('webgl');
const glslify = require('glslify');
const vertices = [
  0.5, 0.75, 0.5,
  0.75, 0.25, 0.5,
  0.25, 0.25, 0.5,
  -0.5, -0.75, 0.5,
  -0.75, -0.25, 0.5,
  -0.25, -0.25, 0.5,
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

  const program = loadProgram(gl, glslify('./001.vs'), glslify('./001.fs'));

  const attr_position = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attr_position);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
};
init();
