import { type TextProps } from "tinky";
import { type ComponentTheme } from "tinky-theme";

/**
 * The default theme for the EmailInput component.
 */
const emailInputTheme = {
  styles: {
    value: (): TextProps => ({}),
  },
} satisfies ComponentTheme<Record<string, never>>;

export default emailInputTheme;
export { emailInputTheme };

/**
 * Type definition for the EmailInput theme.
 */
export type EmailInputTheme = typeof emailInputTheme;
