export const errorFormatter = ({ param, msg }) => {
    return `${param} ${msg}`;
};

export const successResponse = ({message, data}) => {
    const success = true
    return {
        success,
        message,
        data,
    }
}

export const errorResponse = ({message}) => {
    const success = false
    const data = null
    return {
        success,
        message,
        data,
    }
}

var responseUtils = {}

export default responseUtils
