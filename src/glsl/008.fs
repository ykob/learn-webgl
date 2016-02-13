precision mediump float;

uniform float time;

varying vec3 vPosition;
varying vec3 vColor;

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
