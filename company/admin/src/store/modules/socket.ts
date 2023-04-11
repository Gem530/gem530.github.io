import { defineStore } from 'pinia'
import Socket from '@/utils/websocket'

const baseWs = 'wss://api.huobi.pro/ws'
const useWebSocket = defineStore('WebSocket', {
  state: () => {return {
    $ws: <any>null,
    symbol: <any>[]
  }},
  getters: {},
  actions: {
    createWebSocket () {
      return new Promise((resolve, reject) => {
        let ws = new Socket(baseWs)
        this.$ws = ws
        resolve(ws)
      })
    },
    send(params: string, id: string, callback: Function) {
      this.$ws.sendMsg({id, sub: params}, callback)
    },
    unSend(params: string, id: string) {
      this.$ws.unSendMsg({id, unsub: params})
    }
  }
})

export default useWebSocket