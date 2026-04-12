export function freqLabel(hz: number): string {
  return hz >= 1000 ? `${hz / 1000}kHz` : `${hz}Hz`
}
