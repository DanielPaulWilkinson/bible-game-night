/** Shared turn screen logic: timer-driven rounds with Correct and Skip, used by Charades, Balderdash and Game Night. */
export type Reveal = { answer: string; ref?: string; text?: string }
export type Turn = { player: number; players: string[]; correct: number; skipped: number; scores: number[]; shared: boolean; mult: number; log: { prompt: string; ok: boolean }[] }
export const newTurns = (players: string[], shared = false, mult = 1): Turn =>
  ({ player: 0, players: shared ? ['Family'] : players, correct: 0, skipped: 0, scores: (shared ? ['Family'] : players).map(() => 0), shared, mult, log: [] })
export function markCorrect(t: Turn, prompt: string): Turn {
  const scores = [...t.scores]; scores[t.player] += t.mult
  return { ...t, correct: t.correct + 1, scores, log: [...t.log, { prompt, ok: true }] }
}
export const markSkip = (t: Turn, prompt: string): Turn => ({ ...t, skipped: t.skipped + 1, log: [...t.log, { prompt, ok: false }] })
export const nextPlayer = (t: Turn): Turn => ({ ...t, player: (t.player + 1) % t.players.length, correct: 0, skipped: 0, log: [] })
export const leaders = (t: Turn) => { const m = Math.max(...t.scores); return t.players.filter((_, i) => t.scores[i] === m) }

/* ---------- Tilt (Heads Up style) ----------
 * The phone is held on the forehead in landscape. We read a single "pitch":
 * positive = screen tipped toward the floor (correct), negative = tipped to the ceiling (skip).
 * A gesture fires once, then must come back to near-upright before it can fire again. */
export const TILT_FIRE = 35, TILT_REARM = 15
export function pitchFrom(beta: number | null, gamma: number | null, angle: number): number {
  const b = beta ?? 0, g = gamma ?? 0
  if (angle === 90) return g < 0 ? -(90 + g) : 90 - g        // landscape, home button right
  if (angle === -90 || angle === 270) return g > 0 ? -(90 - g) : 90 + g
  return 90 - b                                               // portrait held upright: beta ~90
}
export type TiltState = { armed: boolean }
export function tiltStep(s: TiltState, pitch: number): [TiltState, 'correct' | 'skip' | null] {
  if (!s.armed) return [{ armed: Math.abs(pitch) < TILT_REARM }, null]
  if (pitch > TILT_FIRE) return [{ armed: false }, 'correct']
  if (pitch < -TILT_FIRE) return [{ armed: false }, 'skip']
  return [s, null]
}
