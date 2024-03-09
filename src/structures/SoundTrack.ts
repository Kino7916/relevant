import prism = require("prism-media");
import SourceExtension = require("./SourceExtension");
import fs = require("fs");

declare interface ITrackMetadata {
    title: string;
    identifier: string;
    artworkURL: string;
    author: { name: string; url: string; }
    duration: number;
};

abstract class SoundTrack {
    abstract getTitle(): string;
    abstract getIdentifier(): string;
    abstract getMetadata(): ITrackMetadata;
    abstract getArtworkURL(): string;
    abstract getAuthor(): { name: string; url: string; }
    abstract getDuration(): number;

    abstract getSource(): SourceExtension;
    abstract downloadPCMAudio(): Promise<prism.FFmpeg | prism.opus.Decoder>;

    public title: string;
    public id: string;
    public artworkURL: string;
    public author: { name: string; url: string; }
    public duration: number
    public constructor(public readonly track_object: ITrackMetadata) {
        this.title = track_object.title;
        this.id = track_object.identifier;
        this.artworkURL = track_object.artworkURL;
        this.author = track_object.author;
        this.duration = track_object.duration;
    }
}

export = SoundTrack;