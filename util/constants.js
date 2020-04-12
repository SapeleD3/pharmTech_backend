const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('http-status-codes')

const message = {
    success: 'success',
    error: 'error',
    swr: 'something went wrong',
    mustBeValidEmail: 'Must be a valid email address',
    mustNotBeEmpty: 'Must not be Empty',
    passwordMustMatch: 'Passwords must Match',
}

const errorMessage = {
    INTERNAL_SERVER_ERROR: (res) => {
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: message.error,
            message: message.swr
        })
    },
    BAD_REQUEST: (res, conflictMessage) => {
        return res.status(BAD_REQUEST).json({
            status: message.error,
            message: conflictMessage
        })
    }
}

const successMessage = {
    OK: (res, data) => {
        return res.status(OK).json({
            data,
            message: message.success
        })
    }
}

module.exports = {
    message,
    errorMessage,
    successMessage
}