
export const stdLog = {
    log,
    logError,
    logWarning
}

function log(message, prefix) {
    if (prefix) {
        console.log(`[${prefix}]  ${message}`);
    } else {
        console.log(`[DEBUG]  ${message}`);
    }
}

function logError(message, prefix) {
    if (prefix) {
        console.error(`[${prefix}]  ${message}`);
    } else {
        console.error(`[ERROR]  ${message}`);
    }
}

function logWarning(message, prefix) {
    if (prefix) {
        console.warn(`[${prefix}]  ${message}`);
    } else {
        console.warn(`[WARNING]  ${message}`);
    }
}

