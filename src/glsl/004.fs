precision mediump float;

uniform mat4 inv_matrix;
uniform vec3 light_direction;
uniform float time;

varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)
#pragma glslify: random = require(./module/random)

void main() {
  vec3 inv_light = normalize(inv_matrix * vec4(light_direction, 1.0)).xyz;
  float diff = clamp(dot(inv_light, vNormal), 0.1, 1.0);
  gl_FragColor = vec4(hsv2rgb(vColor) * diff * random(gl_FragCoord.xy * (time / 1000.0)), 1.0);
}
