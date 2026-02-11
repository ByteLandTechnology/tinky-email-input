import { useMemo } from "react";
import { type EmailInputState } from "./use-email-input-state.js";
import { useInput } from "tinky";
import { inverse, dim } from "ansis";

/**
 * Properties for the useEmailInput hook.
 */
export interface UseEmailInputProps {
  /**
   * Whether the input is disabled.
   */
  readonly isDisabled?: boolean;

  /**
   * The state object from useEmailInputState.
   */
  readonly state: EmailInputState;

  /**
   * Placeholder text for when the input is empty.
   */
  readonly placeholder?: string;
}

/**
 * Result of the useEmailInput hook.
 */
export interface UseTextInputResult {
  /**
   * The formatted string value to be rendered.
   */
  readonly inputValue: string;
}

/**
 * The character used to represent the cursor in the input.
 */
const cursor = inverse("\u2588");

/**
 * A hook that handles the rendering logic and keyboard inputs for the email input component.
 *
 * @param props - Configuration properties.
 * @returns An object containing the formatted `inputValue` string.
 */
export const useEmailInput = ({
  isDisabled = false,
  state,
  placeholder = "",
}: UseEmailInputProps): UseTextInputResult => {
  const renderedPlaceholder = useMemo(() => {
    if (isDisabled) {
      return placeholder ? dim(placeholder) : "";
    }

    return placeholder && placeholder.length > 0
      ? inverse(placeholder[0]) + dim(placeholder.slice(1))
      : cursor;
  }, [isDisabled, placeholder]);

  const renderedValue = useMemo(() => {
    if (isDisabled) {
      return state.value;
    }

    let index = 0;
    let result = state.value.length > 0 ? "" : cursor;

    for (const char of state.value) {
      result += index === state.cursorOffset ? inverse(char) : char;

      index++;
    }

    if (state.suggestion) {
      if (state.cursorOffset === state.value.length) {
        result += inverse(state.suggestion[0]) + dim(state.suggestion.slice(1));
      } else {
        result += dim(state.suggestion);
      }

      return result;
    }

    if (state.value.length > 0 && state.cursorOffset === state.value.length) {
      result += cursor;
    }

    return result;
  }, [isDisabled, state.value, state.cursorOffset, state.suggestion]);

  useInput(
    (input, key) => {
      if (
        key.upArrow ||
        key.downArrow ||
        (key.ctrl && input === "c") ||
        key.tab ||
        (key.shift && key.tab)
      ) {
        return;
      }

      if (key.return) {
        state.submit();
        return;
      }

      if (key.leftArrow) {
        state.moveCursorLeft();
      } else if (key.rightArrow) {
        state.moveCursorRight();
      } else if (key.backspace || key.delete) {
        state.delete();
      } else {
        state.insert(input);
      }
    },
    { isActive: !isDisabled },
  );

  return {
    inputValue: state.value.length > 0 ? renderedValue : renderedPlaceholder,
  };
};
