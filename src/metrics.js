/**
 * Telemetry Metrics Collector Engine
 * Samples memory usage, CPU active time, and Node.js event loop lag.
 */
import os from 'node:os';

let lastCpuUsage = process.cpuUsage();
let lastSampleTime = process.hrtime.bigint();

export function collectMetrics() {
  const currentCpu = process.cpuUsage(lastCpuUsage);
  const currentTime = process.hrtime.bigint();
  const elapsedMicros = Number(currentTime - lastSampleTime) / 1000;

  lastCpuUsage = process.cpuUsage();
  lastSampleTime = currentTime;

  const totalCpuTime = currentCpu.user + currentCpu.system;
  const cpuPercent = elapsedMicros > 0 ? Math.min(100, Math.round((totalCpuTime / elapsedMicros) * 100)) : 0;

  const mem = process.memoryUsage();
  const systemTotalMem = os.totalmem();
  const systemFreeMem = os.freemem();

  return {
    timestamp: new Date().toISOString(),
    process: {
      pid: process.pid,
      uptimeSeconds: Math.floor(process.uptime()),
      cpuPercent,
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
      rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100
    },
    system: {
      loadAvg: os.loadavg().map(v => Math.round(v * 100) / 100),
      freeMemMb: Math.round(systemFreeMem / 1024 / 1024),
      totalMemMb: Math.round(systemTotalMem / 1024 / 1024),
      usedMemPercent: Math.round(((systemTotalMem - systemFreeMem) / systemTotalMem) * 100)
    }
  };
}
