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
  -0.5,  0.5, -0.5,
   0.5,  0.5, -0.5,
   0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5,  0.5,  0.5,
   0.5,  0.5,  0.5,
   0.5, -0.5,  0.5,
  -0.5, -0.5,  0.5,
];
const indecies = [
  0, 3, 1,   2, 1, 3,
  4, 0, 5,   1, 5, 0,
  1, 2, 5,   6, 5, 2,
  4, 7, 0,   3, 0, 7,
  3, 7, 2,   6, 2, 7,
  5, 6, 4,   7, 4, 6,
];
const colors = [
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
];

const init = () => {
  resizeWindow(canvas);
  isSupportedWebGL(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const center = [0.0, 0.0, 0.0];
  const camera = {
    position: [2.0, 2.0, 4.0],
    up: [0.0, 1.0, 0.0]
  };

  let fovy = 45;
  let aspect = canvas.width / canvas.height;
  let near = 0.1;
  let far = 100.0;

  let time = 0.0;

  const m_matrix   = mat4.identity(mat4.create());
  const v_matrix   = mat4.identity(mat4.create());
  const p_matrix   = mat4.identity(mat4.create());
  const mv_matrix  = mat4.identity(mat4.create());
  const mvp_matrix = mat4.identity(mat4.create());

  // const move = [0.5, 0.5, 0.0];
  // mat4.translate(m_matrix, m_matrix, move);

  mat4.rotateY(m_matrix, m_matrix, Math.PI / 180);

  mat4.lookAt(v_matrix, camera.position, center, camera.up);
  mat4.perspective(p_matrix, fovy, aspect, near, far);
  mat4.multiply(mv_matrix, m_matrix, v_matrix);
  mat4.multiply(mvp_matrix, p_matrix, mv_matrix);

  const program = loadProgram(gl, glslify('./003.vs'), glslify('./003.fs'));
  const attr_position = gl.getAttribLocation(program, 'position');
  const attr_index = gl.getAttribLocation(program, 'index');
  const attr_color = gl.getAttribLocation(program, 'color');
  const attr_normal = gl.getAttribLocation(program, 'normal')
  const uni_time = gl.getUniformLocation(program, 'time');
  const uni_location = gl.getUniformLocation(program, 'mvp_matrix');

  const vertex_buffer = gl.createBuffer();
  const index_buffer = gl.createBuffer();
  const color_buffer = gl.createBuffer();
  const normal_buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attr_position);
  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indecies), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attr_color);
  gl.vertexAttribPointer(attr_color, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices.length, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attr_normal);
  gl.vertexAttribPointer(attr_normal, 3, gl.FLOAT, false, 0, 0);

  gl.uniform1f(uni_time, time);
  gl.uniformMatrix4fv(uni_location, false, mvp_matrix);

  const render = () => {
    time += 1;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uni_time, time);
    gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 3);
    gl.drawElements(gl.TRIANGLES, indecies.length, gl.UNSIGNED_SHORT, 0);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
};
init();
