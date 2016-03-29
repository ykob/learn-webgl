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

float displacement(vec3 p) {
  return snoise3(p / 2.0);
}

float distanceFunc(vec3 p) {
  // vec3 p11 = rotate(p, radians(-time), radians(time), radians(time));
  // vec3 p12 = sphericalPolarCoord(2.0, radians(time), radians(time));
  // float d1 = dBox(p11 + p12, vec3(1.0));
  //
  // vec3 p21 = rotate(p, radians(time), radians(-time), radians(time));
  // vec3 p22 = sphericalPolarCoord(2.0, radians(-time), radians(time));
  // float d2 = dTorus(p21 + p22, vec2(2.0, 0.3));
  //
  // vec3 p31 = rotate(p, radians(time * 2.0), radians(time * 2.0), radians(time * -2.0));
  // vec3 p32 = sphericalPolarCoord(2.0, radians(time), radians(-time));
  // float d3 = dCapsule(p31 + p32, vec3(1.0), vec3(-1.0), 0.4);
  //
  // vec3 p4 = sphericalPolarCoord(2.0, radians(-time), radians(-time));
  // float d4 = dSphere(p + p4, 1.0);
  //
  // return smin(smin(d1, d2, 2.0), smin(d3, d4, 2.0), 2.0) + displacement(p, 0.4);

  // vec3 p1 = rotate(p, radians(time * 2.0), radians(time * 2.0), radians(time * -2.0));
  // vec3 p2 = sphericalPolarCoord(2.0, radians(time), radians(-time));
  // float d1 = dFloor(p) + snoise3(p / 2.0 + time / 30.0) * 0.5;
  // float d2 = dTorus(p1 + p2, vec2(2.0, 0.5)) + snoise3(p / 2.4 + time / 30.0) * 1.4;
  // return smin(d2, d1, 4.0);

  float d1 = dSphere(p, 4.0) + pow(snoise3(vec3(p.x, p.y + time / 50.0, p.z)), 3.0);
  float d2 = dSphere(p, 4.5);
  return max(d1, -d2);
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
  float targetDepth = 1.8;

  vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

  float distance = 0.0;
  float rLen = 0.0;
  vec3  rPos = cPos;
  for(int i = 0; i < 64; i++){
      distance = distanceFunc(rPos);
      rLen += distance;
      rPos = cPos + ray * rLen * 0.2;
  }

  vec3 normal = getNormal(rPos);
  if(distance < 1.0){
    gl_FragColor = vec4(hsv2rgb(vec3(dot(normal, cUp) * 0.4 + time / 200.0, 0.12, dot(normal, cUp) * 0.1 + 0.75)), 1.0);
  }else{
    gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
  }
}
