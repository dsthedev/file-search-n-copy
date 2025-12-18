# File Search & Copy Tool

A lightweight **Vite + React** developer tool for viewing, searching, and interacting with text and code files.  
Built as an experiment for exploring, filtering, and copying lines from files like `.txt`, `.csv`, `.log`, `.json`, and many more.

---

## Features

- **Upload Text or Code Files**  
  Upload files in common text and developer formats (e.g., `.txt, .csv, .log, .json, .xml, .md, .html, .css, .js, .py, .ts, etc.`).  
  Lines are deduplicated automatically.

- **Fuzzy Search**  
  Real-time fuzzy search across all lines in the loaded file.

- **Hide Basic Lines**  
  Toggle to hide "basic" or common lines.  
  Rules for what counts as basic are configurable in the code (e.g., short lines or lines starting with certain patterns).

- **Hide Special Lines**  
  Toggle to hide "special" or sensitive lines.  
  Special lines are detected via configurable patterns (e.g., passwords, tokens, API keys, environment variables, or URLs containing credentials).  
  Sensitive content is masked by default and can be revealed on hover.

- **Alphabetical Sort**  
  Toggle to sort visible lines A-Z while keeping filters applied.

- **Copy-to-Clipboard**  
  Each line has a copy button for one-click copying. A temporary "Copied!" indicator appears when clicked.

- **Supports Multiple File Types**  
  Upload almost any text-based or developer file to explore its content, including `.txt, .csv, .log, .json, .xml, .md, .html, .css, .js, .ts, .py, .java, .c, .cpp, .rb, .php, .sh, .bat, .sql`, and more.

---

## Prerequisites

```bash
nvm: 0.40.3
node: v24.11.1
npm: 11.6.2
```

---

## Usage

1. Clone or download  
2. `npm install`
3. `npm run dev`
4. `http://localhost:5173/`
5. Upload a file
6. Use the **search bar** to filter lines.  
7. Toggle **Hide Basic**, **Hide Special**, and **Sort A-Z** as needed.  
8. Click the ⿻ button to copy lines to your clipboard.
9. Use **Upload File** to load a different text or code file.  
