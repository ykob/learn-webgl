precision mediump float;

uniform float time;

varying vec3 vPosition;

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
  vec3 hsv = vec3(0.0, 0.8, 1.0);
  float noise = snoise3(vec3(vPosition.x, vPosition.y * (cos(radians(time * 10.0)) * 0.1 + 200.0), vPosition.z + time / 100.0));
  vec3 custom_color = hsv2rgb(vec3(hsv.x - (noise / 5.0), hsv.y - (noise / 2.0 + 0.28), hsv.z - (noise / 3.0 + 0.1)));
  gl_FragColor = vec4(custom_color, 1.0);
}
