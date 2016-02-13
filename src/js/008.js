import Util from './modules/util.js';
import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';

const glMatrix = require('gl-matrix');
const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;
const glslify = require('glslify');

const canvas = document.getElementById('webgl-contents');
const gl = canvas.getContext('webgl');

const vertices = [];
const colors = [];

const init = () => {
  resizeWindow(canvas);
  isSupportedWebGL(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < 50; i++) {
    vertices.push(
      Math.random() * 1600 - 800,
      Math.random() * 1600 - 800,
      Math.random() * 1600 - 800
    );
    colors.push(i * 0.003, 0.8, 0.8);
  }

  const center = [0.0, 0.0, 0.0];
  const camera = {
    position: [2000.0, 0.0, 0.0],
    up: [0.0, 1.0, 0.0]
  };

  let fovy = 45;
  let aspect = canvas.width / canvas.height;
  let near = 0.1;
  let far = 10000.0;

  let time = 0;

  const m_matrix   = mat4.identity(mat4.create());
  const v_matrix   = mat4.identity(mat4.create());
  const p_matrix   = mat4.identity(mat4.create());
  const mv_matrix  = mat4.identity(mat4.create());
  const mvp_matrix = mat4.identity(mat4.create());

  mat4.lookAt(v_matrix, camera.position, center, camera.up);
  mat4.perspective(p_matrix, fovy, aspect, near, far);
  mat4.multiply(mv_matrix, v_matrix, m_matrix);
  mat4.multiply(mvp_matrix, p_matrix, mv_matrix);

  const program = loadProgram(gl, glslify('../glsl/008.vs'), glslify('../glsl/008.fs'));

  const uni_m_matrix = gl.getUniformLocation(program, 'm_matrix');
  gl.uniformMatrix4fv(uni_m_matrix, false, m_matrix);

  const uni_v_matrix = gl.getUniformLocation(program, 'v_matrix');
  gl.uniformMatrix4fv(uni_v_matrix, false, v_matrix);

  const uni_p_matrix = gl.getUniformLocation(program, 'p_matrix');
  gl.uniformMatrix4fv(uni_p_matrix, false, p_matrix);

  const uni_mv_matrix = gl.getUniformLocation(program, 'mv_matrix');
  gl.uniformMatrix4fv(uni_mv_matrix, false, mv_matrix);

  const uni_mvp_matrix = gl.getUniformLocation(program, 'mvp_matrix');
  gl.uniformMatrix4fv(uni_mvp_matrix, false, mvp_matrix);

  const uni_time = gl.getUniformLocation(program, 'time');
  gl.uniform1f(uni_time, time);

  const attr_position = gl.getAttribLocation(program, 'position');
  const vertex_buffer = gl.createBuffer();
  gl.enableVertexAttribArray(attr_position);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);

  const attr_color = gl.getAttribLocation(program, 'color');
  const color_buffer = gl.createBuffer();
  gl.enableVertexAttribArray(attr_color);
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attr_color, 3, gl.FLOAT, false, 0, 0);

  const render = () => {
    time ++;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uni_time, time);
    gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 3);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
};
init();
