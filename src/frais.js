export function calculerFrais(prix) {
  if (prix < 5000) return 300
  if (prix < 20000) return 700
  if (prix < 50000) return 1500
  return 2500
}