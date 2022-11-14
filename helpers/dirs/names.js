const illegalNames = [
    "admin",
    "administrator",
    "root",
    "moderator",
    "mod",
    "anonymous",
    "anon",
];

const allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function isAllowedChars(string) {
    for (let i = 0; i < string.length; i++) {
        if (!allowedChars.includes(string[i])) {
            return false;
        }
    }
    return true;
}

function isIllegalName(string) {
    return illegalNames.includes(string.toLowerCase());
}

export { illegalNames, allowedChars, isAllowedChars, isIllegalName };