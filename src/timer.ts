import { ref, onUnmounted } from 'vue'
import { startTimer, tick, type Timer } from './games2'
export function useTimer(secs: number) {
  const t = ref<Timer>({ left: secs, running: false }); let id: ReturnType<typeof setInterval> | undefined
  const stop = () => { clearInterval(id); t.value = { ...t.value, running: false } }
  const start = (s = secs) => { clearInterval(id); t.value = startTimer(s); id = setInterval(() => { t.value = tick(t.value); if (!t.value.running) clearInterval(id) }, 1000) }
  onUnmounted(() => clearInterval(id))
  return { t, start, stop }
}
