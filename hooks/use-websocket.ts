"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface UseWebSocketOptions {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  autoConnect?: boolean
}

interface WebSocketState {
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
  reconnectAttempts: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
    autoConnect = false,
  } = options

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>()
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map())

  const isValidUrl = useCallback((urlToCheck?: string): boolean => {
    if (!urlToCheck || urlToCheck.trim() === "") return false
    try {
      const parsedUrl = new URL(urlToCheck)
      return parsedUrl.protocol === "ws:" || parsedUrl.protocol === "wss:"
    } catch {
      return false
    }
  }, [])

  const connect = useCallback(() => {
    if (!isValidUrl(url)) {
      // Debug log removed
      setState((prev) => ({ ...prev, isConnected: false, isConnecting: false, error: null }))
      return
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const ws = new WebSocket(url!)

      ws.onopen = () => {
        // Debug log removed
        setState({ isConnected: true, isConnecting: false, error: null, reconnectAttempts: 0 })

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }))
          }
        }, heartbeatInterval)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const listeners = listenersRef.current.get(data.type)
          if (listeners) {
            listeners.forEach((callback) => callback(data.payload))
          }
        } catch (error) {
          console.error("[v0] Failed to parse WebSocket message:", error)
        }
      }

      ws.onerror = () => {
        setState((prev) => ({
          ...prev,
          error: new Error("WebSocket connection error"),
          isConnecting: false,
        }))
      }

      ws.onclose = () => {
        // Debug log removed
        setState((prev) => ({ ...prev, isConnected: false, isConnecting: false }))

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current)
        }

        if (autoConnect && state.reconnectAttempts < maxReconnectAttempts && isValidUrl(url)) {
          const delay = reconnectInterval * Math.pow(2, state.reconnectAttempts)
          console.log(`[v0] Reconnecting in ${delay}ms...`)

          reconnectTimeoutRef.current = setTimeout(() => {
            setState((prev) => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }))
            connect()
          }, delay)
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error("[v0] Failed to create WebSocket:", error)
      setState((prev) => ({
        ...prev,
        error: error as Error,
        isConnecting: false,
      }))
    }
  }, [
    url,
    reconnectInterval,
    maxReconnectAttempts,
    heartbeatInterval,
    state.reconnectAttempts,
    autoConnect,
    isValidUrl,
  ])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set())
    }
    listenersRef.current.get(event)!.add(callback)

    return () => {
      const listeners = listenersRef.current.get(event)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          listenersRef.current.delete(event)
        }
      }
    }
  }, [])

  const send = useCallback((type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }))
    } else {
      console.warn("[v0] WebSocket not connected, using mock data")
    }
  }, [])

  useEffect(() => {
    if (autoConnect && isValidUrl(url)) {
      connect()
    }
    return () => disconnect()
  }, [autoConnect, url, isValidUrl]) // Removed connect and disconnect from deps to prevent infinite loop

  return {
    ...state,
    connect,
    disconnect,
    subscribe,
    send,
  }
}
