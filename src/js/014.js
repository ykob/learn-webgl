import Util from './modules/util.js';
import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';
import createVBO from './modules/create_vbo.js';
import createIBO from './modules/create_ibo.js';
import setArrayBuffer from './modules/set_array_buffer.js';

export default function() {
  const glslify = require('glslify');
  const canvas = document.getElementById('webgl-contents');
  const gl = canvas.getContext('webgl');
  const vs = glslify('../glsl/014.vs');
  const fs = glslify('../glsl/014.fs');

  const vertices = [
    -2.8,  2.8, 0.0,
     2.8,  2.8, 0.0,
    -2.8, -2.8, 0.0,
     2.8, -2.8, 0.0,
  ];
  const indecies = [
    0, 2, 1,
    1, 2, 3,
  ];

  const init = () => {
    resizeWindow(canvas);
    isSupportedWebGL(gl);
    if(!gl.getExtension('OES_standard_derivatives')){
      console.log('OES_standard_derivatives is not supported');
      return;
    }
    gl.clearColor(0.95, 0.95, 0.95, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const camera = {
      pos: [0.0, 0.0, 8.0],
      dir: [0.0, 0.0, -1.0],
      up:  [0.0, 1.0, 0.0],
    };

    let fovy = 45;
    let aspect = canvas.width / canvas.height;
    let near = 0.1;
    let far = 100.0;

    let time = 0;

    const m_matrix   = mat4.identity(mat4.create());
    const m_matrix2  = mat4.identity(mat4.create());
    const v_matrix   = mat4.identity(mat4.create());
    const p_matrix   = mat4.identity(mat4.create());
    const mv_matrix  = mat4.identity(mat4.create());

    mat4.lookAt(v_matrix, camera.pos, camera.dir, camera.up);
    mat4.perspective(p_matrix, fovy, aspect, near, far);
    mat4.multiply(mv_matrix, v_matrix, m_matrix);

    const program = loadProgram(gl, vs, fs);

    const uni_m_matrix = gl.getUniformLocation(program, 'm_matrix');
    gl.uniformMatrix4fv(uni_m_matrix, false, m_matrix);

    const uni_m_matrix2 = gl.getUniformLocation(program, 'm_matrix2');
    gl.uniformMatrix4fv(uni_m_matrix2, false, m_matrix2);

    const uni_v_matrix = gl.getUniformLocation(program, 'v_matrix');
    gl.uniformMatrix4fv(uni_v_matrix, false, v_matrix);

    const uni_p_matrix = gl.getUniformLocation(program, 'p_matrix');
    gl.uniformMatrix4fv(uni_p_matrix, false, p_matrix);

    const uni_time = gl.getUniformLocation(program, 'time');
    gl.uniform1f(uni_time, time);

    const uni_mouse = gl.getUniformLocation(program, 'mouse');
    gl.uniform2fv(uni_mouse, [0, 0]);

    const uni_resolution = gl.getUniformLocation(program, 'resolution');
    gl.uniform2fv(uni_resolution, [window.innerWidth, window.innerHeight]);

    const uni_cpos = gl.getUniformLocation(program, 'cPos');
    gl.uniform3fv(uni_cpos, camera.pos);

    const attr_position = gl.getAttribLocation(program, 'position');
    const vertex_buffer = createVBO(gl, new Float32Array(vertices));

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const attr_index = gl.getAttribLocation(program, 'index');
    const index_buffer = createIBO(gl, new Uint16Array(indecies));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    const render = () => {
      time ++;
      mat4.translate(
        m_matrix,
        mat4.identity(mat4.create()),
        [Math.sin(time * Math.PI / 180) * 4, 0, Math.cos(time * Math.PI / 180) * 2]
      );
      mat4.invert(m_matrix2, m_matrix);

      gl.clearColor(0.95, 0.95, 0.95, 1.0);
  		gl.clearDepth(1.0);
  		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(program);

      setArrayBuffer(gl, vertex_buffer, attr_position, 3);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

      gl.uniform1f(uni_time, time);
      gl.uniform2fv(uni_resolution, [window.innerWidth, window.innerHeight]);
      gl.uniformMatrix4fv(uni_m_matrix, false, m_matrix);
      gl.uniformMatrix4fv(uni_m_matrix2, false, m_matrix2);

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
};
