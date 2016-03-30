#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

const vec3 lightDir = vec3(0.577, -0.577, 0.577);

#pragma glslify: hsv2rgb = require(./module/hsv2rgb)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: rotate = require(./module/raymarching/rotate)
#pragma glslify: dFloor = require(./module/raymarching/dFloor)
#pragma glslify: dSphere = require(./module/raymarching/dSphere)
#pragma glslify: dBox = require(./module/raymarching/dBox)
#pragma glslify: dTorus = require(./module/raymarching/dTorus)
#pragma glslify: dCapsule = require(./module/raymarching/dCapsule)
#pragma glslify: smin = require(./module/raymarching/smin)
#pragma glslify: sphericalPolarCoord = require(./module/raymarching/sphericalPolarCoord)

float dsBox(vec3 p, vec3 size, float v) {
  return length(max(abs(p) - size, 0.0)) - v;
}

float distanceFunc(vec3 p) {
  float n1 = snoise3(p * 0.3 + time / 200.0);
  vec3 p1 = rotate(p, radians(time), radians(time * 2.0), radians(time));
  float d1 = dsBox(p1, vec3(2.0), 0.5);
  float d2 = dSphere(p1, 3.2) - n1;
  float d3 = dSphere(p1, 1.8) - n1;
  return min(max(d1, -d2), d3);
}

vec3 getNormal(vec3 p) {
  const float d = 0.1;
  return normalize(vec3(
    distanceFunc(p + vec3(d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
    distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc(p + vec3(0.0, -d, 0.0)),
    distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
  ));
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 cPos = vec3(0.0, 0.0, 10.0);
  vec3 cDir = vec3(0.0, 0.0, -1.0);
  vec3 cUp  = vec3(0.0, 1.0, 0.0);
  vec3 cSide = cross(cDir, cUp);
  float targetDepth = 1.4;

  vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

  float distance = 0.0;
  float rLen = 0.0;
  vec3  rPos = cPos;
  for(int i = 0; i < 64; i++){
      distance = distanceFunc(rPos);
      rLen += distance;
      rPos = cPos + ray * rLen * 0.1;
  }

  vec3 normal = getNormal(rPos);
  if(abs(distance) < 1.0){
    float n = snoise3(rPos * 0.3 + time / 200.0);
    vec3 p = rotate(rPos, radians(time * -2.0), radians(time * 2.0), radians(time * -2.0));
    float d = dSphere(p, 1.6) - n;
    if (d > 1.0) {
      gl_FragColor = vec4(hsv2rgb(vec3(dot(normal, cUp) * 0.8 + time / 200.0, 0.2, dot(normal, cUp) * 0.8 + 0.1)), 1.0);
    } else {
      gl_FragColor = vec4(hsv2rgb(vec3(dot(normal, cUp) * 0.1 + time / 200.0, 0.8, dot(normal, cUp) * 0.2 + 0.8)), 1.0);
    }
  }else {
    gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
  }
}
