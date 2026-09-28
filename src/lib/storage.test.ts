import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readMigrated } from './storage'

function fakeStorage() {
  const data = new Map<string, string>()
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  }
}

describe('readMigrated', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', fakeStorage())
  })

  it('traz o valor salvo com o nome antigo e apaga a chave velha', () => {
    localStorage.setItem('velho', '[1]')
    expect(readMigrated('novo', 'velho')).toBe('[1]')
    expect(localStorage.getItem('novo')).toBe('[1]')
    expect(localStorage.getItem('velho')).toBeNull()
  })

  it('prefere a chave nova quando as duas existem', () => {
    localStorage.setItem('novo', '[2]')
    localStorage.setItem('velho', '[1]')
    expect(readMigrated('novo', 'velho')).toBe('[2]')
  })

  it('devolve null quando não há nada salvo', () => {
    expect(readMigrated('novo', 'velho')).toBeNull()
  })
})
