type URLQueryHandler = (url: URL) => string | undefined;
/**
 * A simple reference for resolving query string
 */
class QueryReference {
    static URLQueryHandlers = new Set<URLQueryHandler>();
    public readonly identifier: string;
    public readonly sourceName: string;

    public constructor(query: string) {
        const URLSourceName = this.parseAsURL(query);
        if (URLSourceName) {
            this.sourceName = URLSourceName;
            this.identifier = query;
        } else {
            const data = this.parseAsFormat(query);
            if (data) {
                this.sourceName = data.sourceName;
                this.identifier = data.identifier;
            }
        }
    }

    private parseAsURL(query: string, expect?: string) {
        if (!query.startsWith("https://")) return;
        const url = new URL(query);

        let sourceName: string;
        for (const check of QueryReference.URLQueryHandlers.values()) {
            sourceName = check(url);

            if (sourceName) {
                if (expect && sourceName !== expect) continue;
                break;
            }
        }

        return sourceName;
    }

    private parseAsFormat(query: string) {
        const [sourceName, ...searchArguments] = query.split(":");
        const search = searchArguments.join(":");

        const expectedAsURL = this.parseAsURL(search, sourceName);
        if (expectedAsURL) {
            if (sourceName === expectedAsURL) return { sourceName, identifier: search };
            return;
        }

        return { sourceName, identifier: search };
    }
}

export = QueryReference