import { test, expect } from "vitest";
import { render } from "tinky-test";
import { inverse, dim } from "ansis";
import delay from "delay";
import { EmailInput } from "../src/components/EmailInput.js";

const cursor = (character = "\u2588") => inverse(character);
const enter = "\r";
const arrowLeft = "\u001B[D";
const arrowRight = "\u001B[C";
const arrowUp = "\u001B[A";
const arrowDown = "\u001B[B";
const tab = "\t";
const del = "\u007F";

const cursorAt = (input: string, at: number): string => {
  return [...input]
    .map((character, index) => {
      return index === at ? cursor(character) : character;
    })
    .join("");
};

test("placeholder", () => {
  const { lastFrame } = render(<EmailInput placeholder="Start typing..." />);

  expect(lastFrame()).toBe(cursor("S") + dim("tart typing..."));
});

test("cursor can't be moved in placeholder", async () => {
  const { lastFrame, stdin } = render(
    <EmailInput placeholder="Start typing..." />,
  );

  await delay(50);
  stdin.write(arrowLeft);
  await delay(50);

  expect(lastFrame()).toBe(cursor("S") + dim("tart typing..."));

  await delay(50);
  stdin.write(arrowRight);
  await delay(50);

  expect(lastFrame()).toBe(cursor("S") + dim("tart typing..."));
});

test("hide cursor in placeholder when disabled", () => {
  const { lastFrame } = render(
    <EmailInput isDisabled placeholder="Start typing..." />,
  );

  expect(lastFrame()).toBe(dim("Start typing..."));
});

test("default value", () => {
  const { lastFrame } = render(
    <EmailInput defaultValue="test" placeholder="Start typing..." />,
  );

  expect(lastFrame()).toBe(`test${cursor()}`);
});

test("hide cursor in value when disabled", () => {
  const { lastFrame } = render(
    <EmailInput isDisabled defaultValue="test" placeholder="Start typing..." />,
  );

  expect(lastFrame()).toBe("test");
});

test("insert character", async () => {
  let value: string | undefined;

  const { lastFrame, stdin } = render(
    <EmailInput
      placeholder="Start typing..."
      onChange={(newValue) => {
        value = newValue;
      }}
    />,
  );

  await delay(50);
  stdin.write("t");
  await delay(50);

  expect(lastFrame()).toBe(`t${cursor()}`);
  expect(value).toBe("t");
});

test("insert text", async () => {
  let value: string | undefined;

  const { lastFrame, stdin } = render(
    <EmailInput
      placeholder="Start typing..."
      onChange={(newValue) => {
        value = newValue;
      }}
    />,
  );

  await delay(50);
  stdin.write("test");
  await delay(50);

  expect(lastFrame()).toBe(`test${cursor()}`);
  expect(value).toBe("test");
});

test('prevent two "@" characters', async () => {
  let value: string | undefined;

  const { lastFrame, stdin } = render(
    <EmailInput
      placeholder="Start typing..."
      onChange={(newValue) => {
        value = newValue;
      }}
    />,
  );

  await delay(50);
  stdin.write("test@");
  await delay(50);

  expect(lastFrame()).toBe(`test@${cursor("a")}${dim("ol.com")}`);
  expect(value).toBe("test@");

  await delay(50);
  stdin.write("@");
  await delay(50);

  expect(lastFrame()).toBe(`test@${cursor("a")}${dim("ol.com")}`);
  expect(value).toBe("test@");
});

test("ignore input when disabled", async () => {
  let value: string | undefined;

  const { lastFrame, stdin } = render(
    <EmailInput
      isDisabled
      placeholder="Start typing..."
      onChange={(newValue) => {
        value = newValue;
      }}
    />,
  );

  await delay(50);
  stdin.write("t");
  await delay(50);

  expect(lastFrame()).toBe(dim("Start typing..."));
  expect(value).toBe(undefined);
});

test("delete character", async () => {
  let value = "test";

  const { lastFrame, stdin } = render(
    <EmailInput
      defaultValue={value}
      onChange={(newValue) => {
        value = newValue;
      }}
    />,
  );

  await delay(50);
  stdin.write(del);
  await delay(50);

  expect(lastFrame()).toBe(`tes${cursor()}`);
  expect(value).toBe("tes");
});

test("delete all text", async () => {
  let value = "test";

  const { lastFrame, stdin } = render(
    <EmailInput
      defaultValue={value}
      placeholder="Start typing..."
      onChange={(newValue) => {
        value = newValue;
      }}
    />,
  );

  for (let press = 0; press < 4; press++) {
    await delay(50);
    stdin.write(del);
    await delay(50);
  }

  expect(lastFrame()).toBe(cursor("S") + dim("tart typing..."));
  expect(value).toBe("");
});

test("move cursor to the left", async () => {
  const { lastFrame, stdin } = render(<EmailInput defaultValue="test" />);

  for (let at = 3; at >= 0; at--) {
    await delay(50);
    stdin.write(arrowLeft);
    await delay(50);

    expect(lastFrame()).toBe(cursorAt("test", at));
  }
});

test("cursor can't be moved left when at the beginning of the input", async () => {
  const { lastFrame, stdin } = render(<EmailInput defaultValue="test" />);

  for (let press = 0; press < 5; press++) {
    await delay(50);
    stdin.write(arrowLeft);
    await delay(50);
  }

  expect(lastFrame()).toBe(cursorAt("test", 0));
});

test("move cursor to the right", async () => {
  const { lastFrame, stdin } = render(<EmailInput defaultValue="test" />);

  for (let press = 0; press < 4; press++) {
    await delay(50);
    stdin.write(arrowLeft);
    await delay(50);
  }

  expect(lastFrame()).toBe(cursorAt("test", 0));

  for (let at = 1; at < 4; at++) {
    await delay(50);
    stdin.write(arrowRight);
    await delay(50);

    expect(lastFrame()).toBe(cursorAt("test", at));
  }

  await delay(50);
  stdin.write(arrowRight);
  await delay(50);

  expect(lastFrame()).toBe(`test${cursor()}`);
});

test("cursor can't be moved right when at the end of the input", async () => {
  const { lastFrame, stdin } = render(<EmailInput defaultValue="test" />);

  expect(lastFrame()).toBe(`test${cursor()}`);

  await delay(50);
  stdin.write(arrowRight);
  await delay(50);

  expect(lastFrame()).toBe(`test${cursor()}`);
});

test("insert character in the middle", async () => {
  let value = "hllo";

  const { lastFrame, stdin } = render(
    <EmailInput
      defaultValue={value}
      onChange={(newValue) => {
        value = newValue;
      }}
    />,
  );

  expect(lastFrame()).toBe(`hllo${cursor()}`);

  for (let press = 0; press < 3; press++) {
    await delay(50);
    stdin.write(arrowLeft);
    await delay(50);
  }

  expect(lastFrame()).toBe(`h${cursor("l")}lo`);

  await delay(50);
  stdin.write("e");
  await delay(50);

  expect(lastFrame()).toBe(`he${cursor("l")}lo`);
  expect(value).toBe("hello");
});

test("insert text in the middle", async () => {
  let value = "hllo";

  const { lastFrame, stdin } = render(
    <EmailInput
      defaultValue={value}
      onChange={(newValue) => {
        value = newValue;
      }}
    />,
  );

  expect(lastFrame()).toBe(`hllo${cursor()}`);

  for (let press = 0; press < 3; press++) {
    await delay(50);
    stdin.write(arrowLeft);
    await delay(50);
  }

  expect(lastFrame()).toBe(`h${cursor("l")}lo`);

  await delay(50);
  stdin.write("eee");
  await delay(50);

  expect(lastFrame()).toBe(`heee${cursor("l")}lo`);
  expect(value).toBe("heeello");
});

test("autocomplete domain", async () => {
  let value: string | undefined;
  let submittedValue: string | undefined;

  const { lastFrame, stdin } = render(
    <EmailInput
      placeholder="Start typing..."
      onChange={(newValue) => {
        value = newValue;
      }}
      onSubmit={(newValue) => {
        submittedValue = newValue;
      }}
    />,
  );

  expect(lastFrame()).toBe(cursor("S") + dim("tart typing..."));

  await delay(50);
  stdin.write("test@");
  await delay(50);

  expect(lastFrame()).toBe(`test@${cursor("a")}${dim("ol.com")}`);
  expect(value).toBe("test@");

  await delay(50);
  stdin.write("a");
  await delay(50);

  expect(lastFrame()).toBe(`test@a${cursor("o")}${dim("l.com")}`);
  expect(value).toBe("test@a");

  await delay(50);
  stdin.write("o");
  await delay(50);

  expect(lastFrame()).toBe(`test@ao${cursor("l")}${dim(".com")}`);
  expect(value).toBe("test@ao");

  await delay(50);
  stdin.write(enter);
  await delay(50);

  expect(lastFrame()).toBe(`test@aol.com${cursor()}`);
  expect(value).toBe("test@aol.com");
  expect(submittedValue).toBe("test@aol.com");
});

test("suggestion logic when moving cursor", async () => {
  const { lastFrame, stdin } = render(
    <EmailInput placeholder="Start typing..." />,
  );

  await delay(50);
  stdin.write("test@");
  await delay(50);

  // Suggestion: aol.com (from test@)
  // Cursor at "a" (which is index 5. Value is "test@" length 5. Wait.
  // If value is "test@", cursor is at 5. Suggestion is "aol.com".
  // Code:
  // if (state.cursorOffset === state.value.length) { -> 5 === 5. True.
  // Result += inverse(suggestion[0]) + dim(suggestion.slice(1))

  // expected: test@ + inverse(a) + dim(ol.com)
  expect(lastFrame()).toBe(`test@${cursor("a")}${dim("ol.com")}`);

  await delay(50);
  stdin.write(arrowLeft);
  await delay(50);

  // Now cursor should be at 4. Value "test@". Suggestion "aol.com".
  // state.cursorOffset (4) !== state.value.length (5).
  // Code should go to else block: result += dim(state.suggestion)
  // result construction loop:
  // ranges: 0..4.
  // index 0: 't'
  // ...
  // index 4: cursor('@') because index === cursorOffset.
  // Loop ends.
  // suggestion block:
  // result += dim("aol.com")

  // Expected: test + cursor(@) + dim(aol.com)
  expect(lastFrame()).toBe(`test${cursor("@")}${dim("aol.com")}`);
});

test("submit on enter", async () => {
  let submittedValue: string | undefined;

  const { stdin } = render(
    <EmailInput
      defaultValue="test"
      onSubmit={(value) => {
        submittedValue = value;
      }}
    />,
  );

  await delay(50);
  stdin.write(enter);
  await delay(50);

  expect(submittedValue).toBe("test");
});

test("ignore functional keys", async () => {
  const { lastFrame, stdin } = render(<EmailInput defaultValue="test" />);

  await delay(50);
  stdin.write(arrowUp);
  await delay(50);
  expect(lastFrame()).toBe(`test${cursor()}`); // No change

  stdin.write(arrowDown);
  await delay(50);
  expect(lastFrame()).toBe(`test${cursor()}`); // No change

  stdin.write(tab);
  await delay(50);
  expect(lastFrame()).toBe(`test${cursor()}`); // No change

  // Ctrl+C
  stdin.write("\x03");
  await delay(50);
  expect(lastFrame()).toBe(`test${cursor()}`);

  // Shift+Tab
  stdin.write("\u001B[Z");
  await delay(50);
  expect(lastFrame()).toBe(`test${cursor()}`);

  // Ctrl+B (should NOT be ignored, thus inserted)
  // \x02 is Ctrl+B. It's a non-printable char so it might render invisibly or as symbol.
  // We just want to ensure it didn't return early.
  stdin.write("\x02");
  await delay(50);
  // It effectively inserts \x02.
  // Frame should change. default "test" + cursor -> "test" + \x02 + cursor
  expect(lastFrame()).not.toBe(`test${cursor()}`);

  // Shift+T (should NOT be ignored)
  // "T" is just "T" with shift modifier implicitly handled by terminal producing uppercase
  // But tinky might set key.shift=true.
  // We want to ensure (key.shift && key.tab) is false.
  stdin.write("T");
  await delay(50);
  // "test" + \x02 + "T" + cursor
  // We just check it changed or contains T
  expect(lastFrame()).toContain("T");
});

test("disabled without placeholder", () => {
  const { lastFrame } = render(<EmailInput isDisabled />);
  expect(lastFrame()).toBe("");
});
