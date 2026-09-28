import type { DisplayProfile, PaletteId } from './types'

export const PALETTE_LABELS: Record<PaletteId, string> = {
  bw: 'Black / white',
  bwr: 'Black / white / red',
  bwy: 'Black / white / yellow',
  bwry: 'Black / white / red / yellow',
  spectra6: 'Spectra 6 · black / white / red / yellow / blue / green',
}

export const PALETTE_COLORS: Record<PaletteId, string[]> = {
  bw: ['black', 'white'],
  bwr: ['black', 'white', 'red'],
  bwy: ['black', 'white', 'yellow'],
  bwry: ['black', 'white', 'red', 'yellow'],
  spectra6: ['black', 'white', 'red', 'yellow', 'blue', 'green'],
}

const solum = (id: string, name: string, width: number, height: number, monochrome = false): DisplayProfile => ({
  id: `solum-${id}`,
  manufacturer: 'SOLUM',
  name: `Newton Pro ${name}`,
  width,
  height,
  palettes: monochrome ? ['bw'] : ['bw', 'bwry'],
  defaultPalette: monochrome ? 'bw' : 'bwry',
})

export const DISPLAY_PROFILES: DisplayProfile[] = [
  { id: 'seeed-e1001', manufacturer: 'Seeed Studio', name: 'reTerminal E1001 7.5″', width: 800, height: 480, palettes: ['bw'], defaultPalette: 'bw' },
  { id: 'seeed-sticky', manufacturer: 'Seeed Studio', name: 'reTerminal sticky 3.97″', width: 800, height: 480, palettes: ['bw'], defaultPalette: 'bw' },
  { id: 'seeed-xiao-7-5', manufacturer: 'Seeed Studio', name: 'XIAO 7.5″ ePaper kit', width: 800, height: 480, palettes: ['bw'], defaultPalette: 'bw' },
  { id: 'opendisplay-4-26', manufacturer: 'OpenDisplay', name: 'OpenDisplay 4.26″ Mono Kit', width: 800, height: 480, palettes: ['bw'], defaultPalette: 'bw' },
  { id: 'eink-spectra6-7-3', manufacturer: 'E Ink', name: 'Spectra 6 7.3″ · ED2208-GCA', width: 800, height: 480, palettes: ['spectra6'], defaultPalette: 'spectra6' },
  { id: 'eink-spectra6-13-3', manufacturer: 'E Ink', name: 'Spectra 6 13.3″ · ED2208-NCA', width: 1200, height: 1600, palettes: ['spectra6'], defaultPalette: 'spectra6' },
  solum('1-6-v', '1.6″ V', 200, 200),
  solum('1-6-h', '1.6″ H', 200, 200),
  solum('2-2', '2.2″', 296, 160),
  solum('2-2-freezer', '2.2″ Freezer', 296, 160, true),
  solum('2-6', '2.6″', 360, 184),
  solum('2-6-freezer', '2.6″ Freezer', 360, 184, true),
  solum('2-7', '2.7″', 300, 200),
  solum('2-9', '2.9″', 384, 168),
  solum('2-9-freezer', '2.9″ Freezer', 384, 168, true),
  solum('3-45', '3.5″ · 3.45 panel', 480, 224),
  solum('3-52', '3.5″ · 3.52 panel', 384, 180),
  solum('4-2', '4.2″', 400, 300),
  solum('4-3', '4.3″', 522, 152),
  solum('4-5', '4.5″', 480, 176),
  solum('5-8', '5.8″', 792, 272),
  solum('6-1', '6.1″', 648, 480),
  solum('7-5', '7.5″', 800, 480),
  solum('9-7', '9.7″', 672, 960),
  solum('11-6', '11.6″', 640, 960),
  solum('12-2', '12.2″', 768, 960),
  { id: 'custom', manufacturer: 'Custom', name: 'Custom display', width: 800, height: 480, palettes: ['bw', 'bwr', 'bwy', 'bwry', 'spectra6'], defaultPalette: 'bw' },
]

export const profileById = (id: string | null): DisplayProfile => DISPLAY_PROFILES.find(profile => profile.id === id) ?? DISPLAY_PROFILES[0]
