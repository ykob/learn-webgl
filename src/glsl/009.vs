precision mediump float;

attribute vec3 position;
attribute vec3 color;

uniform float time;

varying vec3 vPosition;
varying vec3 vColor;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise4 = require(glsl-noise/classic/4d)
#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)
#pragma glslify: pnoise4 = require(glsl-noise/periodic/4d)

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)

void main() {
  float update_time = time / 1000.0;
  float noise = snoise3(vec3(position + update_time * 2.0)) * 0.6;

  vPosition = position;
  vColor = hsv2rgb(vec3(color.x + update_time, color.yz));

  gl_PointSize = 1.0;
  gl_Position = vec4(position.x, position.x + noise - 0.3, position.z, 1.0);
}
