> [!TIP]
> `BATI` is a global available during the templating phase, which is a `Set` containing all chosen _features_

### Special file names

#### `$.*\.ts`
File names encapsulated between `$` and `.ts`, like `$README.md.ts`, are process through callback, which let one manipulate destination file.
Take a look at [boilerplates/shared/files/$README.md.ts](https://github.com/vikejs/bati/blob/main/boilerplates/shared/files/%24README.md.ts) for example.

#### `!.*`
File names starting with a `!` will take precedence over any other file for the same destination.
The priority order is as follows (from lesser to higher priority):
- non `!` files
- `!` files
- `$` files
- `!$` files

### Syntax

Bati uses specific syntaxes to generate its boilerplates.
The global idea is to have templating as code, making it is easy to write and maintain templates.

<table>
<tr>
<th>Snippet</th>
<th>if condition 1, compiles to</th>
<th>else/if condition 2, compiles to</th>
</tr>
<tr>
<td colspan="3">
<center>
.js,.jsx,.ts,.tsx,.vue script
</center>
</td>
</tr>
<tr>
<td>

```ts
if (BATI.has("feature")) {
  console.log("A");
} else {
  console.log("B");
}

// also works with elseif
```


</td>
<td>

```ts
console.log("A");
```

</td>
<td>

```ts
console.log("B");
```

</td>
</tr>
<tr></tr>
<tr>
<td>

```ts
const myvar = BATI.has("feature") ?
  "A" : "B";
```

</td>
<td>

```ts
const myvar = "a";
```

</td>
<td>

```ts
const myvar = "B";
```

</td>
</tr>
<tr></tr>
<tr>
<td>

```ts
// BATI.has("feature")
import "./mycss";
```

</td>
<td>

```ts
import "./mycss";
```

</td>
<td>

nothing

</td>
</tr>
<tr>
<tr>
<td>

```ts
/*# BATI include-if-imported #*/

const a = 1;
```

</td>
<td>
true if the file is at least imported by any other generated file

```ts
const a = 1;
```

</td>
<td>

nothing

</td>
</tr>
<tr>
<td>

```ts
// Equivalent to `as any` but in Bati's codebase only. It is dropped entirely when compiled.
// Only use this to bypass complex type mixing, but prefer using `BATI.If<...>` instead if possible.
const a = 'react' as BATI.Any;
```

</td>
<td>

```ts
const a = 'react';
```

</td>
<td>

```ts
const a = 'react';
```

</td>
</tr>
<tr>
<td>

```ts
interface Context {
  // First valid match is the one that will be applied
  ui: BATI.If<{
    'BATI.has("react")': "react";
    'BATI.has("vue")': "vue";
    'BATI.has("solid")': "solid";
    // fallback
    _: "other";
  }>;
}
```

</td>
<td>
For instance, if `--react` was given

```ts
interface Context {
  ui: "react";
}
```

</td>
<td>

```ts
interface Context {
  ui: "other";
}
```

</td>
</tr>
<tr>
<td colspan="3">
<center>
.jsx,.tsx
</center>
</td>
</tr>
<tr>
<td>

```tsx
const Component = () => {
  return (
    <div
      // BATI.has("feature")
      class="p-5"
      // !BATI.has("feature")
      style={{
        padding: "20px",
      }}
    >
      {props.children}
    </div>
  );
};
```

</td>
<td>

```tsx
const Component = () => {
  return (
    <div
      class="p-5"
    >
      {props.children}
    </div>
  );
};
```

</td>
<td>

```tsx
const Component = () => {
  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      {props.children}
    </div>
  );
};
```

</td>
</tr>
<tr>
<td colspan="3">
<center>
.jsx,.tsx,.vue template
</center>
</td>
</tr>
<tr>
<td>

```html
<div>
  <!-- BATI.has("feature") -->
  <div>
    <span>my text</span>
  </div>
  <span>my other text</span>
</div>
```

</td>
<td>

```html
<div>
  <div>
    <span>my text</span>
  </div>
  <span>my other text</span>
</div>
```

</td>
<td>

```html
<div>
  <span>my other text</span>
</div>
```

</td>
</tr>
<tr>
<td colspan="3">
<center>
any extension
</center>
</td>
</tr>
<tr>
<td>

```css
/*{ @if (it.BATI.has("feature")) }*/
@import "./feature.css";
/*{ /if }*/
```

We use [SquirellyJS](https://squirrelly.js.org/docs/syntax/overview) with a custom `/*{ ... }*/` tag

</td>
<td>

```css
@import "./feature.css";
```

</td>
<td>

nothing

</td>
</tr>
</table>

> [!NOTE]
> Using this kind of condition in a templates is **not supported!**
> ```jsx
> {BATI.has("feature") && <div>show me</div>}
> ```

#### Details

- `BATI` is a global var available at compile time. It is also defined in typings so that it is considered valid in your IDE
- After compilation, any unused imports are removed
- After compilation, code is formatted with prettier

