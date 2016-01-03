import { resizeWindow } from './modules/resizeWindow.js';

const canvas = document.getElementById('webgl-contents');
const glslify = require('glslify');
const vs = glslify('./001.vs');

const init = () => {
  resizeWindow(canvas);
};
init();
