export const HORSE_COLORS = [
  { name: 'charcoal', hex: '#323232' },
  { name: 'midnight', hex: '#1f2430' },
  { name: 'ebony', hex: '#2d2a32' },
  { name: 'slate', hex: '#4a4e69' },
  { name: 'smoke', hex: '#6c757d' },
  { name: 'ash', hex: '#8d99ae' },
  { name: 'silver', hex: '#bfc0c0' },
  { name: 'pearl', hex: '#e5e5e5' },
  { name: 'cream', hex: '#f4ebd0' },
  { name: 'sand', hex: '#d8c3a5' },
  { name: 'golden', hex: '#c99b53' },
  { name: 'amber', hex: '#b56a2d' },
  { name: 'chestnut', hex: '#8c4a2f' },
  { name: 'copper', hex: '#b5653a' },
  { name: 'mahogany', hex: '#5c2e1f' },
  { name: 'bay', hex: '#6e3b24' },
  { name: 'sorrel', hex: '#a0522d' },
  { name: 'roan', hex: '#7b6a58' },
  { name: 'olive', hex: '#6b705c' },
  { name: 'teal', hex: '#3a6f73' }
];

export const HORSE_COLOR_MAP = Object.fromEntries(
  HORSE_COLORS.map((entry) => [entry.name.toLowerCase(), entry.hex])
);
