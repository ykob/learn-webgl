import Util from './modules/util.js';
import resizeWindow from './modules/resizeWindow.js';
import isSupportedWebGL from './modules/isSupportedWebGL.js';
import loadProgram from './modules/loadProgram.js';

export default function() {
  const glslify = require('glslify');
  const canvas = document.getElementById('webgl-contents');
  const gl = canvas.getContext('webgl');

  const vertices = [];
  const colors = [];

  const init = () => {
    resizeWindow(canvas);
    isSupportedWebGL(gl);
    gl.clearColor(0.95, 0.95, 0.95, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < 500000; i++) {
      vertices.push(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        0
      );
      colors.push(0.0, 0.2, 0.8);
    }

    let time = 0;


    const program = loadProgram(gl, glslify('../glsl/009.vs'), glslify('../glsl/009.fs'));

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
      gl.drawArrays(gl.POINTS, 0, vertices.length / 3);
    };
    const renderLoop = () => {
      render();
      requestAnimationFrame(renderLoop);
    };
    renderLoop();
  };
  init();
};
