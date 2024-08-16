import express from 'express'
import cors from 'cors'
import router from "./routes"
import 'dotenv/config'
import {redisClient}  from './lib'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/',router)
app.set('views', './views')
app.set('view engine','pug')



app.listen(port, async() => {
    await redisClient.connect()
    console.log(`Example app listening on port ${port}!`)
});
