attribute vec3 position;
attribute vec3 color;
attribute vec3 normal;

uniform float time;
uniform mat4 mvp_matrix;

varying vec3 vNormal;
varying vec3 vColor;
varying mat4 vModelMatrix;

void main() {
  float scale = 1.0 - 0.2 * sin(radians(time * 3.0));
  mat4 rotate = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, cos(radians(time)), sin(radians(time)) * -1.0, 0.0,
    0.0, sin(radians(time)), cos(radians(time)), 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  mat4 m_matrix = rotate;

  vNormal = normal;
  vColor = color;
  vModelMatrix = m_matrix;

  vec4 position_update = vec4(position * scale, 1.0) * m_matrix;
  gl_Position = mvp_matrix * vec4(position_update);
}
