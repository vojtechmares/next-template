import express from "express"
import next from "next"
import { LivezHandler } from "./handlers/livez"
import { MetricsHandler } from "./handlers/metrics"
import { ReadyzHandler } from "./handlers/readyz"

const app = next({ dev: process.env.NODE_ENV !== "production" })
const handle = app.getRequestHandler()
const server = express()

const rawPort = process.env.PORT

let port = 3000

if (typeof(rawPort) !== "undefined") {
    port = parseInt(rawPort)
}

app
    .prepare()
    .then(() => {
        // Middleware
        server.use(express.json())

        // Routes
        // Metrics
        server.get('/metrics', MetricsHandler)

        // Kubernetes Liveness and Readiness probe endpoints
        server.get('/livez', LivezHandler)
        server.get('/readyz', ReadyzHandler)

        // Next.js
        server.all('*', (req: express.Request, res: express.Response) => {
            return handle(req, res)
        })

        // Start HTTP server
        server.listen(port, '0.0.0.0', () => {
            console.log(`Server is listening on http://0.0.0.0:${port}`)
        })
    })
    .catch((exception) => {
        console.error(exception.stack)
        process.exit(1)
    })
