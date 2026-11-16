# Real-Time Telemetry Hub & Streaming Dashboard

High-throughput, event-driven telemetry ingestion and real-time dashboard engine built with zero external dependencies.

## Key Features

- **Real-Time Event Streaming:** Low-overhead Server-Sent Events (SSE) streaming live metrics to connected browser clients.
- **Sliding Window Buffer:** Keeps an active historical ring-buffer of metric data points without unbounded memory consumption.
- **Sub-Millisecond Dashboard:** Zero-framework, canvas-rendered live historical charts displaying CPU %, Heap usage, and load averages.
- **Zero Third-Party Dependencies:** Runs entirely on native Node.js core modules.

## Getting Started

```bash
# Clone and start server
git clone https://github.com/samilcastillo/realtime-telemetry-hub.git
cd realtime-telemetry-hub
npm start
```

Visit `http://localhost:4000` to open the live dashboard.

## Running Tests

```bash
npm test
```
