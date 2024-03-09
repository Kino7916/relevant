import yts = require("yt-search");
import ytdl = require("ytdl-core");
import prism = require("prism-media");
import SoundTrack = require("../../structures/SoundTrack");
import YoutubeSearchManager = require("./YoutubeSearchManager");
import internal = require("stream");

const FFMPEG_ARGS = [
    '-analyzeduration', '0',
    '-loglevel', '0',
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
    "-vn"
]

type TrackMetadata = yts.VideoSearchResult | yts.VideoMetadataResult | yts.PlaylistItem;

class YoutubeTrack extends SoundTrack {
    public readonly metadata: TrackMetadata;
    public readonly source: YoutubeSearchManager;

    public constructor(metadata: TrackMetadata, source: YoutubeSearchManager) {
        super(YoutubeTrack.buildTrackObject(metadata));
        this.metadata = metadata;
        this.source = source;
    }

    static buildTrackObject(metadata: TrackMetadata) {
        return {
            title: metadata.title,
            identifier: metadata.videoId,
            artworkURL: metadata.thumbnail,
            author: {...metadata.author},
            duration: metadata.duration.seconds
        }
    }

    public getTitle() { return this.metadata.title; }
    public getIdentifier() { return this.metadata.videoId; }
    public getArtworkURL() { return this.metadata.thumbnail; }
    public getSource() { return this.source; }
    public getMetadata() { return YoutubeTrack.buildTrackObject(this.metadata); }
    public getAuthor() { return this.metadata.author; }
    public getDuration() { return this.metadata.duration.seconds; }

    public async downloadPCMAudio() {
        const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${this.getIdentifier()}`);

        switch (info.player_response.playabilityStatus.status) {
            case "UNPLAYABLE":
            case "LOGIN_REQUIRED":
            case "ERROR": throw new Error(info.player_response.playabilityStatus?.["reason"]);
        }
        // audio stream is ok :D
        const live = info.videoDetails.isLiveContent;
        const opusFormat = info.formats.find(this.getOpusFormat);
        
        // A very not good solution
        // But for sake of file size :D
        if (opusFormat && !live) {
            console.log("Downloading OPUS Format");
            return internal.pipeline(
                ytdl.downloadFromInfo(info, { format: opusFormat }),
                new prism.opus.WebmDemuxer(),
                new prism.opus.Decoder({
                    frameSize: 960,
                    channels: 2,
                    rate: 48000
                }),
                () => {}
            );
        }

        console.log("Downloading Available format")
        // then is not opus
        const format = this.getOtherFormat(info.formats, live);
        if (! format)
            throw new Error("no format");

        return internal.pipeline(
            ytdl.downloadFromInfo(info, { format }),
            new prism.FFmpeg({ args: FFMPEG_ARGS }),
            () => {}
        )
    }

    private getOpusFormat(format: ytdl.videoFormat) {
        return format.codecs === "opus" &&
            format.container === "webm" &&
            format.audioSampleRate === "48000";
    }

    private getOtherFormat(formats: ytdl.videoFormat[], isLive = false) {
        const getFormat = (format: ytdl.videoFormat) => format.hasAudio && (isLive ? format.isHLS : true);
        const hasAudioFormats = formats.filter(getFormat);
        const onlyAudioFormats = hasAudioFormats.find((fmt: ytdl.videoFormat) => !fmt.hasVideo);

        return onlyAudioFormats || hasAudioFormats[0];
    }
}

export = YoutubeTrack;