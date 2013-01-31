/*global jQuery:true, window:true, document:true*/
'use strict';

var Timer = (function ($, win, doc, undefined) {
    var DEFAULT_DURATION = 1800 * 1000,     // 30 minutes
        timeoutId,
        restart;

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

        $(doc).ready(function () {
            timeoutId = restart();
        });

        $(win).bind('mousemove keydown', reset);
    }

    return {
        run: run,
        dispose: function () {
            clearTimeout(timeoutId);
            timeoutId = null;
            restart = null;
            DEFAULT_DURATION = null;
            $(win).unbind('mousemove keydown');
        }
    };

}(jQuery, window, document));
