import { THEME_COLORS } from "@/config/colors";

export function CSSVariables() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            --css-background: ${THEME_COLORS.CSS.background.light};
            --css-foreground: ${THEME_COLORS.CSS.foreground.light};
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --css-background: ${THEME_COLORS.CSS.background.dark};
              --css-foreground: ${THEME_COLORS.CSS.foreground.dark};
            }
          }
        `,
      }}
    />
  );
}
