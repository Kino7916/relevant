import SoundTrack = require("./SoundTrack");
import SourceExtension = require("./SourceExtension");

interface IPlaylistMetadata {
    title: string;
    identifier: string;
}

abstract class PlaylistInfo {
    abstract getTitle(): string;
    abstract getArtworkURL(): string;
    abstract getIdentifier(): string;
    abstract getURL(): string;
    abstract getSize(): number;
    abstract getSource(): SourceExtension;
    abstract getTracks(): SoundTrack[];
    abstract getMetadataInfo(): IPlaylistMetadata;

    public title: string;
    public identifier: string;
    public constructor(public readonly data: IPlaylistMetadata) {
        this.title = data.title;
        this.identifier = data.identifier;
    }
}

export = PlaylistInfo;