precision mediump float;

varying vec3 vColor;

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)

void main() {
  gl_FragColor = vec4(hsv2rgb(vColor), 1.0);
}
