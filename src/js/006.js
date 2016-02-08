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
  0.0, 0.8, 0.8,
  0.0, 0.8, 0.8,
  0.0, 0.8, 0.8,
  0.0, 0.8, 0.8,
  0.0, 0.8, 0.8,
  0.0, 0.8, 0.8,
  0.0, 0.8, 0.8,
  0.0, 0.8, 0.8,
];
const normals = [];
const initNormals = () => {
  for (let i = 0; i < vertices.length; i += 3) {
    const v = [0.0, 0.0, 0.0];
    vec3.normalize(v, [vertices[i + 0], vertices[i + 1], vertices[i + 2]]);
    normals.push(v[0], v[1], v[2]);
  }
};

const init = () => {
  resizeWindow(canvas);
  isSupportedWebGL(gl);
  if(!gl.getExtension('OES_standard_derivatives')){
    console.log('OES_standard_derivatives is not supported');
    return;
  }
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

  let light_direction = [-1.0, 1.0, 1.0];
  let time = 0;

  const m_matrix   = mat4.identity(mat4.create());
  const v_matrix   = mat4.identity(mat4.create());
  const p_matrix   = mat4.identity(mat4.create());
  const mv_matrix  = mat4.identity(mat4.create());
  const mvp_matrix = mat4.identity(mat4.create());
  const inv_matrix = mat4.identity(mat4.create());

  mat4.lookAt(v_matrix, camera.position, center, camera.up);
  mat4.perspective(p_matrix, fovy, aspect, near, far);
  mat4.multiply(mv_matrix, v_matrix, m_matrix);
  mat4.multiply(mvp_matrix, p_matrix, mv_matrix);
  mat4.invert(inv_matrix, m_matrix);

  const program = loadProgram(gl, glslify('../glsl/006.vs'), glslify('../glsl/006.fs'));

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

  const uni_inv_matrix = gl.getUniformLocation(program, 'inv_matrix');
  gl.uniformMatrix4fv(uni_inv_matrix, false, inv_matrix);

  const uni_light_direction = gl.getUniformLocation(program, 'light_direction');
  gl.uniform3fv(uni_light_direction, light_direction);

  const uni_time = gl.getUniformLocation(program, 'time');
  gl.uniform1f(uni_time, time);

  const attr_position = gl.getAttribLocation(program, 'position');
  const vertex_buffer = gl.createBuffer();
  gl.enableVertexAttribArray(attr_position);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, 0, 0);

  const attr_index = gl.getAttribLocation(program, 'index');
  const index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indecies), gl.STATIC_DRAW);

  const attr_color = gl.getAttribLocation(program, 'color');
  const color_buffer = gl.createBuffer();
  gl.enableVertexAttribArray(attr_color);
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attr_color, 3, gl.FLOAT, false, 0, 0);

  initNormals();
  const attr_normal = gl.getAttribLocation(program, 'normal');
  const normal_buffer = gl.createBuffer();
  gl.enableVertexAttribArray(attr_normal);
  gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attr_normal, 3, gl.FLOAT, false, 0, 0);

  const render = () => {
    time ++;
    gl.clear(gl.COLOR_BUFFER_BIT);
    mat4.identity(m_matrix);
    mat4.scale(
      m_matrix, m_matrix,
      [
        Math.sin(Math.PI / 180 * time * 2) * 0.5 + 1.0,
        Math.cos(Math.PI / 180 * time * 2) * 0.5 + 1.0,
        1
      ]
    );
    mat4.rotateX(m_matrix, m_matrix, Math.PI / 180 * time);
    mat4.multiply(mv_matrix, v_matrix, m_matrix);
    mat4.invert(inv_matrix, m_matrix);
    gl.uniformMatrix4fv(uni_mv_matrix, false, mv_matrix);
    gl.uniformMatrix4fv(uni_inv_matrix, false, inv_matrix);
    gl.uniform1f(uni_time, time);
    gl.drawElements(gl.TRIANGLES, indecies.length, gl.UNSIGNED_SHORT, 0);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
};
init();
