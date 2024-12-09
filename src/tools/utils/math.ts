export const minMax = ({
  value,
  min,
  max,
}: {
  value: number
  min: number
  max: number
}) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

export const toFixed = (value: number, decimals: number) => {
  return Number(value.toFixed(decimals))
}

export const isEven = (n: number): boolean => {
  return n % 2 == 0
}
