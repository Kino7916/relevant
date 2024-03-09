import internal = require("stream");
import SoundTrack = require("./SoundTrack");


class Sound extends internal.PassThrough {
    public readonly track: SoundTrack;
    
    public constructor() {
        super();
    }
}

export = Sound;