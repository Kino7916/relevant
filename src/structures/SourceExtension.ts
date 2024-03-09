import QueryReference = require("./QueryReference");
import SearchResult = require("./SearchResult");

abstract class SourceExtension {
    abstract validate(query: QueryReference): boolean;
    abstract search(query: QueryReference): Promise<SearchResult>;
}

export = SourceExtension;