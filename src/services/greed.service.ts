import { baseApi } from '../api/baseApi'
import type {
  BombResponse,
  Character,
  CreateSessionBody,
  DonateResponse,
  GreedState,
  ResetBody,
  SessionValidation
} from '../types/greed'

export const greedService = {
  getCharacters: () => baseApi.get<Character[]>('/api/greed/characters'),

  createSession: (body: CreateSessionBody) => baseApi.post<GreedState>('/api/greed/session/new', body),

  verifySession: (sessionId: string) =>
    baseApi.get<SessionValidation>(`/api/greed/session/${encodeURIComponent(sessionId)}/verify`),

  getState: () => baseApi.get<GreedState>('/api/greed/state'),

  selectCharacter: (characterId: string) =>
    baseApi.post<GreedState>('/api/greed/select-character', null, { params: { character_id: characterId } }),

  donate: () => baseApi.post<DonateResponse>('/api/greed/donate'),

  bomb: () => baseApi.post<BombResponse>('/api/greed/bomb'),

  reset: (body: ResetBody) => baseApi.post<GreedState>('/api/greed/reset', body)
}
