precision mediump float;

uniform float time;

varying vec3 vPosition;

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
  vec3 hsv = vec3(0.0, 0.5, 0.5);
  float noise = snoise3(vec3(vPosition * 4.0 + time / 100.0));
  vec3 custom_color = hsv2rgb(vec3(hsv.x - noise / 2.0, hsv.y, hsv.z - noise / 2.0));
  gl_FragColor = vec4(custom_color, 1.0);
}
