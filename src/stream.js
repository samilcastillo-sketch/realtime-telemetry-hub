/**
 * Real-time Stream & Subscriber Hub (SSE / Event Stream Architecture)
 */
export class TelemetryHub {
  constructor() {
    this.clients = new Set();
    this.historyBuffer = [];
    this.maxHistory = 60; // Keep last 60 data points in sliding window
  }

  addClient(res) {
    this.clients.add(res);
    res.on('close', () => {
      this.clients.delete(res);
    });
  }

  broadcast(metricData) {
    this.historyBuffer.push(metricData);
    if (this.historyBuffer.length > this.maxHistory) {
      this.historyBuffer.shift();
    }

    const payload = `data: ${JSON.stringify(metricData)}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(payload);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  getHistory() {
    return [...this.historyBuffer];
  }

  getConnectedCount() {
    return this.clients.size;
  }
}
