import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { startNight, loadNight, saveNight, advance, current, following, stops, inLineup, atBlessing } from '../src/night'
import { stopOf } from '../src/catalog'
beforeEach(() => sessionStorage.clear())
describe('Night lineup flow', () => {
  it('stops end with the Blessing and the lineup survives a reload', () => {
    startNight(['jericho', 'real', 'thanks'])
    const l = loadNight()!; expect(stops(l)).toEqual(['jericho', 'real', 'thanks', 'blessing']); expect(current(l)).toBe('jericho')
    expect(inLineup(l, 'jericho')).toBe(true); expect(inLineup(l, 'real')).toBe(false)
  })
  it('next, skip and the last game hands off to the Blessing', () => {
    let l = startNight(['jericho', 'real', 'thanks'])
    l = advance(l); expect(current(l)).toBe('real'); expect(following(l)).toBe('thanks')
    l = advance(l, 2); expect(current(l)).toBe('blessing'); expect(atBlessing(l)).toBe(true)
    l = advance(l, 5); expect(current(l)).toBe('blessing')
  })
  it('ending clears the night', () => { startNight(['a']); saveNight(null); expect(loadNight()).toBeNull() })
  it('corrupt storage is ignored', () => { sessionStorage.setItem('bgn-lineup', '{bad'); expect(loadNight()).toBeNull() })
  it('Blessing has its own name and glyph', () => {
    expect(stopOf('blessing')).toEqual({ id: 'blessing', title: 'Blessing Round', icon: 'blessing' })
    expect(readFileSync('src/views/GameLogo.vue', 'utf8')).toContain("id === 'blessing'")
  })
  it('in-between screen has the four actions, the pass cue and aria-live', () => {
    const v = readFileSync('src/views/NightNext.vue', 'utf8')
    for (const s of ['Next game: ', 'Play this again', 'Skip to ', 'End game night', 'Hand the phone to the next host', 'aria-live="polite"', 'Go to the Blessing Round']) expect(v).toContain(s)
    expect(readFileSync('src/views/Celebrate.vue', 'utf8')).toContain('Choose another game')
    expect(readFileSync('src/views/Blessing.vue', 'utf8')).toContain('Night complete')
    expect(readFileSync('src/views/GameNight.vue', 'utf8')).toContain('<NightNext')
    expect(readFileSync('src/views/Menu.vue', 'utf8')).toContain('startNight(lineup)')
  })
})
