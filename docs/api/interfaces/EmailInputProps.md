[**tinky-email-input**](../README.md)

---

[tinky-email-input](../globals.md) / EmailInputProps

# Interface: EmailInputProps

Properties for the EmailInput component.

## Properties

### children?

> `readonly` `optional` **children**: `ReactNode`

Optional children to modify the specific email input.

---

### defaultValue?

> `readonly` `optional` **defaultValue**: `string`

The default value of the email input.

---

### domains?

> `readonly` `optional` **domains**: `string`[]

An array of email domains to use for auto-completion.

---

### isDisabled?

> `readonly` `optional` **isDisabled**: `boolean`

Whether the input is disabled.

#### Default Value

```ts
false;
```

---

### onChange()?

> `readonly` `optional` **onChange**: (`value`) => `void`

A function that is called when the value changes.

#### Parameters

##### value

`string`

#### Returns

`void`

---

### onSubmit()?

> `readonly` `optional` **onSubmit**: (`value`) => `void`

A function that is called when the user submits the value (e.g. by pressing Enter).

#### Parameters

##### value

`string`

#### Returns

`void`

---

### placeholder?

> `readonly` `optional` **placeholder**: `string`

The placeholder text to display when the input is empty.
