precision mediump float;

attribute vec3 position;

uniform float time;
uniform mat4 p_matrix;
uniform mat4 mv_matrix;

varying vec3 vColor;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(./module/hsv2rgb)

void main() {
  float update_time = time / 1000.0;
  float noise = snoise3(vec3(position / 1000.0 + update_time * 4.0));
  vec4 mv_position = mv_matrix * vec4(position * (noise * 0.3 + 1.0), 1.0);

  vColor = hsv2rgb(vec3(noise * 0.3 + update_time, 0.5, 1.0));

  gl_Position = p_matrix * mv_position;
}
