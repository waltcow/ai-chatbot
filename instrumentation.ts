// import { registerOTel } from '@vercel/otel';

export function register() {
  // registerOTel({ serviceName: 'ai-chatbot' });
  // OpenTelemetry integration removed for self-hosted deployment
  console.log('Instrumentation: OpenTelemetry disabled for self-hosted deployment');
}
