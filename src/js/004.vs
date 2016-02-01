attribute vec3 position;
attribute vec3 color;
attribute vec3 normal;

uniform float time;
uniform mat4 mvp_matrix;
uniform vec3 light_direction;

varying vec3 vColor;

void main() {
  float scale = 1.0 - 0.2 * sin(radians(time * 3.0));
  mat4 rotate = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, cos(radians(time)), sin(radians(time)) * -1.0, 0.0,
    0.0, sin(radians(time)), cos(radians(time)), 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  mat4 m_matrix = rotate;
  mat4 inv_matrix = m_matrix;
  vec3 inv_light = (inv_matrix * vec4(light_direction, 1.0)).xyz;
  float diff = clamp(dot(normalize(inv_light), normal), 0.1, 1.0);

  vColor = color * diff;

  vec4 position_update = vec4(position * scale, 1.0) * rotate;
  gl_Position = mvp_matrix * vec4(position_update);
}
