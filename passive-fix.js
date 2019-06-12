/**
 * Override native addEventListener to apply passive event listeners
 *
 * Copyright (C) 2019 Style.Tools
 * @link https://github.com/style-tools/jquery-passive
 */

(function(win, doc){

    var altName, nodeName,
        root_nodes = ['Element', 'Document'], // root nodes
        _addEventListener = 'addEventListener',
        passive_events = ['wheel','mousewheel','touchstart','touchmove']; // passive events

    // extract passive events
    function passive(str, types, result, passive) {
        types = str.toLowerCase().split(/\s+/g);
        for (var i =0, l = types.length; i < l; i++) {
            if (passive_events.indexOf(types[i]) !== -1) {
                return 1;
            }
        }
        return 0;
    }

    // override native addEventListener on root nodes
    for (var i =0, l = root_nodes.length; i < l; i++) {
        nodeName = root_nodes[i];
        altName = '_' + nodeName;
        if (!(altName in win) || !(_addEventListener in win[altName])) {
            win[altName] = win[altName] || {};

            // store original methods
            win[altName][_addEventListener] = win[nodeName].prototype[_addEventListener];

            // re-write add method
            win[nodeName].prototype[_addEventListener] = function(evt) {

                var evt = arguments[0], fn = arguments[1], opts = arguments[2], _opts = {};

                // detect passive event
                var _passive = passive(evt);
                if (_passive) {

                    if (typeof opts === 'object') {
                        if ("once" in opts) {
                            _opts.once = opts.once;
                        }
                    } else {
                        _opts.capture = !!opts;
                    }

                    _opts.passive = true;
                    opts = _opts;
                }

                return win[altName][_addEventListener].call(this, evt, fn, opts);
            };
        }
    };

}(window, document));