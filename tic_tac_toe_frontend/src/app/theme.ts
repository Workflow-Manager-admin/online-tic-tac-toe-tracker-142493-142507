//
// THEME CONFIGURATION FOR DARK MODE + COLORS
//
export const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffc107",
  success: "#00b894",
  danger: "#d32f2f",
  background: "#181818",      // Override default
  surface: "#232323",         // Cards, containers
  border: "#333335"
};

export const SQUARE_SIZE = 72;
export const BOARD_SIZE = SQUARE_SIZE * 3;

export function getButtonColor(type = "primary", variant = "fill") {
  if (type === "primary") {
    if (variant === "fill") return COLORS.primary;
    if (variant === "outline") return "transparent";
  }
  if (type === "accent") {
    if (variant === "fill") return COLORS.accent;
    if (variant === "outline") return "transparent";
  }
  // fallback
  return COLORS.primary;
}
