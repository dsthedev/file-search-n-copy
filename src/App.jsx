import { useMemo, useState, useRef } from "react";
import Fuse from "fuse.js";
import "./index.css";

export default function App() {
  const [lines, setLines] = useState([]);
  const [query, setQuery] = useState("");
  const [hideBasic, setHideBasic] = useState(false);
  const [hideSpecial, setHideSpecial] = useState(true);
  const [alphabeticalSort, setAlphabeticalSort] = useState(false);
  const copiedRefs = useRef({});

  // ===== Customizable filters =====
  const basicPatterns = ["example", "test", "sample"]; // Lines considered "basic"
  const specialPatterns = [
    /(password|secret|token|key|api)/i,
    /\b[A-Za-z_]+=[^\s]+/, // env-like
    /\/\/.*:.*@/, // URLs with credentials
  ]; // Lines considered "special"

  const isBasic = (line) => {
    // e.g., simple/short/basic lines
    for (const pat of basicPatterns) {
      if (line.startsWith(pat)) return true;
    }
    return line.trim().split(/\s+/).length <= 2;
  };

  const isSpecial = (line) => {
    for (const pat of specialPatterns) {
      if (pat instanceof RegExp && pat.test(line)) return true;
      if (typeof pat === "string" && line.includes(pat)) return true;
    }
    return false;
  };

  // ===== File upload =====
  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const parsed = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      // Deduplicate and precompute basic/special flags
      const uniqueMap = new Map();
      for (let i = parsed.length - 1; i >= 0; i--) {
        const line = parsed[i];
        if (!uniqueMap.has(line)) {
          uniqueMap.set(line, {
            text: line,
            basic: isBasic(line),
            special: isSpecial(line),
          });
        }
      }

      setLines(Array.from(uniqueMap.values()));
    };

    reader.readAsText(file);
  };

  // ===== Fuzzy search =====
  const fuse = useMemo(() => {
    return new Fuse(
      lines.map(({ text }) => ({ text })),
      {
        keys: ["text"],
        threshold: 0.4,
      }
    );
  }, [lines]);

  const searched = query
    ? fuse.search(query).map((r) => r.item)
    : lines.map(({ text }) => ({ text }));

  // ===== Apply filters =====
  let filtered = searched
    .map(({ text }) => lines.find((l) => l.text === text))
    .filter((line) => line !== undefined)
    .filter((line) => {
      if (hideBasic && line.basic) return false;
      if (hideSpecial && line.special) return false;
      return true;
    });

  if (alphabeticalSort) {
    filtered = [...filtered].sort((a, b) => a.text.localeCompare(b.text));
  }

  // ===== Copy =====
  const copy = async (text, spanRef) => {
    try {
      await navigator.clipboard.writeText(text);
      if (spanRef) {
        spanRef.classList.add("show");
        setTimeout(() => spanRef.classList.remove("show"), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // ===== Accepted file formats =====
  const acceptedFormats = [
    ".txt",
    ".csv",
    ".log",
    ".json",
    ".xml",
    ".md",
    ".tsv",
    ".yaml",
    ".yml",
    ".ini",
    ".cfg",
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".less",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".hpp",
    ".rb",
    ".php",
    ".go",
    ".rs",
    ".sh",
    ".bat",
    ".ps1",
    ".pl",
    ".sql",
  ].join(",");

  return (
    <>
      <div style={{ padding: 20, fontFamily: "monospace" }}>
        <h2>File Search & Copy Tool</h2>
        <p>
          * <small>Duplicate lines removed</small>
          <br />* <small>Basic and special filters applied</small>
        </p>

        <div className="search">
          <input
            type="text"
            placeholder={`Search ${filtered.length} lines ...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              height: 36,
              padding: "0 10px",
              fontSize: 14,
              marginBottom: 12,
            }}
          />

          <label className="toggle">
            <input
              type="checkbox"
              checked={alphabeticalSort}
              onChange={(e) => setAlphabeticalSort(e.target.checked)}
            />
            <span className="slider" />
            <span className="label">Sort A-Z</span>
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              checked={hideBasic}
              onChange={(e) => setHideBasic(e.target.checked)}
            />
            <span className="slider" />
            <span className="label">Hide Basic</span>
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              checked={hideSpecial}
              onChange={(e) => setHideSpecial(e.target.checked)}
            />
            <span className="slider" />
            <span className="label">Hide Special</span>
          </label>
        </div>

        <table width="auto" cellPadding="4">
          <tbody>
            {filtered.map(({ text, special }, index) => (
              <tr key={text}>
                <td style={{ position: "relative" }}>
                  <button
                    onClick={() => copy(text, copiedRefs.current[index])}
                    aria-label="Copy line"
                  >
                    ⿻
                  </button>
                  <span
                    ref={(el) => (copiedRefs.current[index] = el)}
                    className="copied"
                  >
                    Copied!
                  </span>
                </td>
                <td>
                  {special ? (
                    <span className="sensitive">
                      <span className="masked">
                        {"\u2022".repeat(text.length)}
                      </span>
                      <span className="real">{text}</span>
                    </span>
                  ) : (
                    <span>{text}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ margin: 20 }}>
        <label
          style={{
            display: "inline-block",
            padding: "6px 12px",
            background: "#4f8cff",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Load Text File
          <input
            type="file"
            accept={acceptedFormats}
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </label>
      </div>
    </>
  );
}
