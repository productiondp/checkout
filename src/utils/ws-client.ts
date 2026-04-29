/**
 * AWS WEBSOCKET CLIENT
 * 
 * Manages the real-time connection lifecycle with automatic reconnection
 * and polling fallback orchestration.
 */

const WS_URL = process.env.NEXT_PUBLIC_AWS_WS_URL || "";

type WSCallback = (data: any) => void;

export class AwsWebSocketClient {
  private socket: WebSocket | null = null;
  private userId: string;
  private listeners: Set<WSCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * 🔌 Establish Connection
   */
  connect() {
    if (typeof WebSocket === 'undefined' || this.socket || this.isConnecting || !WS_URL) return;
    
    this.isConnecting = true;

    try {
      const url = `${WS_URL}?userId=${this.userId}`;
      const ws = new WebSocket(url);
      this.socket = ws;

      // 🛡️ CONNECTION TIMEOUT GUARD
      const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn("[WS] Connection timeout. Falling back to polling.");
          ws.close();
        }
      }, 3000);

      ws.onopen = () => {
        clearTimeout(timeout);
        console.log("[WS] Connected to AWS Neural Stream");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach(cb => cb(data));
        } catch (err) {
          // Log but do not crash
          console.warn("[WS] Message Parse Warning:", err);
        }
      };

      ws.onclose = () => {
        clearTimeout(timeout);
        this.socket = null;
        this.isConnecting = false;
        this.attemptReconnect();
      };

      ws.onerror = (err) => {
        // Silent failure: log but do not throw
        console.warn("[WS] Connection Warning (Handled):", err);
        ws.close();
      };
    } catch (err) {
      console.warn("[WS] Initialization Failed (Safe Mode):", err);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  /**
   * 🔄 Reconnection Logic
   */
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`[WS] Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.warn("[WS] Max reconnection attempts reached. Falling back to polling.");
    }
  }

  /**
   * 👂 Subscribe to Messages
   */
  subscribe(callback: WSCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * ❌ Disconnect
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }

  get isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}
