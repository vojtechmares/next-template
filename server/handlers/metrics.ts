import { Request, Response } from "express"
import { collectDefaultMetrics, Registry } from "prom-client"
import httpRequestDurationMilliseconds from "../metrics/httpRequestDurationMilliseconds"

const register = new Registry();

register.setDefaultLabels({app: "crm-frontend"});

collectDefaultMetrics(
    {
        register: register, 
        gcDurationBuckets: [0.1, 0.2, 0.3],
        labels: {
            NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE
        }
    }
);

register.registerMetric(httpRequestDurationMilliseconds);

export function MetricsHandler(req: Request, res: Response): void {
    const end = httpRequestDurationMilliseconds.startTimer()

    res.setHeader('Content-Type', register.contentType);
    res.end(register.metrics())

    end({route: '/metrics', code: res.statusCode, method: req.method})
}
