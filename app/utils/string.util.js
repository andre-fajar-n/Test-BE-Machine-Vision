import crypto from 'crypto'; 

export const hashPassword = (password) => {
    return crypto.createHash("sha256").update(password).digest("hex")
}

export const isValidPassword = (password, hash) => {
    if (hashPassword(password) === hash) {
        return true
    }

    return false
}

const stringUtils = {}

export default stringUtils;