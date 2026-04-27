const TELEMETRY_ENABLED = false;

class SuggestionTelemetry {
  private queue: any[] = [];

  track(event: any) {
    if (!TELEMETRY_ENABLED) return;

    try {
      this.queue.push(event);
      if (this.queue.length >= 5) this.flush();
    } catch (e) {
      console.warn("Telemetry track error:", e);
    }
  }

  async flush() {
    if (!TELEMETRY_ENABLED) return;

    try {
      this.queue = [];
    } catch (e) {
      console.warn("Telemetry flush error:", e);
    }
  }

  getMetrics() {
    return {};
  }
}

export const suggestionTelemetry = new SuggestionTelemetry();
