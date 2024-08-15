import { Request, Response } from "express"
import services from "../services"
import { OAuth2Client } from "google-auth-library";

const signUp = async(req:Request, res: Response) => {
    const oAuth2Client = new OAuth2Client(
        "",
        "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",
        "http://localhost:5173"
      );
    const { code } = req.body
    // get user profile data and refresh token 
    const { tokens } = await oAuth2Client.getToken(code)
    const userProfile = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: ""
    })
    console.log(tokens, userProfile);
    // {
    //     access_token: 'ya29.a0AcM612y5Uy40uPIfyecDxTLDDQxIXx-a8dUz6ZbfefM547PUnPsk3tRe9yiIYjBmbBDEcpQ_nnghapN3D3ft7AftevfLkgr6c0eiQAnK8CygO_gWLmwUPTUrYmSfjVaCFKuFLTbMHV2D6x0nZ1n3bYnxXAC24ieg-93OaCgYKAZgSARMSFQHGX2MiwWttg7uRdQSq3_-vL7Xgvw0171',
    //     refresh_token: '1//0g6l8Sp-5Z4SuCgYIARAAGBASNwF-L9IrtQU-tsQaWQ-7f6lXnxLXJeqYmHlNzJv9Zpm1ftfzXqUZ-3ncpE1jPi83atxRk1j0pKs',
    //     scope: 'https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
    //     token_type: 'Bearer',
    //     id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjljNDA5Zjc3YTEwNmZiNjdlZTFhODVkMTY4ZmQyY2ZiN2MwYjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5MDI4MjcwODA1LTQ1YmVrOWV1Y2I1ZWkyNnE3cG5wMjgzcnVvZWZmZmRjLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTAyODI3MDgwNS00NWJlazlldWNiNWVpMjZxN3BucDI4M3J1b2VmZmZkYy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwODEzMDE3Mjc0MjI1OTUxNjEzNyIsImVtYWlsIjoiYWthZGF6ZWQwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiRkpXSllNeUZHVUhaQVhQMURKWEtiZyIsIm5hbWUiOiJha2FkYXplZCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLV3JEZWpTUnhXdFFQMHYzUmlQY2RSWkdfOVctVmZrdExsaC01Ym56dDI4X3o0bUE9czk2LWMiLCJnaXZlbl9uYW1lIjoiYWthZGF6ZWQiLCJpYXQiOjE3MjMzODQ5NzAsImV4cCI6MTcyMzM4ODU3MH0.IoJNbbejNlu1W0UfV4OW3TtMmAJWlP-SpANwtCw1i6qwRwBA7rb8bgfRSkcS-OmirdtcVrjQzqPAWCbMCFrAismh1knkdqho565JOhZkOYsS4sGiiKfAU-aOHGdFKLxUb0zHdzyabaSUtbe0QUaCifeBUFQFkZ83QCEhZFFRlWb51m58ZvnTvJ-KODb4X6C7BOFQuHMAqYofNhUGGlzr27kaldzjyZwycKEZJRsWm1a-Gu8d1NEqx60a7z6TtKKN6cS2_zyL_YxF4qoviD40yXj3YljMob-26XGJG3SLsXWgPwrqQq6-cHOM7leSfC2QRvXCdM1OC4QejZF0CkOucQ',
    //     expiry_date: 1723388569832
    //   }
    // check for cookies authentication
    // save the access token in cookies with exp date and check in fe when access token has expired logout.
    // but in be refresh that token
    const response = services.userService.signup()
    res.status(200).send(userProfile)
}

export default {
    signUp
}