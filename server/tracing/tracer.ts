import { trace } from "@opentelemetry/api"
import { JaegerExporter } from "@opentelemetry/exporter-jaeger"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http"
import { NodeTracerProvider } from "@opentelemetry/node"
import { Resource } from "@opentelemetry/resources"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"
import { SimpleSpanProcessor } from "@opentelemetry/tracing"

export default (serviceName: string) => {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    })

    registerInstrumentations({
        tracerProvider: provider,
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
        ],
    })

    const exporter = new JaegerExporter()

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
    provider.register()

    return trace.getTracer(serviceName)
}