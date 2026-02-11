[**tinky-email-input**](../README.md)

---

[tinky-email-input](../globals.md) / UseEmailInputStateProps

# Interface: UseEmailInputStateProps

The properties required to initialize the email input state.

## Properties

### defaultValue?

> `readonly` `optional` **defaultValue**: `string`

The initial value of the email input.

---

### domains?

> `readonly` `optional` **domains**: `string`[]

A list of domains to use for autocomplete suggestions.

---

### onChange()?

> `readonly` `optional` **onChange**: (`value`) => `void`

Callback function called when the input value changes.

#### Parameters

##### value

`string`

#### Returns

`void`

---

### onSubmit()?

> `readonly` `optional` **onSubmit**: (`value`) => `void`

Callback function called when the input value is submitted.

#### Parameters

##### value

`string`

#### Returns

`void`
