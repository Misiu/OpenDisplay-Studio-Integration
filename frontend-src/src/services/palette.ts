import type { PaletteId } from '../types'

export interface PaletteColor {
  value: string
  label: string
}

const BASIC_COLORS = {
  black: { value: '#000000', label: 'Black' },
  white: { value: '#ffffff', label: 'White' },
  red: { value: '#d22626', label: 'Red' },
  yellow: { value: '#e5b800', label: 'Yellow' },
  blue: { value: '#285995', label: 'Blue' },
  green: { value: '#72a85a', label: 'Green' },
} as const

const grayscale = (levels: number): PaletteColor[] => Array.from({ length: levels }, (_, index) => {
  const channel = Math.round((255 * index) / (levels - 1))
  const value = `#${channel.toString(16).padStart(2, '0').repeat(3)}`
  return { value, label: index === 0 ? 'Black' : index === levels - 1 ? 'White' : `Gray ${index}` }
})

export const PALETTE_COLORS: Record<PaletteId, PaletteColor[]> = {
  bw: [BASIC_COLORS.black, BASIC_COLORS.white],
  gray4: grayscale(4),
  gray16: grayscale(16),
  bwr: [BASIC_COLORS.black, BASIC_COLORS.white, BASIC_COLORS.red],
  bwy: [BASIC_COLORS.black, BASIC_COLORS.white, BASIC_COLORS.yellow],
  bwry: [BASIC_COLORS.black, BASIC_COLORS.white, BASIC_COLORS.red, BASIC_COLORS.yellow],
  spectra6: [
    BASIC_COLORS.black,
    BASIC_COLORS.white,
    BASIC_COLORS.red,
    BASIC_COLORS.yellow,
    BASIC_COLORS.blue,
    BASIC_COLORS.green,
  ],
}

export const paletteColors = (palette: PaletteId): PaletteColor[] => PALETTE_COLORS[palette]

export const resolvePaletteColor = (palette: PaletteId, value: unknown): string => {
  const colors = paletteColors(palette)
  const normalized = String(value ?? '').toLowerCase()
  return colors.find((color) => color.value === normalized)?.value ?? colors[0].value
}
