import Util from './modules/util.js';
import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';

const glslify = require('glslify');

const canvas = document.getElementById('webgl-contents');
const gl = canvas.getContext('webgl');

const vertices = [
  -1.0,  1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0, -1.0, 0.0,
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0,  1.0, 0.0,
   1.0, -1.0, 0.0,
  -1.0, -1.0, 0.0,
];
const indecies = [
  0, 1, 2,  3, 2, 1,
  4, 5, 6,  7, 6, 5,
];
const colors = [
  0.0, 0.5, 1.0,
  0.0, 0.5, 1.0,
  0.0, 0.5, 1.0,
  0.0, 0.5, 1.0,
  0.5, 0.5, 1.0,
  0.5, 0.5, 1.0,
  0.5, 0.5, 1.0,
  0.5, 0.5, 1.0,
];
const uvs = [
  1.0, 0.0,
  0.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  1.0, 0.0,
  0.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
];
const vertices2 = [
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0, -1.0, 0.0,
  -1.0,  1.0, 0.0,
];
const indecies2 = [
  0, 1, 2,  3, 2, 1,
];
const createVBO = (array) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buffer;
};
const createIBO = (array) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return buffer;
};
const setArrayBuffer = (buffer, array, length) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(array);
  gl.vertexAttribPointer(array, length, gl.FLOAT, false, 0, 0);
};
const createFrameBuffer = (width, height) => {
  const frame_buffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);

  const depth_render_buffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depth_render_buffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth_render_buffer);

  const frame_texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, frame_texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frame_texture, 0);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return {
    f: frame_buffer,
    d: depth_render_buffer,
    t: frame_texture
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
  gl.enable(gl.CULL_FACE);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const center = [0.0, 0.0, 0.0];
  const camera = {
    position: [2.5, -1.0, 2.5],
    up: [0.0, 1.0, 0.0]
  };

  let fovy = 45;
  let aspect = canvas.width / canvas.height;
  let near = 0.1;
  let far = 100.0;

  for (var i = 0; i < uvs.length; i++) {
    if (window.innerWidth > window.innerHeight) {
      if (i % 2 == 1) uvs[i] /= aspect;
    } else {
      if (i % 2 == 0) uvs[i] *= aspect;
    }
  }

  let light_direction = [1.0, 1.0, 1.0];
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

  const program2 = loadProgram(gl, glslify('../glsl/012a.vs'), glslify('../glsl/012a.fs'));

  const uni_time2 = gl.getUniformLocation(program2, 'time');
  gl.uniform1f(uni_time2, time);

  const attr_position2 = gl.getAttribLocation(program2, 'position');
  const vertex_buffer2 = createVBO(new Float32Array(vertices2));

  const attr_index2 = gl.getAttribLocation(program2, 'index');
  const index_buffer2 = createIBO(new Uint16Array(indecies2));

  const program = loadProgram(gl, glslify('../glsl/012.vs'), glslify('../glsl/012.fs'));

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

  const uni_texture = gl.getUniformLocation(program, 'texture');
  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(uni_texture, 0);

  const attr_position = gl.getAttribLocation(program, 'position');
  const vertex_buffer = createVBO(new Float32Array(vertices));

  const attr_color = gl.getAttribLocation(program, 'color');
  const color_buffer = createVBO(new Float32Array(colors));

  const attr_uv = gl.getAttribLocation(program, 'uv');
  const uv_buffer = createVBO(new Float32Array(uvs));

  const attr_index = gl.getAttribLocation(program, 'index');
  const index_buffer = createIBO(new Uint16Array(indecies));

  const frame_buffer = createFrameBuffer(512, 512);

  const render = () => {
    time ++;

    gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer.f);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program2);

    setArrayBuffer(vertex_buffer2, attr_position2, 3);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer2);

    gl.uniform1f(uni_time2, time);

    gl.drawElements(gl.TRIANGLES, indecies2.length, gl.UNSIGNED_SHORT, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    setArrayBuffer(vertex_buffer, attr_position, 3);
    setArrayBuffer(color_buffer, attr_color, 3);
    setArrayBuffer(uv_buffer, attr_uv, 2);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

    gl.bindTexture(gl.TEXTURE_2D, frame_buffer.t);

    mat4.identity(m_matrix);
    mat4.rotateY(m_matrix, m_matrix, Math.PI / 180 * time / 2);
    mat4.multiply(mv_matrix, v_matrix, m_matrix);
    mat4.invert(inv_matrix, m_matrix);

    gl.uniformMatrix4fv(uni_mv_matrix, false, mv_matrix);
    gl.uniformMatrix4fv(uni_inv_matrix, false, inv_matrix);
    gl.uniform1f(uni_time, time);

    gl.drawElements(gl.TRIANGLES, indecies.length, gl.UNSIGNED_SHORT, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
};
init();
