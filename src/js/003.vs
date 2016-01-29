attribute vec3 position;
uniform mat4 mvp_matrix;
uniform float time;

void main() {
  float scale = 1.0 - 0.2 * sin(radians(time * 3.0));
  vec3 position_update = position * scale;
  gl_Position = mvp_matrix * vec4(position_update, 1.0);
}
