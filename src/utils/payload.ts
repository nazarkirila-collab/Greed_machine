import type { Payload } from '../types/greed'

export function runPayload(payload: Payload): void {
  if (payload.type !== 'javascript') {
    throw new Error(`Невідомий тип пейлоаду: ${payload.type}`)
  }
  new Function(payload.code)()
}
