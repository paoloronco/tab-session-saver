const docs = {
  privacy: { title: "Privacy Policy", file: "legal/privacy-policy.md", path: "/privacy" },
  terms: { title: "Terms of Service", file: "legal/terms-of-service.md", path: "/terms" },
  oauth: { title: "Google OAuth App Disclosure", file: "legal/oauth-app-disclosure.md", path: "/oauth-disclosure" },
  deletion: { title: "Data Deletion Instructions", file: "legal/data-deletion-instructions.md", path: "/data-deletion" }
};

const legalDocument = document.getElementById("legal-document");
const legalButtons = Array.from(document.querySelectorAll("[data-doc]"));
const markdownCache = new Map();

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInline(value) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/(^|[\s>])([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi, '$1<a href="mailto:$2">$2</a>');
  html = html.replace(/(^|[\s>])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
  return html;
}

function isTableStart(lines, index) {
  return lines[index] &&
    lines[index].trim().startsWith("|") &&
    lines[index + 1] &&
    /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1]);
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      i += 1;
      continue;
    }

    if (/^```/.test(trimmed)) {
      i += 1;
      const code = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (isTableStart(lines, i)) {
      const headers = trimmed.split("|").map((cell) => cell.trim()).filter(Boolean);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim().split("|").map((cell) => cell.trim()).filter(Boolean));
        i += 1;
      }
      blocks.push(`<table><thead><tr>${headers.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const parts = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !isTableStart(lines, i)
    ) {
      parts.push(lines[i].trim());
      i += 1;
    }
    blocks.push(`<p>${renderInline(parts.join(" ").replace(/ {2,}/g, " "))}</p>`);
  }

  return blocks.join("\n");
}

function docFromLocation() {
  const path = window.location.pathname.replace(/\/$/, "");
  const hash = window.location.hash.replace("#", "");
  if (path === "/terms" || path === "/terms.html" || hash === "terms") return "terms";
  if (path === "/oauth-disclosure" || path === "/oauth-disclosure.html" || hash === "oauth") return "oauth";
  if (path === "/data-deletion" || path === "/data-deletion.html" || hash === "deletion") return "deletion";
  return "privacy";
}

async function loadDoc(key, updatePath = false) {
  if (!legalDocument) return;
  const doc = docs[key] || docs.privacy;
  legalButtons.forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.doc === key));
  });
  legalDocument.innerHTML = '<p class="loading-state">Loading legal document...</p>';

  try {
    let markdown = markdownCache.get(key);
    if (!markdown) {
      const response = await fetch(doc.file, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Unable to load ${doc.file}`);
      markdown = await response.text();
      markdownCache.set(key, markdown);
    }
    legalDocument.innerHTML = renderMarkdown(markdown);
    if (updatePath && window.location.protocol !== "file:") {
      history.pushState({ doc: key }, doc.title, doc.path);
    }
  } catch (error) {
    legalDocument.innerHTML = `<h1>${doc.title}</h1><p class="error-state">This Markdown document could not be loaded. Open <a href="${doc.file}">${doc.file}</a> directly.</p>`;
  }
}

legalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    loadDoc(button.dataset.doc, true);
    window.setTimeout(() => legalDocument.focus({ preventScroll: true }), 150);
  });
});

window.addEventListener("popstate", () => loadDoc(docFromLocation(), false));
loadDoc(docFromLocation(), false);
