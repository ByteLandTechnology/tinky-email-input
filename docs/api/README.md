**tinky-email-input**

---

# Tinky Email Input

A customizable email input component for [Tinky](https://github.com/vadimdemedes/tinky), featuring auto-completion and domain suggestions.

## Features

- **Auto-completion**: Suggests email domains as you type.
- **Custom Domains**: Easily configurable list of domains for auto-completion.
- **Keyboard Navigation**: Use arrow keys to navigate the input and select suggestions.
- **Themable**: Fully customizable appearance using `tinky-theme`.
- **Written in TypeScript**: Includes full type definitions for a great developer experience.

## Installation

```bash
npm install tinky-email-input
```

## Usage

```tsx
import React, { useState } from "react";
import { render, Box, Text } from "tinky";
import { EmailInput } from "tinky-email-input";

const App = () => {
  const [email, setEmail] = useState("");

  return (
    <Box flexDirection="column">
      <Text>Enter your email:</Text>
      <EmailInput
        placeholder="user@example.com"
        onChange={setEmail}
        onSubmit={(value) => {
          console.log("Submitted:", value);
          process.exit(0);
        }}
      />
      <Text color="green">Current Value: {email}</Text>
    </Box>
  );
};

render(<App />);
```

## API

### `<EmailInput />`

The main component for the email input.

| Prop           | Type                      | Default              | Description                                                 |
| -------------- | ------------------------- | -------------------- | ----------------------------------------------------------- |
| `defaultValue` | `string`                  | `undefined`          | The initial value of the input.                             |
| `placeholder`  | `string`                  | `""`                 | The placeholder text to display when empty.                 |
| `isDisabled`   | `boolean`                 | `false`              | Whether the input is disabled.                              |
| `domains`      | `string[]`                | `['gmail.com', ...]` | Custom list of domains for auto-completion.                 |
| `onChange`     | `(value: string) => void` | `undefined`          | Callback fired when the input value changes.                |
| `onSubmit`     | `(value: string) => void` | `undefined`          | Callback fired when the user submits (e.g., presses Enter). |
| `children`     | `ReactNode`               | `undefined`          | Optional children.                                          |

### `useEmailInputState`

A hook to manage the state of the email input if you want to build a custom component.

```tsx
import { useEmailInputState } from "tinky-email-input";

const state = useEmailInputState({
  defaultValue: "hello@",
  domains: ["custom-domain.com"],
});
```

### `useEmailInput`

A hook that handles the rendering logic and keyboard inputs, intended to be used with `useEmailInputState`.

```tsx
import { useEmailInput } from "tinky-email-input";

const { inputValue } = useEmailInput({ state, placeholder: "Enter email..." });
```

## Theme

The component uses `tinky-theme` for styling. You can customize the appearance by providing a theme.

```ts
import { emailInputTheme } from "tinky-email-input";
// ... customize theme
```

## License

MIT
