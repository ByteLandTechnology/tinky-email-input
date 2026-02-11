import {
  useReducer,
  useCallback,
  useEffect,
  type Reducer,
  useMemo,
} from "react";

/**
 * The properties required to initialize the email input state.
 */
export interface UseEmailInputStateProps {
  /**
   * The initial value of the email input.
   */
  readonly defaultValue?: string;

  /**
   * A list of domains to use for autocomplete suggestions.
   */
  readonly domains?: string[];

  /**
   * Callback function called when the input value changes.
   */
  readonly onChange?: (value: string) => void;

  /**
   * Callback function called when the input value is submitted.
   */
  readonly onSubmit?: (value: string) => void;
}

/**
 * The state and actions for the email input component.
 */
export interface EmailInputState {
  /**
   * The previous value of the input.
   */
  readonly previousValue: string;

  /**
   * The current value of the input.
   */
  readonly value: string;

  /**
   * The current cursor position.
   */
  readonly cursorOffset: number;

  /**
   * The current autocomplete suggestion, if any.
   */
  readonly suggestion: string | undefined;

  /**
   * Moves the cursor one position to the left.
   */
  readonly moveCursorLeft: () => void;

  /**
   * Moves the cursor one position to the right.
   */
  readonly moveCursorRight: () => void;

  /**
   * Inserts text at the current cursor position.
   */
  readonly insert: (text: string) => void;

  /**
   * Deletes the character before the current cursor position.
   */
  readonly delete: () => void;

  /**
   * Submits the current value.
   */
  readonly submit: () => void;
}

/**
 * Internal state structure for the email input.
 */
interface State {
  /**
   * The value of the input before the most recent change.
   */
  previousValue: string;

  /**
   * The current value of the input.
   */
  value: string;

  /**
   * The current position of the cursor within the value string.
   */
  cursorOffset: number;
}

/**
 * Union type of all possible actions that can be dispatched to the reducer.
 */
type Action =
  | MoveCursorLeftAction
  | MoveCursorRightAction
  | InsertAction
  | DeleteAction;

/**
 * Action to move the cursor one position to the left.
 */
interface MoveCursorLeftAction {
  type: "move-cursor-left";
}

/**
 * Action to move the cursor one position to the right.
 */
interface MoveCursorRightAction {
  type: "move-cursor-right";
}

/**
 * Action to insert text at the current cursor position.
 */
interface InsertAction {
  type: "insert";
  /**
   * The text to insert.
   */
  text: string;
}

/**
 * Action to delete a character at the current cursor position.
 */
interface DeleteAction {
  type: "delete";
}

/**
 * Reducer function to manage state transitions based on dispatched actions.
 *
 * @param state - The current state.
 * @param action - The action to perform.
 * @returns The new state.
 */
const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "move-cursor-left": {
      return {
        ...state,
        cursorOffset: Math.max(0, state.cursorOffset - 1),
      };
    }

    case "move-cursor-right": {
      return {
        ...state,
        cursorOffset: Math.min(state.value.length, state.cursorOffset + 1),
      };
    }

    case "insert": {
      // Prevent inserting multiple '@' symbols
      if (state.value.includes("@") && action.text.includes("@")) {
        return state;
      }

      return {
        ...state,
        previousValue: state.value,
        value:
          state.value.slice(0, state.cursorOffset) +
          action.text +
          state.value.slice(state.cursorOffset),
        cursorOffset: state.cursorOffset + action.text.length,
      };
    }

    case "delete": {
      const newCursorOffset = Math.max(0, state.cursorOffset - 1);

      return {
        ...state,
        previousValue: state.value,
        value:
          state.value.slice(0, newCursorOffset) +
          state.value.slice(newCursorOffset + 1),
        cursorOffset: newCursorOffset,
      };
    }
  }
};

/**
 * Default list of email domains for auto-completion.
 */
const DEFAULT_DOMAINS = [
  "aol.com",
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "live.com",
  "outlook.com",
  "icloud.com",
  "hey.com",
];

/**
 * A hook that manages the state of an email input.
 *
 * @param props - The configuration properties for the email input state.
 * @returns The current state and actions to modify it.
 */
export const useEmailInputState = ({
  defaultValue = "",
  domains = DEFAULT_DOMAINS,
  onChange,
  onSubmit,
}: UseEmailInputStateProps): EmailInputState => {
  const [state, dispatch] = useReducer(reducer, {
    previousValue: defaultValue,
    value: defaultValue,
    cursorOffset: defaultValue.length,
  });

  const suggestion = useMemo(() => {
    if (state.value.length === 0 || !state.value.includes("@")) {
      return;
    }

    const atIndex = state.value.indexOf("@");
    const enteredDomain = state.value.slice(atIndex + 1);

    return domains
      ?.find((domain) => domain.startsWith(enteredDomain))
      ?.replace(enteredDomain, "");
  }, [state.value, domains]);

  const moveCursorLeft = useCallback(() => {
    dispatch({
      type: "move-cursor-left",
    });
  }, []);

  const moveCursorRight = useCallback(() => {
    dispatch({
      type: "move-cursor-right",
    });
  }, []);

  const insert = useCallback((text: string) => {
    dispatch({
      type: "insert",
      text,
    });
  }, []);

  const deleteCharacter = useCallback(() => {
    dispatch({
      type: "delete",
    });
  }, []);

  const submit = useCallback(() => {
    if (suggestion) {
      insert(suggestion);
      onSubmit?.(state.value + suggestion);
      return;
    }

    onSubmit?.(state.value);
  }, [state.value, suggestion, insert, onSubmit]);

  useEffect(() => {
    if (state.previousValue !== state.value) {
      onChange?.(state.value);
    }
  }, [state.previousValue, state.value, onChange]);

  return {
    ...state,
    suggestion,
    moveCursorLeft,
    moveCursorRight,
    insert,
    delete: deleteCharacter,
    submit,
  };
};
