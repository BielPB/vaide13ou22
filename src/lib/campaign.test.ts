import { beforeEach, describe, expect, it, vi } from 'vitest'
import { appendUtms, campaignUtms, readUtms, rememberCampaign } from './campaign'

function fakeStorage() {
  const data = new Map<string, string>()
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  }
}

describe('UTMs da campanha', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', fakeStorage())
  })

  it('lê só as 5 UTMs padrão, sem valores vazios', () => {
    expect(readUtms('?utm_source=facebook&utm_campaign=camuflado%2022&utm_medium=&fbclid=abc&x=1')).toEqual({
      utm_source: 'facebook',
      utm_campaign: 'camuflado 22',
    })
  })

  it('acrescenta as UTMs ao link da Yampi (inclusive com vários itens) sem trocar as que já existem', () => {
    expect(appendUtms('https://seguro.asadeltastore.com/r/KXCGAPO8S5:1,KTS6AXK3UX:2', { utm_source: 'fb', utm_campaign: 'c 1' })).toBe(
      'https://seguro.asadeltastore.com/r/KXCGAPO8S5:1,KTS6AXK3UX:2?utm_source=fb&utm_campaign=c+1',
    )
    expect(appendUtms('https://seguro.asadeltastore.com/r/AAA:1?utm_source=x', { utm_source: 'fb' })).toBe('https://seguro.asadeltastore.com/r/AAA:1?utm_source=x')
    expect(appendUtms('https://seguro.asadeltastore.com/r/AAA:1', {})).toBe('https://seguro.asadeltastore.com/r/AAA:1')
  })

  it('guarda as UTMs por 7 dias; a campanha mais recente substitui a anterior', () => {
    const now = Date.now()
    rememberCampaign('?utm_source=facebook&utm_campaign=a')
    expect(campaignUtms(now)).toEqual({ utm_source: 'facebook', utm_campaign: 'a' })
    rememberCampaign('') // página aberta sem UTMs não apaga a campanha
    rememberCampaign('?utm_source=instagram')
    expect(campaignUtms(now)).toEqual({ utm_source: 'instagram' })
    expect(campaignUtms(now + 8 * 24 * 60 * 60 * 1000)).toEqual({})
  })
})
