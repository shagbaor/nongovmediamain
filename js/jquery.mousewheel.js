/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
!function(o){function n(e){var n=e||window.event,t=[].slice.call(arguments,1),i=0,l=0,s=0;return(e=o.event.fix(n)).type="mousewheel",n.wheelDelta&&(i=n.wheelDelta/120),n.detail&&(i=-n.detail/3),s=i,n.axis!==undefined&&n.axis===n.HORIZONTAL_AXIS&&(s=0,l=-1*i),n.wheelDeltaY!==undefined&&(s=n.wheelDeltaY/120),n.wheelDeltaX!==undefined&&(l=-1*n.wheelDeltaX/120),t.unshift(e,i,l,s),(o.event.dispatch||o.event.handle).apply(this,t)}var t=["DOMMouseScroll","mousewheel"];if(o.event.fixHooks)for(var e=t.length;e;)o.event.fixHooks[t[--e]]=o.event.mouseHooks;o.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var e=t.length;e;)this.addEventListener(t[--e],n,!1);else this.onmousewheel=n},teardown:function(){if(this.removeEventListener)for(var e=t.length;e;)this.removeEventListener(t[--e],n,!1);else this.onmousewheel=null}},o.fn.extend({mousewheel:function(e){return e?this.bind("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.unbind("mousewheel",e)}})}(jQuery);