import yts = require("yt-search");
import PlaylistInfo = require("../../structures/PlaylistInfo");
import SoundTrack = require("../../structures/SoundTrack");
import YoutubeTrack = require("./YoutubeTrack");
import YoutubeSearchManager = require("./YoutubeSearchManager");

type PlaylistMetadata = yts.PlaylistMetadataResult;

class YoutubePlaylist extends PlaylistInfo {
    public readonly metadata: PlaylistMetadata;
    private readonly tracks: SoundTrack[];
    public readonly source: YoutubeSearchManager;
    public constructor(data: PlaylistMetadata, source: YoutubeSearchManager) {
        super(YoutubePlaylist.buildPlaylistObject(data));
        this.metadata = data;
        this.source = source;
        this.tracks = data.videos.map(t => new YoutubeTrack(t, source));
    }

    static buildPlaylistObject(metadata: PlaylistMetadata) {
        return {
            title: metadata.title,
            identifier: metadata.listId
        }
    }

    public getTitle() { return this.metadata.title; }
    public getArtworkURL() { return this.metadata.image; }
    public getIdentifier() { return this.metadata.listId; }
    public getSize() { return this.metadata.videos.length; }
    public getTracks() { return this.tracks; }
    public getSource() { return this.source; }
    public getURL() { return `https://www.youtube.com/playlist?list=${this.getIdentifier()}`; }
    public getMetadataInfo() { return YoutubePlaylist.buildPlaylistObject(this.metadata); }

}

export = YoutubePlaylist;