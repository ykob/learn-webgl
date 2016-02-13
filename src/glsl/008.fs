precision mediump float;

uniform float time;

varying vec3 vPosition;
varying vec3 vColor;
varying vec4 vMvPosition;

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)

void main() {
  float opacity = clamp(400.0 / length(vMvPosition.xyz), 0.1, 1.0);
  gl_FragColor = vec4(hsv2rgb(vColor), opacity);
}
