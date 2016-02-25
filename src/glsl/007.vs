precision mediump float;

attribute vec3 position;

varying vec3 vPosition;

void main() {
  vPosition = position;
  gl_Position = vec4(position, 1.0);
}
