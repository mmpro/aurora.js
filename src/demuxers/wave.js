// Generated by CoffeeScript 1.12.7
(function() {
  var Demuxer, WAVEDemuxer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Demuxer = require('../demuxer');

  WAVEDemuxer = (function(superClass) {
    var formats;

    extend(WAVEDemuxer, superClass);

    function WAVEDemuxer() {
      return WAVEDemuxer.__super__.constructor.apply(this, arguments);
    }

    Demuxer.register(WAVEDemuxer);

    WAVEDemuxer.probe = function(buffer) {
      return buffer.peekString(0, 4) === 'RIFF' && buffer.peekString(8, 4) === 'WAVE';
    };

    formats = {
      0x0001: 'lpcm',
      0x0003: 'lpcm',
      0x0006: 'alaw',
      0x0007: 'ulaw'
    };

    WAVEDemuxer.prototype.readChunk = function() {
      var buffer, bytes, encoding;
      if (!this.readStart && this.stream.available(12)) {
        if (this.stream.readString(4) !== 'RIFF') {
          return this.emit('error', 'Invalid WAV file.');
        }
        this.fileSize = this.stream.readUInt32(true);
        this.readStart = true;
        if (this.stream.readString(4) !== 'WAVE') {
          return this.emit('error', 'Invalid WAV file.');
        }
      }
      while (this.stream.available(1)) {
        if (!this.readHeaders && this.stream.available(8)) {
          this.type = this.stream.readString(4);
          this.len = this.stream.readUInt32(true);
        }
        switch (this.type) {
          case 'fmt ':
            encoding = this.stream.readUInt16(true);
            if (!(encoding in formats)) {
              return this.emit('error', 'Unsupported format in WAV file.');
            }
            this.format = {
              formatID: formats[encoding],
              floatingPoint: encoding === 0x0003,
              littleEndian: formats[encoding] === 'lpcm',
              channelsPerFrame: this.stream.readUInt16(true),
              sampleRate: this.stream.readUInt32(true),
              framesPerPacket: 1
            };
            this.stream.advance(4);
            this.stream.advance(2);
            this.format.bitsPerChannel = this.stream.readUInt16(true);
            this.format.bytesPerPacket = (this.format.bitsPerChannel / 8) * this.format.channelsPerFrame;
            this.emit('format', this.format);
            this.stream.advance(this.len - 16);
            break;
          case 'data':
            if (!this.sentDuration) {
              bytes = this.format.bitsPerChannel / 8;
              this.emit('duration', this.len / bytes / this.format.channelsPerFrame / this.format.sampleRate * 1000 | 0);
              this.sentDuration = true;
            }
            buffer = this.stream.readSingleBuffer(this.len);
            this.len -= buffer.length;
            this.readHeaders = this.len > 0;
            this.emit('data', buffer);
            break;
          default:
            if (!this.stream.available(this.len)) {
              return;
            }
            this.stream.advance(this.len);
        }
        if (this.type !== 'data') {
          this.readHeaders = false;
        }
      }
    };

    return WAVEDemuxer;

  })(Demuxer);

}).call(this);
