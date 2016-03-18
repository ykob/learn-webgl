import Util from './modules/util.js';
import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';

export default function() {
  const glslify = require('glslify');
  const canvas = document.getElementById('webgl-contents');
  const gl = canvas.getContext('webgl');

  const vertices = [];

  const init = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${document.body.clientWidth}px`;
    canvas.style.height = `${document.body.clientHeight}px`;

    gl.clearColor(0.98, 0.98, 0.98, 1.0);
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LESS);
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < 480; x++) {
      for (var z = 0; z < 480; z++) {
        vertices.push(
          x * 5 - 1200,
          200,
          (z * 5 - 1200) * (x % 2 * 2 - 1)
        );
      }
    }

    const center = [0.0, 0.0, 0.0];
    const camera = {
      position: [1500.0, 500.0, 1500.0],
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

    const program = loadProgram(gl, glslify('../glsl/011.vs'), glslify('../glsl/011.fs'));

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

    const render = () => {
      time ++;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uni_time, time);
      gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 3);
    };
    const renderLoop = () => {
      render();
      requestAnimationFrame(renderLoop);
    };
    renderLoop();
  };
  init();
};
