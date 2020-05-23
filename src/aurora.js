// Generated by CoffeeScript 1.12.7
(function() {
  var key, ref, val;

  ref = require('./aurora_base');
  for (key in ref) {
    val = ref[key];
    exports[key] = val;
  }

  require('./demuxers/caf');

  require('./demuxers/m4a');

  require('./demuxers/aiff');

  require('./demuxers/wave');

  require('./demuxers/au');

  require('./decoders/lpcm');

  require('./decoders/xlaw');

}).call(this);
