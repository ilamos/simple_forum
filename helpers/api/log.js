import * as fs from "fs";

const LOG_PATH = "logs/log.txt";

export default function logToFile(message) {
    let timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, `[${timestamp}] ${message}\n`);
}