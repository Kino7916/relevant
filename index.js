const lib = require("./lib/index");
const Youtube = lib.Sources.Youtube.YoutubeSearchManager;
const source = new Youtube();
const QueryReference = lib.QueryReference;
const query = new QueryReference("https://www.youtube.com/watch?v=vkoRNPNM1Wc");
const fs = require("fs");

async function load() {
    console.log("Searching for query")
    const result = await source.search(query);
    const track = result.tracks[0];

    console.log("Starting to download")
    const stream = await track.downloadPCMAudio();
    let b = 0;
    stream.on("data", /* @param {Buffer} c */(c) => {
        /** @type {Buffer} */
        const chunk = c;
        b += chunk.length;

        console.log(`[${new Date().toISOString()}] Downloaded ${b}`)
    });
    const file = fs.createWriteStream(`./${track.title}.mp3`);
    stream.pipe(file);
}

load();