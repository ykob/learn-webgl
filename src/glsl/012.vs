precision mediump float;

attribute vec3 position;
attribute vec3 color;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 p_matrix;
uniform mat4 mv_matrix;

varying vec3 vPosition;
varying vec3 vColor;
varying vec2 vUv;

void main() {
  vPosition = position;
  vColor = color;
  vUv = uv;

  vec4 mv_position = mv_matrix * vec4(position, 1.0);
  gl_Position = p_matrix * mv_position;
}
