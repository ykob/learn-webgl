export default function(type, gl, shader_src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shader_src);
  gl.compileShader(shader);
  return shader;
};
