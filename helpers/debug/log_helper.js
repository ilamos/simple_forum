

export const stdLog = {
    log,
    logError,
    logWarning
}

const ENABLE_LOGGING = true;

function log(message, prefix) {
    if (!ENABLE_LOGGING) { return; }
    if (prefix) {
        console.log(`[${prefix}]  ${message}`);
    } else {
        console.log(`[DEBUG]  ${message}`);
    }
}

function logError(message, prefix) {
    if (!ENABLE_LOGGING) { return; }
    if (prefix) {
        console.error(`[${prefix}]  ${message}`);
    } else {
        console.error(`[ERROR]  ${message}`);
    }
}

function logWarning(message, prefix) {
    if (!ENABLE_LOGGING) { return; }
    if (prefix) {
        console.warn(`[${prefix}]  ${message}`);
    } else {
        console.warn(`[WARNING]  ${message}`);
    }
}




