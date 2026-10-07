export type IconSize = "large" | "medium" | "small" | "tiny" | number;
export type IconVariant = "outlined" | "contained";

export type NextureIconsProps = {
  variant?: IconVariant;
  className?: string;
  size?: IconSize;
  strokeWidth?: number;
  oneTone?: boolean;
};

export const sizeHelper = (size: NextureIconsProps["size"]) => {
  if (typeof size === "number") {
    return size;
  } else if (size === "large") {
    return 24;
  } else if (size === "small" || size === "tiny") {
    return 16;
  } else {
    return 20;
  }
};

export const strokeSizeHelper = (size: number) => {
  if (size === 32) {
    return 1.15;
  } else if (size >= 20) {
    return 1.5;
  } else if (size < 20) {
    return 1.75;
  }
};
