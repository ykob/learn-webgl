precision mediump float;

uniform float time;

varying vec3 vPosition;
varying vec3 vColor;

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)
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
  float noise = snoise3(vec3(vPosition.x * (sin(radians(time)) * 0.2 + 2.0), vPosition.y * (cos(radians(time)) * 0.2 + 2.0), vPosition.z + time / 100.0));
  vec3 custom_color = hsv2rgb(vec3(vColor.x + noise / 2.0, vColor.yz));
  gl_FragColor = vec4(custom_color, 1.0);
}
