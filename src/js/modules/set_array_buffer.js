export default function(gl, buffer, array, length) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(array);
  gl.vertexAttribPointer(array, length, gl.FLOAT, false, 0, 0);
};
