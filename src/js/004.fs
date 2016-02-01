precision mediump float;

uniform vec3 light_direction;

varying vec3 vNormal;
varying vec3 vColor;
varying mat4 vModelMatrix;

vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  mat4 inv_matrix = vModelMatrix;
  vec3 inv_light = (inv_matrix * vec4(light_direction, 1.0)).xyz;
  float diff = clamp(dot(normalize(inv_light), vNormal), 0.1, 1.0);
  gl_FragColor = vec4(hsv2rgb(vColor) * diff, 1.0);
}
