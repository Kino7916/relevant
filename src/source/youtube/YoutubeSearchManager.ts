import ytdl = require("ytdl-core");
import yts = require("yt-search");
import QueryReference = require("../../structures/QueryReference");
import SourceExtension = require("../../structures/SourceExtension");
import YoutubeTrack = require("./YoutubeTrack");
import SearchResult = require("../../structures/SearchResult");
import YoutubePlaylist = require("./YoutubePlaylist");

// Checks if url is able to be processed by extension
const handler = (url: URL) => {
    if (ytdl.validateURL(url.toString()))
        return "youtube";
    return undefined;
}

QueryReference.URLQueryHandlers.add(handler); // :3

class YoutubeSearchManager extends SourceExtension {
    public validate(query: QueryReference) {
        // Check if possibility of url
        const is1 = ytdl.validateURL(query.identifier);
        if (is1) return is1;
        // try {
        //     const url = query instanceof URL ? query : new URL(query);
        //     if (url.hostname === "youtube.com") return true;
        //     if (url.hostname === "m.youtube.com") return true;
        //     if (url.hostname === "youtu.be") return true;
        // } catch { /* Not a url */ }
        
        return true;
    }

    public async search(searchQuery: QueryReference): Promise<SearchResult> {
        const query = this.buildQuery(searchQuery);
        if (query.sourceName !== "youtube")
            throw new Error('unsupported extension');

        const url = ytdl.validateURL(query.identifier) ? new URL(query.identifier) : undefined;

        if (url) {
            const videoId = url.searchParams.get("v");
            const listId = url.searchParams.get("list");
            
            const playlist = listId ? new YoutubePlaylist(await yts.search({ listId }), this) : null;
            const video = (!playlist && videoId) ? new YoutubeTrack(await yts.search({ videoId }), this) : null;
            const tracks = playlist ? playlist.getTracks() : [ video ];

            return new SearchResult(query, playlist, tracks, this);
        }

        const results = await yts.search({ query: query.identifier });
        return new SearchResult(
            query,
            null,
            results.videos.map(data => this.buildTrack(data)),
            this
        )
    }

    private buildTrack(data: yts.VideoMetadataResult | yts.VideoSearchResult) {
        return new YoutubeTrack(data, this);
    }

    private buildQuery(query: string | QueryReference) {
        if (query instanceof QueryReference) return query;
        return new QueryReference(query);
    }
}

export = YoutubeSearchManager;