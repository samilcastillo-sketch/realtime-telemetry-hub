/**
 * Automated Tests for Telemetry Hub & Streaming Engine
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { collectMetrics } from '../src/metrics.js';
import { TelemetryHub } from '../src/stream.js';
import { EventEmitter } from 'node:events';

test('Telemetry: Collects consistent system and process metrics', () => {
  const metrics = collectMetrics();
  assert.ok(metrics.timestamp);
  assert.ok(typeof metrics.process.cpuPercent === 'number');
  assert.ok(metrics.process.heapUsedMb > 0);
  assert.ok(metrics.system.totalMemMb > 0);
  assert.ok(Array.isArray(metrics.system.loadAvg));
});

test('Streaming Hub: Manages client connection lifecycle and sliding buffer', () => {
  const hub = new TelemetryHub();
  assert.equal(hub.getConnectedCount(), 0);

  // Mock client response stream
  const mockRes = new EventEmitter();
  mockRes.write = (data) => {
    assert.ok(data.startsWith('data: '));
    return true;
  };

  hub.addClient(mockRes);
  assert.equal(hub.getConnectedCount(), 1);

  // Broadcast data point
  const sample = collectMetrics();
  hub.broadcast(sample);

  assert.equal(hub.getHistory().length, 1);

  // Simulate client disconnect
  mockRes.emit('close');
  assert.equal(hub.getConnectedCount(), 0);
});
