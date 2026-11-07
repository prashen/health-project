// WHO Child Growth Standards (Girls and Boys median + percentiles)

export interface WHODataPoint {
  ageMonths: number;
  p5: number;
  p50: number; // median
  p95: number;
}

// Girls Length/Height for Age (cm)
export const WHO_GIRLS_HEIGHT: WHODataPoint[] = [
  { ageMonths: 0, p5: 45.4, p50: 49.1, p95: 52.9 },
  { ageMonths: 3, p5: 55.6, p50: 59.8, p95: 64.0 },
  { ageMonths: 6, p5: 61.2, p50: 65.7, p95: 70.3 },
  { ageMonths: 9, p5: 65.3, p50: 70.1, p95: 75.0 },
  { ageMonths: 12, p5: 68.9, p50: 74.0, p95: 79.2 },
  { ageMonths: 18, p5: 74.9, p50: 80.7, p95: 86.5 },
  { ageMonths: 24, p5: 80.0, p50: 86.4, p95: 92.9 },
  { ageMonths: 36, p5: 88.7, p50: 96.1, p95: 103.5 },
  { ageMonths: 48, p5: 96.0, p50: 104.7, p95: 112.8 },
  { ageMonths: 60, p5: 102.7, p50: 112.2, p95: 121.1 },
  { ageMonths: 72, p5: 108.4, p50: 118.0, p95: 127.5 },
  { ageMonths: 84, p5: 114.0, p50: 124.0, p95: 134.0 },
];

// Girls Weight for Age (kg)
export const WHO_GIRLS_WEIGHT: WHODataPoint[] = [
  { ageMonths: 0, p5: 2.4, p50: 3.2, p95: 4.2 },
  { ageMonths: 3, p5: 4.5, p50: 5.8, p95: 7.5 },
  { ageMonths: 6, p5: 5.7, p50: 7.3, p95: 9.3 },
  { ageMonths: 9, p5: 6.5, p50: 8.2, p95: 10.5 },
  { ageMonths: 12, p5: 7.0, p50: 8.9, p95: 11.5 },
  { ageMonths: 18, p5: 8.1, p50: 10.2, p95: 13.0 },
  { ageMonths: 24, p5: 9.0, p50: 11.5, p95: 14.8 },
  { ageMonths: 36, p5: 10.8, p50: 13.9, p95: 18.1 },
  { ageMonths: 48, p5: 12.3, p50: 16.1, p95: 21.5 },
  { ageMonths: 60, p5: 13.7, p50: 18.2, p95: 24.9 },
  { ageMonths: 72, p5: 15.3, p50: 20.5, p95: 28.5 },
  { ageMonths: 84, p5: 17.0, p50: 23.0, p95: 32.5 },
];

// Girls Head Circumference (cm)
export const WHO_GIRLS_HEAD_CIRC: WHODataPoint[] = [
  { ageMonths: 0, p5: 31.7, p50: 33.9, p95: 36.1 },
  { ageMonths: 3, p5: 37.1, p50: 39.5, p95: 41.8 },
  { ageMonths: 6, p5: 39.7, p50: 42.2, p95: 44.6 },
  { ageMonths: 9, p5: 41.2, p50: 43.8, p95: 46.3 },
  { ageMonths: 12, p5: 42.2, p50: 44.9, p95: 47.5 },
  { ageMonths: 18, p5: 43.5, p50: 46.2, p95: 48.9 },
  { ageMonths: 24, p5: 44.4, p50: 47.2, p95: 49.9 },
  { ageMonths: 36, p5: 45.7, p50: 48.6, p95: 51.4 },
  { ageMonths: 48, p5: 46.6, p50: 49.5, p95: 52.4 },
  { ageMonths: 60, p5: 47.3, p50: 50.3, p95: 53.3 },
];

// Boys Length/Height for Age (cm)
export const WHO_BOYS_HEIGHT: WHODataPoint[] = [
  { ageMonths: 0, p5: 46.1, p50: 49.9, p95: 53.7 },
  { ageMonths: 3, p5: 57.3, p50: 61.4, p95: 65.5 },
  { ageMonths: 6, p5: 63.3, p50: 67.6, p95: 71.9 },
  { ageMonths: 9, p5: 67.5, p50: 72.0, p95: 76.5 },
  { ageMonths: 12, p5: 71.0, p50: 75.7, p95: 80.5 },
  { ageMonths: 18, p5: 76.9, p50: 82.3, p95: 87.7 },
  { ageMonths: 24, p5: 81.7, p50: 87.8, p95: 93.9 },
  { ageMonths: 36, p5: 89.9, p50: 97.0, p95: 104.2 },
  { ageMonths: 48, p5: 96.8, p50: 105.3, p95: 113.7 },
  { ageMonths: 60, p5: 103.3, p50: 112.8, p95: 122.0 },
];

export function getGrowthStandards(gender: 'female' | 'male' | 'other', metric: 'height' | 'weight' | 'head') {
  if (metric === 'height') {
    return gender === 'male' ? WHO_BOYS_HEIGHT : WHO_GIRLS_HEIGHT;
  }
  if (metric === 'weight') {
    return WHO_GIRLS_WEIGHT; // very close in early years
  }
  return WHO_GIRLS_HEAD_CIRC;
}
