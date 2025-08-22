
# 📚 MiniMarkup Language Documentation (v4)

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Syntax](#basic-syntax)
3. [Text Blocks](#text-blocks)
4. [Text Formatting](#text-formatting)
5. [Lists](#lists)
6. [Images](#images)
7. [Lines](#lines)
8. [Layout](#layout)
9. [Links](#links)
10. [Examples](#examples)
11. [Parsing Notes](#parsing-notes)

---

## Introduction

**MiniMarkup** is a lightweight, human-readable markup language designed to create structured documents with rich formatting, layout control, and media embedding — similar in spirit to Markdown or LaTeX, but custom-tailored.

This document outlines the full syntax, features, and usage conventions of MiniMarkup v4.

---

## Basic Syntax

| Symbol      | Meaning              | Example                  |
| ----------- | -------------------- | ------------------------ |
| `#`         | Header level 1       | `# This is a header`     |
| `##`        | Header level 2       | `## This is a subheader` |
| Plain text  | Body paragraph       | `This is body text.`     |
| Blank lines | Paragraph separators |                          |

---

## Text Blocks

### Header

* Starts with `#` (level 1) or `##` (level 2) followed by space and text.
* Example:

```

# Main Title

## Subtitle

```

### Body Text

* Any line not matching special syntax is treated as paragraph text.
* Example:

```

This is a paragraph in the document.

```

### Centered Block

* Use `@center { ... }` to center any block content (headers, paragraphs, images).
* Supports multi-line content inside `{}`.
* Example:

```

@center {

# Centered Title

Some centered paragraph text.
@image: logo.png width=200px radius=10px
}

```

---

## Text Formatting (Inline)

These apply **within lines or paragraphs**:

| Feature       | Syntax              | Result HTML                  | Notes                    |
| ------------- | ------------------- | ---------------------------- | ------------------------ |
| Bold          | `**bold text**`     | `<strong>bold text</strong>` |                          |
| Italic        | `*italic text*`     | `<em>italic text</em>`       |                          |
| Underline     | `_underlined text_` | `<u>underlined text</u>`     |                          |
| Strikethrough | `~~struck text~~`   | `<del>struck text</del>`     |                          |
| Link          | `[label](URL)`      | `<a href="URL">label</a>`    | URL must be valid format |

**Nesting example:**

```

***Bold and underlined text***

````

→

```html
<strong><u>Bold and underlined text</u></strong>
````

---

## Lists

MiniMarkup supports both **unordered** and **ordered** lists with nested structures.

### Unordered Lists

* Use `-` or `*` at the beginning of a line to create bullet points.
* Nested lists are created by indenting with **2 spaces** per level.

**Example:**

```text
- Item one
- Item two
  - Subitem two.a
  - Subitem two.b
- Item three
```

### Ordered Lists

* Use numbers followed by a dot (`1.`, `2.`, etc.) to create numbered lists.
* Nested lists are supported by indentation.

**Example:**

```text
1. First item
2. Second item
   1. Subitem a
   2. Subitem b
3. Third item
```

### Mixed Lists

You can mix unordered and ordered lists at different nesting levels:

```text
- Fruits
  1. Apple
  2. Banana
- Vegetables
  * Carrot
  * Broccoli
```

### Inline Formatting Inside Lists

All inline formatting (bold, italic, underline, strikethrough, links) works inside list items.

**Example:**

```text
- This is **bold** and *italic* text.
- Visit [OpenAI](https://openai.com)
```

### Nesting with Layouts & Centering

Lists can be placed inside any layout column or centered block:

```text
@layout: single {
@center {
- Centered list item 1
- Centered list item 2
}
}
```

---

## Images

### Syntax:

```
@image: filepath [width=VALUE] [height=VALUE] [radius=VALUE]
```

* `filepath`: path or filename of the image
* `width`: image width (e.g., `300px` or `50%`)
* `height`: image height (optional)
* `radius`: border radius (e.g., `10px`) for rounded corners

### Examples:

```
@image: photo.jpg width=300px
@image: avatar.png width=150px radius=50%
@image: logo.svg width=100px height=50px radius=5px
```

### Output HTML:

```html
<img src="photo.jpg" width="300px" style="border-radius: 0;">
<img src="avatar.png" width="150px" style="border-radius: 50%;">
<img src="logo.svg" width="100px" height="50px" style="border-radius: 5px;">
```

> If `radius` is omitted, defaults to `0` (no rounding).

---

## Lines

### Horizontal Line

* Syntax:

  ```
  --- [width=VALUE] [thickness=VALUE] [color=COLOR]
  ```

* Parameters:

  * `width`: percentage or px (default: `100%`)
  * `thickness`: thickness in px (default: `1px`)
  * `color`: CSS color (default: black)

* Example:

  ```
  --- width=75% thickness=4px color=gray
  ```

* Output HTML:

  ```html
  <hr style="width: 75%; height: 4px; background-color: gray; border: none;">
  ```

---
## Layout

### Single Column Layout

* Syntax:

  ```
  @layout: single [bgcolor=VALUE] {
  ...content...
  }
  ```

* Renders as a container that spans full width.

---

### Dual Column Layout with Custom Widths

* Syntax:

  ```
  @layout: dual COL1_WIDTH COL2_WIDTH [bgcolor1=COLOR1] [bgcolor2=COLOR2] {
  ...content for column 1...

  @column-split

  ...content for column 2...
  }
  ```

* `COL1_WIDTH` and `COL2_WIDTH` accept CSS width values like `50%`, `200px`, etc.

* `bgcolor1` sets the background color of the first (left) column.

* `bgcolor2` sets the background color of the second (right) column.

* Example:

  ```
  @layout: dual 30% 70% bgcolor1=#ffdddd bgcolor2=#ddffdd {
  Content in narrow left column.

  @column-split

  Content in wide right column.
  }
  ```

* Output HTML:

  ```html
  <div style="display:flex; gap: 20px;">
    <div style="width: 30%; background-color: #ffdddd;">Content in narrow left column.</div>
    <div style="width: 70%; background-color: #ddffdd;">Content in wide right column.</div>
  </div>
  ```

---

## Links

* Inline links use Markdown-style syntax:

  ```
  [Label](https://example.com)
  ```

* Example:

  ```
  Visit [Google](https://google.com) for search.
  ```

* Output:

  ```html
  <p>Visit <a href="https://google.com">Google</a> for search.</p>
  ```

---

## Examples

### Complete MiniMarkup Sample Document

```
# My Portfolio

@center {
@image: avatar.jpg width=150px radius=50%
}

Welcome to my portfolio. You can find me on [GitHub](https://github.com).

Here is some **bold text**, some *italic text*, and some _underlined text_.

--- width=60% thickness=5px color=blue

@layout: dual 40% 60% {
## About Me
I am a developer specializing in web and AI.

||| thickness=3px height=150px color=gray

@column-split

## Projects
- Project 1
- Project 2
}

--- thickness=2px color=lightgray

Thank you for visiting!
```

---

## Parsing Notes

* **Block parsing order**: parse layout, centered blocks, images, headers, lines, paragraphs.
* **Inline parsing**: after block parsing, process inline styles — bold, italic, underline, strikethrough, and links.
* **Whitespace**: blank lines separate paragraphs and blocks.
* **Nesting**: `@center` blocks can contain any valid blocks (headers, images, layouts).
* **Parameters** for images and lines are parsed as key-value pairs after the initial keyword.
* **Lists**: consecutive lines starting with `-`, `*`, or numbered lists with `N.` form lists. Nested lists use indentation of 2 spaces per level.

---

## Summary Table

| Feature                | Syntax Example                                    | Description                       |   |                                         |                            |
| ---------------------- | ------------------------------------------------- | --------------------------------- | - | --------------------------------------- | -------------------------- |
| Header                 | `# Header Text`                                   | Header level 1                    |   |                                         |                            |
| Subheader              | `## Subheader`                                    | Header level 2                    |   |                                         |                            |
| Body Text              | `Plain paragraph text.`                           | Normal text paragraph             |   |                                         |                            |
| Centered Block         | `@center { ... }`                                 | Center any content block          |   |                                         |                            |
| Bold                   | `**bold text**`                                   | Bold inline text                  |   |                                         |                            |
| Italic                 | `*italic text*`                                   | Italic inline text                |   |                                         |                            |
| Underline              | `_underlined text_`                               | Underlined inline text            |   |                                         |                            |
| Strikethrough          | `~~struck text~~`                                 | Strikethrough inline text         |   |                                         |                            |
| Link                   | `[Label](https://example.com)`                    | Hyperlink inline text             |   |                                         |                            |
| Lists                  | `- item` / `1. item`                              | Unordered and ordered lists       |   |                                         |                            |
| Image                  | `@image: photo.jpg width=200px radius=10px`       | Image insertion with styling      |   |                                         |                            |
| Horizontal Line        | `--- width=75% thickness=3px color=gray`          | Horizontal separator with styling |   |                                         |                            |
| Vertical Line          | \`                                                |                                   |   | thickness=3px height=120px color=blue\` | Vertical line with styling |
| Layout - Single Column | `@layout: single { ... }`                         | Single column block               |   |                                         |                            |
| Layout - Dual Column   | `@layout: dual 30% 70% { ... @column-split ... }` | Two columns with custom widths    |   |                                         |                            |
