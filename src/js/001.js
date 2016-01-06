import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadShader from './modules/loadShader.js';

const canvas = document.getElementById('webgl-contents');
const gl = canvas.getContext('webgl');
const glslify = require('glslify');
const vs_src = glslify('./001.vs');
const fs_src = glslify('./001.fs');
const vertex_buffer = gl.createBuffer();
const vertices = [
   0.0,  0.5, 0.0,
   0.5, -0.5, 0.0,
  -0.5, -0.5, 0.0
];

const init = () => {
  resizeWindow(canvas);
  isSupportedWebGL(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const program = gl.createProgram();
  const vs = loadShader(gl.VERTEX_SHADER, gl, vs_src);
  const fs = loadShader(gl.FRAGMENT_SHADER, gl, fs_src);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const vertex_position_attribute = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(vertex_position_attribute, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertex_position_attribute);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
};
init();
