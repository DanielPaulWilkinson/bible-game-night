// Tiny Web Audio sounds. Created on first tap so browsers allow them.
let ctx: AudioContext | undefined
const ac = () => (ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)())
function tone(freq: number, start: number, dur: number, vol = 0.2, type: OscillatorType = 'triangle', slideTo?: number) {
  try {
    const a = ac(), o = a.createOscillator(), g = a.createGain(), t = a.currentTime + start
    o.type = type; o.frequency.setValueAtTime(freq, t); if (slideTo) o.frequency.linearRampToValueAtTime(slideTo, t + dur)
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.05)
  } catch { /* no audio available */ }
}
export const trumpet = () => { tone(233, 0, 0.5, 0.25, 'sawtooth'); tone(349, 0.45, 1.2, 0.25, 'sawtooth') }
export const crash = () => { for (let i = 0; i < 8; i++) tone(90 - i * 6, i * 0.06, 0.4, 0.3, 'square', 40) }
export const step = () => tone(140, 0, 0.12, 0.2, 'square')
export const ding = () => { tone(660, 0, 0.25); tone(880, 0.12, 0.35) }
export const buzz = () => tone(160, 0, 0.25, 0.15, 'square')
export const baa = (vol: number) => { tone(520, 0, 0.6, 0.35 * vol, 'sawtooth', 470); tone(530, 0.05, 0.55, 0.2 * vol, 'triangle', 480) }
export const party = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.4, 0.25))
const TUNE = [392, 440, 494, 523, 494, 440, 392, 330, 349, 392, 440, 392]
/** Loop a cheerful tune until stop() is called. */
export function playTune(): () => void {
  let i = 0, on = true
  const next = () => { if (!on) return; tone(TUNE[i++ % TUNE.length], 0, 0.28, 0.18); setTimeout(next, 300) }
  next(); return () => { on = false }
}
/** Winner fanfare: a short rising arpeggio with a bright top note. */
export const cheer = () => { [392, 523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.3, 0.22)); tone(1047, 0.4, 0.7, 0.2, 'sine') }
/** Gentle finish for worship rounds: two soft notes, no fanfare. */
export const chime = () => { tone(523, 0, 0.9, 0.1, 'sine'); tone(784, 0.35, 1.2, 0.08, 'sine') }
