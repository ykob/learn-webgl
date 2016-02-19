precision mediump float;

attribute vec3 position;

uniform float time;
uniform mat4 p_matrix;
uniform mat4 mv_matrix;

varying vec3 vPosition;
varying vec3 vColor;
varying vec4 vMvPosition;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(./module/hsv2rgb)

void main() {
  float update_time = time / 1000.0;
  float noise = snoise3(vec3(position + update_time * 2.0));
  vec4 mv_position = mv_matrix * vec4(position * (noise * 0.3 + 1.0), 1.0);

  vPosition = position;
  vColor = hsv2rgb(vec3(noise + update_time, 0.5, 1.0));
  vMvPosition = mv_position;

  gl_PointSize = 1.0;
  gl_Position = p_matrix * mv_position;
}
