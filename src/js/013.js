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

  const vertices = [
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0,
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    let time = 0;

    const program = loadProgram(gl, glslify('../glsl/013.vs'), glslify('../glsl/013.fs'));

    const uni_time = gl.getUniformLocation(program, 'time');
    gl.uniform1f(uni_time, time);

    const uni_mouse = gl.getUniformLocation(program, 'mouse');
    gl.uniform2fv(uni_mouse, [0, 0]);

    const uni_resolution = gl.getUniformLocation(program, 'resolution');
    gl.uniform2fv(uni_resolution, [window.innerWidth, window.innerHeight]);

    const attr_position = gl.getAttribLocation(program, 'position');
    const vertex_buffer = createVBO(gl, new Float32Array(vertices));

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const attr_index = gl.getAttribLocation(program, 'index');
    const index_buffer = createIBO(gl, new Uint16Array(indecies));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    const render = () => {
      time ++;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
  		gl.clearDepth(1.0);
  		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(program);

      setArrayBuffer(gl, vertex_buffer, attr_position, 3);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

      gl.uniform1f(uni_time, time);
      gl.uniform2fv(uni_resolution, [window.innerWidth, window.innerHeight]);

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
