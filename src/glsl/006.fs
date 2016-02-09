#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform mat4 inv_matrix;
uniform vec3 light_direction;
uniform float time;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec3 vColor;
varying vec2 vUv;

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)

void main() {
  vec3 custom_color = hsv2rgb(vColor);
  vec3 dx = dFdx(vPosition.xyz);
  vec3 dy = dFdy(vPosition.xyz);
  vec3 n = normalize(cross(normalize(dx), normalize(dy)));
  vec3 inv_light = normalize(inv_matrix * vec4(light_direction, 1.0)).xyz;
  float diff = clamp(dot(n, inv_light), 0.1, 1.0);
  vec4 smp_color = texture2D(texture, vUv);
  gl_FragColor = vec4(custom_color * diff, 1.0) * smp_color;
}
