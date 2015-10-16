
'use strict';

var snap = require('./snapsvglite');

var helpers = {
  _cancelAnimationFrame: window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame,
  _requestAnimationFrame: window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame
};

// Calculate style
helpers.styleNormCalc = function (styleNormFrom, styleNormTo, progress) {
  var i, len, styleNorm = {};
  for (i in styleNormFrom) {
    switch (i) {
      case 'fill':
      case 'stroke':
        styleNorm[i] = clone(styleNormFrom[i]);
        styleNorm[i].r = styleNormFrom[i].r + (styleNormTo[i].r - styleNormFrom[i].r) * progress;
        styleNorm[i].g = styleNormFrom[i].g + (styleNormTo[i].g - styleNormFrom[i].g) * progress;
        styleNorm[i].b = styleNormFrom[i].b + (styleNormTo[i].b - styleNormFrom[i].b) * progress;
        styleNorm[i].opacity = styleNormFrom[i].opacity + (styleNormTo[i].opacity - styleNormFrom[i].opacity) * progress;
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[i] = styleNormFrom[i] + (styleNormTo[i] - styleNormFrom[i]) * progress;
        break;
    }
  }
  return styleNorm;
};

helpers.styleNormToString = function (styleNorm) {
  var i;
  var style = {};
  for (i in styleNorm) {
    switch (i) {
      case 'fill':
      case 'stroke':
        style[i] = snap.rgbToString(styleNorm[i]);
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        style[i] = styleNorm[i];
        break;
    }
  }
  return style;
};

helpers.styleToNorm = function (styleFrom, styleTo) {
  var styleNorm = [{}, {}];
  var i;
  for (i in styleFrom) {
    switch (i) {
      case 'fill':
      case 'stroke':
        styleNorm[0][i] = snap.getRGB(styleFrom[i]);
        if (styleTo[i] === undefined) {
          styleNorm[1][i] = snap.getRGB(styleFrom[i]);
          styleNorm[1][i].opacity = 0;
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[0][i] = styleFrom[i];
        if (styleTo[i] === undefined) {
          styleNorm[1][i] = 1;
        }
        break;
    }
  }
  for (i in styleTo) {
    switch (i) {
      case 'fill':
      case 'stroke':
        styleNorm[1][i] = snap.getRGB(styleTo[i]);
        if (styleFrom[i] === undefined) {
          styleNorm[0][i] = snap.getRGB(styleTo[i]);
          styleNorm[0][i].opacity = 0;
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[1][i] = styleTo[i];
        if (styleFrom[i] === undefined) {
          styleNorm[0][i] = 1;
        }
        break;
    }
  }
  return styleNorm;
};

// Calculate transform progress
helpers.transCalc = function (transFrom, transTo, progress) {
  var res = {};
  for (var i in transFrom) {
    switch (i) {
      case 'rotate':
        res[i] = [0, 0, 0];
        for (var j = 0; j < 3; j++) {
          res[i][j] = transFrom[i][j] + (transTo[i][j] - transFrom[i][j]) * progress;
        }
        break;
    }
  }
  return res;
};

helpers.trans2string = function (trans) {
  var res = '';
  if (Boolean(trans.rotate)) {
    res += 'rotate(' + trans.rotate.join(' ') + ')';
  }
  return res;
};

// Calculate curve progress
helpers.curveCalc = function (curveFrom, curveTo, progress) {
  var curve = [];
  for (var i = 0, len1 = curveFrom.length; i < len1; i++) {
    curve.push([curveFrom[i][0]]);
    for (var j = 1, len2 = curveFrom[i].length; j < len2; j++) {
      curve[i].push(curveFrom[i][j] + (curveTo[i][j] - curveFrom[i][j]) * progress);
    }
  }
  return curve;
};

module.exports = helpers;


