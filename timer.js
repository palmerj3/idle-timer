/*global window:true, document:true*/
var Timer = (function (win, doc, undefined) {
    'use strict';

    var DEFAULT_DURATION = 1800 * 1000,     // 30 minutes
        timeoutId,
        restart,
        preservedMouseMoveEvent = null,
        preservedKeyDownEvent = null;

    function addEventListeners() {
      if (win.addEventListener) {
        win.addEventListener('mousemove', reset, false);
        win.addEventListener('keydown', reset, false);
      } else if (win.attachEvent) {
        win.attachEvent('onmousemove', reset);
        win.attachEvent('onkeydown', reset);
      } else {
        preservedMouseMoveEvent = win.onmousemove;
        preservedKeyDownEvent = win.onkeydown;

        win.onmousemove === null ? win.onmousemove = reset : win.onmousemove = function(e) {
          preservedMouseMoveEvent(e);
          reset(e);
        }

        win.onkeydown === null ? win.onkeydown = reset : win.onkeydown = function(e) {
          preservedKeyDownEvent(e);
          reset(e);
        }
      }
    }

    function removeEventListeners() {
      if (win.addEventListener) {
        win.removeEventListener('mousemove', reset, false);
        win.removeEventListener('keydown', reset, false);
      } else if (win.attachEvent) {
        win.detachEvent('mousemove', reset);
        win.detachEvent('keydown', reset);
      } else {
        win.onmousemove = preservedMouseMoveEvent;
        win.onkeydown = preservedKeyDownEvent;
      }
    }

    function start(url, duration) {
        return function () {
            return setTimeout(function () {
                win.location.href = url;
            }, duration);
        };
    }

    function reset() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = restart();
    }

    function run(url, duration) {
        if (!url) { throw new Error('url is not defined'); }

        if (undefined === duration) {
            duration = DEFAULT_DURATION;
        }
        restart = start(url, duration);
        timeoutId = restart();
        addEventListeners();
    }

    return {
        run: run,
        dispose: function () {
            clearTimeout(timeoutId);
            timeoutId = null;
            restart = null;
            DEFAULT_DURATION = null;
            removeEventListeners();
        }
    };

}(window, document));
