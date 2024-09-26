/*!
 * Bez 1.0.11
 * http://github.com/rdallasgray/bez
 *
 * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
 *
 * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
 * See http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
 *
 * Copyright 2016 Robert Dallas Gray. All rights reserved.
 * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
 */
!function(n){"object"==typeof exports?n(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],n):n(jQuery)}(function(e){e.extend({bez:function(n,i){if(e.isArray(n)&&(n="bez_"+(i=n).join("_").replace(/\./g,"p")),"function"!=typeof e.easing[n]){var f=function(u,r){var t=[null,null],i=[null,null],f=[null,null],o=function(n,e){return f[e]=3*u[e],i[e]=3*(r[e]-u[e])-f[e],t[e]=1-f[e]-i[e],n*(f[e]+n*(i[e]+n*t[e]))},c=function(n){return f[0]+n*(2*i[0]+3*t[0]*n)},e=function(n){for(var e,u=n,r=0;++r<14&&(e=o(u,0)-n,!(Math.abs(e)<.001));)u-=e/c(u);return u};return function(n){return o(e(n),1)}};e.easing[n]=function(n,e,u,r,t){return r*f([i[0],i[1]],[i[2],i[3]])(e/t)+u}}return n}})});