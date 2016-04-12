precision highp float;

attribute vec3 position;

uniform mat4 p_matrix;
uniform mat4 mv_matrix;

void main(void) {
  vec4 mv_position = mv_matrix * vec4(position, 1.0);
  gl_Position = p_matrix * mv_position;
}
