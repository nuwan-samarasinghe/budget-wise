export const COLORS: string[] = [
  '#E89B5C', // Warm, soft orange
  '#B38ACD', // Gentle violet
  '#7D99D1', // Mellow ultramarine blue
  '#76B5D3', // Soft sky blue
  '#E6C75E', // Creamy yellow-gold
  '#C27BA0', // Dusty magenta
];

export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '£0';
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const shuffleArray = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const getTwoRandomItems = <T>(arr: T[]): [T, T] => {
  const firstIndex = Math.floor(Math.random() * arr.length);
  let secondIndex = Math.floor(Math.random() * (arr.length - 1));
  if (secondIndex >= firstIndex) secondIndex += 1;

  return [arr[firstIndex], arr[secondIndex]];
};
