import { NextFunction, Request, RequestHandler, Response } from "express";

const checkForUserSession: RequestHandler = (req, res, next) => {
    console.log('checking for user')
    // [ 'test=yhaaa', ' server=ohhhyess' ]
    const cookies = req.headers.cookie?.split(';')
    if (cookies) {
        const access_token = cookies?.find(cookie => cookie.includes("access_token"))
        if (access_token){
            // check if the access token is valid
            console.log('user is logged in')
            return next()
        }
    }
    // render a login page
    console.log('here in login page')
    res.redirect('/signin')
}

export default {
    checkForUserSession
}