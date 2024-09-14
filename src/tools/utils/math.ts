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
