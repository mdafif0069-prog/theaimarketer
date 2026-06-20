export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

// Build a soft two-stop gradient style from a base tint.
export function tintGradient(hex, angle = 145) {
  return { backgroundImage: `linear-gradient(${angle}deg, ${hex}, ${hex}22)` };
}

export function hexAlpha(hex, alpha) {
  return `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
}
