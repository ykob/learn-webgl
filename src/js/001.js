import { resizeWindow } from './modules/resizeWindow.js';

const canvas = document.getElementById('webgl-contents');
const gl = canvas.getContext('webgl');
const glslify = require('glslify');
const vs_src = glslify('./001.vs');
const fs_src = glslify('./001.fs');

const isSupportedWebGL = () => {
  if (!gl) {
    alert('WebGL Not Supported.');
  }
};

const generateTriangle = () => {
  return {
    p: [
       0.0,  0.5, 0.0,
       0.5, -0.5, 0.0,
      -0.5, -0.5, 0.0
    ]
  };
};

const init = () => {
  resizeWindow(canvas);
  isSupportedWebGL();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const triangle_data = generateTriangle();

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_data.p), gl.STATIC_DRAW);

  const vs = gl.createShader(gl.VERTEX_SHADER);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  const programs = gl.createProgram();
  gl.shaderSource(vs, vs_src);
  gl.compileShader(vs);
  gl.attachShader(programs, vs);
  gl.shaderSource(fs, fs_src);
  gl.compileShader(fs);
  gl.attachShader(programs, fs);
  gl.linkProgram(programs);
  gl.useProgram(programs);

  const attr_location = gl.getAttribLocation(programs, 'position');
  gl.enableVertexAttribArray(attr_location);
  gl.vertexAttribPointer(attr_location, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, triangle_data.p.length / 3);
  gl.flush();

};
init();
