precision mediump float;

attribute vec3 position;
attribute vec3 color;

varying vec3 vPosition;
varying vec3 vColor;

void main() {
  vPosition = position;
  vColor = color;
  gl_Position = vec4(position, 1.0);
}
