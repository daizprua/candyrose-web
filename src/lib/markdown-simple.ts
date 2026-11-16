// Markdown mínimo y seguro para textos legales: ## y ### títulos, párrafos,
// listas con "- ", **negrita** y [texto](https://…). Todo se escapa antes.
// La misma función vive en la web pública (candyrose-web/src/lib/markdown-simple.ts).

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function enLinea(s: string): string {
  let t = esc(s);
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:|\/)[^\s)]+)\)/g, (_m, txt, url) => `<a href="${url}">${txt}</a>`);
  return t;
}

/** id para anclas (#cancelacion) a partir de "{#id}" al final del título. */
function titulo(nivel: 2 | 3, linea: string): string {
  const m = /\s*\{#([a-z0-9-]+)\}\s*$/.exec(linea);
  const texto = m ? linea.slice(0, m.index) : linea;
  return `<h${nivel}${m ? ` id="${m[1]}"` : ""}>${enLinea(texto.trim())}</h${nivel}>`;
}

export function markdownAHtml(md: string): string {
  const out: string[] = [];
  let parrafo: string[] = [];
  let lista: string[] = [];
  const cerrarParrafo = () => { if (parrafo.length) { out.push(`<p>${enLinea(parrafo.join(" "))}</p>`); parrafo = []; } };
  const cerrarLista = () => { if (lista.length) { out.push(`<ul>${lista.map((l) => `<li>${enLinea(l)}</li>`).join("")}</ul>`); lista = []; } };
  for (const bruta of md.replace(/\r\n/g, "\n").split("\n")) {
    const l = bruta.trim();
    if (!l) { cerrarParrafo(); cerrarLista(); continue; }
    if (l.startsWith("### ")) { cerrarParrafo(); cerrarLista(); out.push(titulo(3, l.slice(4))); continue; }
    if (l.startsWith("## ")) { cerrarParrafo(); cerrarLista(); out.push(titulo(2, l.slice(3))); continue; }
    if (l.startsWith("- ")) { cerrarParrafo(); lista.push(l.slice(2)); continue; }
    cerrarLista();
    parrafo.push(l);
  }
  cerrarParrafo(); cerrarLista();
  return out.join("\n");
}
