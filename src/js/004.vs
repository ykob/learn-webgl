precision mediump float;

attribute vec3 position;
attribute vec3 color;
attribute vec3 normal;

uniform mat4 p_matrix;
uniform mat4 mv_matrix;

varying vec3 vNormal;
varying vec3 vColor;

void main() {
  vNormal = normal;
  vColor = color;

  vec3 update_position = (mv_matrix * vec4(position, 1.0)).xyz;
  gl_Position = p_matrix * vec4(update_position, 1.0);
}
