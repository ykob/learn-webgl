precision highp float;

attribute vec3 position;

uniform mat4 m_matrix;
uniform mat4 v_matrix;
uniform mat4 p_matrix;

void main(void) {
  vec4 mv_position = v_matrix * m_matrix * vec4(position, 1.0);
  gl_Position = p_matrix * mv_position;
}
