import loadShader from './loadShader.js';

export default function(gl, vs_src, fs_src) {
  const program = gl.createProgram();
  const vs = loadShader(gl.VERTEX_SHADER, gl, vs_src);
  const fs = loadShader(gl.FRAGMENT_SHADER, gl, fs_src);

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  return program;
};
