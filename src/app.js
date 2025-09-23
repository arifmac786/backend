import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// for connecting frontend and backend
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

// for excepting json data from frontend
app.use(express.json({
  limit: "16kb"
}))

// for excepting data from url
app.use(express.urlencoded({          // extended --> object inside object
  extended:true,
  limit:"16kb"})) 

//for storing file like pdf images and so on (public assets)
app.use(express.static("public"))  

// for accessing user browser cookie and work on that.(from server only server can read and delete)
app.use(cookieParser())



export { app }