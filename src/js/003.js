import Util from './modules/util.js';
import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';

const glMatrix = require('gl-matrix');
const mat4 = glMatrix.mat4;
const glslify = require('glslify');

const canvas = document.getElementById('webgl-contents');
const gl = canvas.getContext('webgl');

const vertices = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0
];

const colors = [
  [1.0,  1.0,  1.0,  1.0],    // Front face: white
  [1.0,  0.0,  0.0,  1.0],    // Back face: red
  [0.0,  1.0,  0.0,  1.0],    // Top face: green
  [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
  [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
  [1.0,  0.0,  1.0,  1.0]     // Left face: purple
];
let generated_colors = [];
for (let j = 0; j < 6; j++) {
  let c = colors[j];
  for (let i = 0; i < 4; i++) {
    generated_colors = generated_colors.concat(c);
  }
}
const indices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23    // left
];

const init = () => {
  resizeWindow(canvas);
  isSupportedWebGL(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const m_matrix   = mat4.identity(mat4.create());
  const v_matrix   = mat4.identity(mat4.create());
  const p_matrix   = mat4.identity(mat4.create());
  const vp_matrix  = mat4.identity(mat4.create());
  const mvp_matrix = mat4.identity(mat4.create());

  const move = [0.5, 0.5, 0.0];
  mat4.translate(m_matrix, m_matrix, move);

  const center = [0.0, 0.0, 0.0];
  const camera = {
    position: [5.0, 5.0, 10.0],
    up: [0.0, 1.0, 0.0]
  };
  mat4.lookAt(v_matrix, camera.position, center, camera.up);

  const fovy = 45;
  const aspect = canvas.width / canvas.height;
  const near = 0.1;
  const far = 100.0;
  mat4.perspective(p_matrix, fovy, aspect, near, far);

  mat4.multiply(vp_matrix, p_matrix, v_matrix);
  mat4.multiply(mvp_matrix, vp_matrix, m_matrix);

  const program = loadProgram(gl, glslify('./003.vs'), glslify('./003.fs'));
  const attr_position = gl.getAttribLocation(program, 'position');
  // const attr_color = gl.getAttribLocation(program, 'color');
  // const attr_index = gl.getAttribLocation(program, 'index');
  const uni_location = gl.getUniformLocation(program, 'mvp_matrix');
  gl.enableVertexAttribArray(attr_position);
  // gl.enableVertexAttribArray(attr_color);
  // gl.enableVertexAttribArray(attr_index);

  const vertex_buffer = gl.createBuffer();
  // const color_buffer = gl.createBuffer();
  // const index_buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  // gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generated_colors), gl.STATIC_DRAW);
  // gl.bindBuffer(gl.ARRAY_BUFFER, index_buffer);
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);

  // gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  // gl.vertexAttribPointer(attr_color, 4, gl.FLOAT, false, 0, 0);
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

  gl.uniformMatrix4fv(uni_location, false, mvp_matrix);

  gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 3);
  gl.flush();
};
init();
