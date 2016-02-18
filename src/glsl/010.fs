precision mediump float;

uniform float time;

varying vec3 vPosition;
varying vec3 vColor;
varying vec4 vMvPosition;

void main() {
  gl_FragColor = vec4(vColor, 0.1);
}
