import PlaylistInfo = require("./PlaylistInfo");
import QueryReference = require("./QueryReference");
import SoundTrack = require("./SoundTrack");
import SourceExtension = require("./SourceExtension");

class SearchResult {
    public constructor(
        public readonly query: QueryReference,
        public readonly playlist: PlaylistInfo,
        public readonly tracks: SoundTrack[],
        public readonly extension: SourceExtension,
    ) {

    }
}

export = SearchResult;