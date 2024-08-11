import { Request, Response } from "express"
import { LoginTicket, OAuth2Client } from "google-auth-library"

const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

const oAuth2Client = new OAuth2Client(
    "9028270805-45bek9eucb5ei26q7pnp283ruoefffdc.apps.googleusercontent.com",
    "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",
    "http://localhost:5173"
  );

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => res.send('Hello World!'))

app.post('/api/auth/google', async(req: Request, res: Response) => {
    console.log(req.body)
    const { code } = req.body
    // get user profile data and refresh token 
    const { tokens } = await oAuth2Client.getToken(code); // exchange code for tokens
    console.log(tokens);
    
    
    res.json(tokens);
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))