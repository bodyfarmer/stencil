/*! Built with http://stenciljs.com */
App.loadBundle("chunk-94cc5d10.js",["exports"],function(n){window,n.assert=function(n,e){if(!n){var o="ASSERT: "+e;throw console.error(o),new Error(o)}},n.debounce=function(n,e){var o;return void 0===e&&(e=0),function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];clearTimeout(o),o=setTimeout.apply(void 0,[n,e].concat(r))}},n.now=function(n){return n.timeStamp||Date.now()},n.pointerCoord=function(n){if(n){var e=n.changedTouches;if(e&&e.length>0){var o=e[0];return{x:o.clientX,y:o.clientY}}if(void 0!==n.pageX)return{x:n.pageX,y:n.pageY}}return{x:0,y:0}}});