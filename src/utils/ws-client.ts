/**
 * AWS WEBSOCKET CLIENT
 * 
 * Manages the real-time connection lifecycle with automatic reconnection
 * and polling fallback orchestration.
 */

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "";

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
    if (this.socket || this.isConnecting || !WS_URL) return;
    this.isConnecting = true;

    try {
      const url = `${WS_URL}?userId=${this.userId}`;
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log("[WS] Connected to AWS Neural Stream");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach(cb => cb(data));
        } catch (err) {
          console.error("[WS] Message Parse Error", err);
        }
      };

      this.socket.onclose = () => {
        this.socket = null;
        this.isConnecting = false;
        this.attemptReconnect();
      };

      this.socket.onerror = (err) => {
        console.error("[WS] Connection Error", err);
        this.socket?.close();
      };
    } catch (err) {
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
