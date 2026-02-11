import { type ReactNode, type JSX } from "react";
import { Text } from "tinky";
import { useComponentTheme } from "tinky-theme";

/**
 * Properties for the EmailInput component.
 */
export interface EmailInputProps {
  /**
   * Optional children to modify the specific email input.
   */
  readonly children?: ReactNode;

  /**
   * Whether the input is disabled.
   *
   * @defaultValue false
   */
  readonly isDisabled?: boolean;

  /**
   * The placeholder text to display when the input is empty.
   */
  readonly placeholder?: string;

  /**
   * The default value of the email input.
   */
  readonly defaultValue?: string;

  /**
   * An array of email domains to use for auto-completion.
   */
  readonly domains?: string[];

  /**
   * A function that is called when the value changes.
   */
  readonly onChange?: (value: string) => void;

  /**
   * A function that is called when the user submits the value (e.g. by pressing Enter).
   */
  readonly onSubmit?: (value: string) => void;
}
import emailInputTheme from "../themes/email-input-theme.js";
import { useEmailInputState } from "../hooks/use-email-input-state.js";
import { useEmailInput } from "../hooks/use-email-input.js";

/**
 * An email input component that supports auto-completion and custom domains.
 *
 * @param props - The props for the component.
 */
export function EmailInput({
  isDisabled = false,
  defaultValue,
  placeholder = "",
  domains,
  onChange,
  onSubmit,
}: EmailInputProps): JSX.Element {
  const state = useEmailInputState({
    defaultValue,
    domains,
    onChange,
    onSubmit,
  });

  const { inputValue } = useEmailInput({
    isDisabled,
    placeholder,
    state,
  });

  const { styles } = useComponentTheme<Record<string, never>>(
    "EmailInput",
    emailInputTheme,
    {},
  );

  return <Text {...styles.value}>{inputValue}</Text>;
}
