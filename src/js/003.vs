attribute vec3 position;
uniform mat4 mvp_matrix;
uniform float time;

void main() {
  float scale = 1.0 - 0.2 * sin(radians(time * 3.0));
  mat3 rotate_x = mat3(
    1.0, 0.0, 0.0,
    0.0, cos(radians(time)), sin(radians(time)) * -1.0,
    0.0, sin(radians(time)), cos(radians(time))
  );
  vec3 position_update = position * scale * rotate_x;
  gl_Position = mvp_matrix * vec4(position_update, 1.0);
}