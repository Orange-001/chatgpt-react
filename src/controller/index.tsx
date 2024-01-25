// To store message streaming controller
export const ChatControllerPool = {
  controllers: {} as Record<string, AbortController>,

  addController(sessionId: string, controller: AbortController) {
    this.controllers[sessionId] = controller
  },

  stop(sessionId: string) {
    const controller = this.controllers[sessionId]
    controller?.abort()
  },

  stopAll() {
    Object.values(this.controllers).forEach(v => v.abort())
  },

  remove(sessionId: string) {
    delete this.controllers[sessionId]
  }
}
