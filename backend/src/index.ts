import { Request, Response } from "express"
import { OAuth2Client } from "google-auth-library"
import express from 'express'
import cors from 'cors'
import router from "./routes"

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/',router)
app.set('views', './views')
app.set('view engine','pug')



app.listen(port, () => console.log(`Example app listening on port ${port}!`))