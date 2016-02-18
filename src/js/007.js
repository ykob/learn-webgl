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
];
const indecies = [
  0, 1, 2,  3, 2, 1,
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
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const center = [0.0, 0.0, 0.0];
  const camera = {
    position: [0.0, 0.0, -3.0],
    up: [0.0, 1.0, 0.0]
  };

  let fovy = 45;
  let aspect = canvas.width / canvas.height;
  let near = 0.1;
  let far = 100.0;

  let time = 0;

  const program = loadProgram(gl, glslify('../glsl/007.vs'), glslify('../glsl/007.fs'));

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

  const render = () => {
    time ++;
    gl.clear(gl.COLOR_BUFFER_BIT);
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
