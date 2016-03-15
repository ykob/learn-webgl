#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

const vec3 lightDir = vec3(0.577, -0.577, 0.577);

vec3 trans(vec3 p) {
  return mod(vec3(p), 4.0) - 2.0;
}

float dFloor(vec3 p) {
  return dot(p, vec3(0.0, 1.0, 0.0)) + 1.0;
}

float dSphere(vec3 p, float r) {
  return length(p) - r;
}

float dBox(vec3 p, vec3 size) {
  return length(max(abs(p) - size, 0.0));
}

float smoothMin(float d1, float d2, float k){
  float h = exp(-k * d1) + exp(-k * d2);
  return -log(h) / k;
}

float distanceFunc(vec3 p) {
  float d1 = dBox(trans(p), vec3(0.15, 0.15, 2.0));
  float d2 = dBox(trans(p), vec3(0.15, 2.0, 0.15));
  float d3 = dBox(trans(p), vec3(2.0, 0.15, 0.15));
  return smoothMin(smoothMin(d1, d2, 4.0), d3, 4.0);
}

vec3 getNormal(vec3 p) {
  const float d = 0.0001;
  return normalize(vec3(
    distanceFunc(p + vec3(d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
    distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc(p + vec3(0.0, -d, 0.0)),
    distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
  ));
}

void main() {
  // fragment position
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // camera
  vec3 cPos = vec3(mouse.xy, 10.0);
  vec3 cDir = vec3(0.0, 0.0, -1.0);
  vec3 cUp  = vec3(0.4, 1.0, 0.0);
  vec3 cSide = cross(cDir, cUp);
  float targetDepth = 1.8;

  // ray
  vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

  // marching loop
  float distance = 0.0; // レイとオブジェクト間の最短距離
  float rLen = 0.0;     // レイに継ぎ足す長さ
  vec3  rPos = cPos;    // レイの先端位置
  for(int i = 0; i < 64; i++){
      distance = distanceFunc(rPos);
      rLen += distance;
      rPos = cPos + ray * rLen;
  }

  // hit check
  vec3 normal = getNormal(rPos);
  // float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
  if(abs(distance) < 0.001){
    gl_FragColor = vec4(normal, 1.0);
  }else{
    gl_FragColor = vec4(0.0);
  }
}
