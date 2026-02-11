[**tinky-email-input**](../README.md)

---

[tinky-email-input](../globals.md) / EmailInputState

# Interface: EmailInputState

The state and actions for the email input component.

## Properties

### cursorOffset

> `readonly` **cursorOffset**: `number`

The current cursor position.

---

### delete()

> `readonly` **delete**: () => `void`

Deletes the character before the current cursor position.

#### Returns

`void`

---

### insert()

> `readonly` **insert**: (`text`) => `void`

Inserts text at the current cursor position.

#### Parameters

##### text

`string`

#### Returns

`void`

---

### moveCursorLeft()

> `readonly` **moveCursorLeft**: () => `void`

Moves the cursor one position to the left.

#### Returns

`void`

---

### moveCursorRight()

> `readonly` **moveCursorRight**: () => `void`

Moves the cursor one position to the right.

#### Returns

`void`

---

### previousValue

> `readonly` **previousValue**: `string`

The previous value of the input.

---

### submit()

> `readonly` **submit**: () => `void`

Submits the current value.

#### Returns

`void`

---

### suggestion

> `readonly` **suggestion**: `string` \| `undefined`

The current autocomplete suggestion, if any.

---

### value

> `readonly` **value**: `string`

The current value of the input.
