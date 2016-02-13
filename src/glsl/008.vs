precision mediump float;

attribute vec3 position;
attribute vec3 color;

uniform float time;
uniform mat4 p_matrix;
uniform mat4 mv_matrix;

varying vec3 vPosition;
varying vec3 vColor;
varying vec4 vMvPosition;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise4 = require(glsl-noise/classic/4d)
#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)
#pragma glslify: pnoise4 = require(glsl-noise/periodic/4d)

void main() {
  float update_time = time / 150.0;
  float noise = snoise3(vec3(position + update_time));
  vec4 mv_position = mv_matrix * vec4(position * noise, 1.0);

  vPosition = position;
  vColor = color;
  vMvPosition = mv_position;

  gl_Position = p_matrix * mv_position;
}
