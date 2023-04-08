import crypto from 'crypto'; 

const hashPassword = (password) => {
    return crypto.createHash("sha256").update(password).digest("hex")
}

const isValidPassword = (password, hash) => {
    if (hashPassword(password) === hash) {
        return true
    }

    return false
}

const stringUtils = {
    hashPassword,
    isValidPassword,
}

export default stringUtils;