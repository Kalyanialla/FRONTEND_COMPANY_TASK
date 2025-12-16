








// import { WS_ENDPOINTS } from '../utils/constants';
import { WS_ENDPOINTS } from "../utils/Constants";

class WebSocketManager {
  constructor() {
    this.ws = null;
    this.roomId = null;
    this.token = null;
    this.eventHandlers = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
    this.shouldReconnect = false;
    this.reconnectTimeout = null;
  }

  isConnectedTo(roomId) {
    return (
      this.ws &&
      this.ws.readyState === WebSocket.OPEN &&
      this.roomId === roomId
    );
  }

  connect(roomId, token) {
    if (!roomId || !token) return;
    if (this.isConnectedTo(roomId)) return;
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) return;

    this.disconnect();

    this.roomId = roomId;
    this.token = token;
    this.shouldReconnect = true;

    const wsUrl = WS_ENDPOINTS.CHAT(roomId, token);
    console.log('Connecting WebSocket →', wsUrl);

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch {
        console.error('Invalid WS message');
      }
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error', err);
    };

    this.ws.onclose = (event) => {
      console.warn('WebSocket closed:', event.code);

      if ([4001, 4003].includes(event.code)) {
        console.error('Auth error — stopping reconnect');
        this.shouldReconnect = false;
        return;
      }

      this.emit('disconnected');

      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        this.reconnectTimeout = setTimeout(() => {
          this.connect(this.roomId, this.token);
        }, this.reconnectDelay);
      }
    };
  }

  handleMessage(data) {
    if (!data?.type) return;

    switch (data.type) {
      case 'message':
        this.emit('message', data.message);
        break;
      case 'typing':
        this.emit('typing', data);
        break;
      case 'user_status':
        this.emit('user_status', data);
        break;
      case 'error':
        console.error('Server error:', data.message);
        break;
    }
  }

  sendMessage(content) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'message', content }));
    }
  }

  sendTyping(isTyping) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'typing', is_typing: isTyping }));
    }
  }

  disconnect() {
    this.shouldReconnect = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.roomId = null;
    this.token = null;
    this.reconnectAttempts = 0;
  }

  on(event, handler) {
    this.eventHandlers[event] ??= [];
    this.eventHandlers[event].push(handler);
  }

  off(event, handler) {
    this.eventHandlers[event] =
      this.eventHandlers[event]?.filter(h => h !== handler) ?? [];
  }

  emit(event, data) {
    this.eventHandlers[event]?.forEach(fn => fn(data));
  }
}

export const websocketManager = new WebSocketManager();
