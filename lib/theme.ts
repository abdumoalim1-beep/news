export type Theme = {
  pageBg: string;
  text: string;
  muted: string;
  cardBg: string;
  cardBorder: string;
  pillBg: string;
  pillBorder: string;
};

export const lightTheme: Theme = {
  pageBg: "#efeeeb",
  text: "#1c1b1a",
  muted: "#86837e",
  cardBg: "#ffffff",
  cardBorder: "#e6e4de",
  pillBg: "#f7f6f3",
  pillBorder: "#e2e0da",
};

export const darkTheme: Theme = {
  pageBg: "#17181a",
  text: "#e9e7e2",
  muted: "#9a978f",
  cardBg: "#1f2022",
  cardBorder: "#2c2d2f",
  pillBg: "#232427",
  pillBorder: "#2c2d2f",
};

export function getTheme(dark: boolean): Theme {
  return dark ? darkTheme : lightTheme;
}
