const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Memory = require("lowdb/adapters/Memory");
const adapterM = new Memory();
const adapterF = new FileSync("./databaseScratch.json");
const db = low(adapterF);
module.exports = db;
