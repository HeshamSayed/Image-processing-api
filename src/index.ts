import express, { Application, Request, Response } from 'express'
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv'
import routes from './routes/index';
import rateLimit from 'express-rate-limit'

 dotenv.config()
const PORT = process.env.PORT || 3000
// create an instance server
const app: Application = express()


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)


app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World 🌍'
  })
})

// starting express server
app.listen(PORT, () => {
  
  if (!fs.existsSync(path.resolve(__dirname, '../images/thumbnails'))) {
    fs.mkdirSync(path.resolve(__dirname, '../images/thumbnails'));
}
  console.log(`Server started on Port:${PORT}`)
})
export default app