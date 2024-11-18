import { EditorView, minimalSetup } from "codemirror";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { useState, useRef, useEffect } from "react";

const completions = [
  { label: "artist:", type: "field" },
  { label: "title:", type: "field" },
  { label: "album:", type: "field" },
  { label: "genre:", type: "field" },
  { label: "AND", type: "operator" },
  { label: "OR", type: "operator" },
  { label: ">", type: "operator" },
  { label: "<", type: "operator" },
  { label: "=", type: "operator" },
];

function myCompletions(context: CompletionContext) {
  let word = context.matchBefore(/\w*/);
  if (!word) return null;
  return {
    from: word.from,
    options: completions,
  };
}

const Search = () => {
  const editor = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<EditorView>();

  useEffect(() => {
    if (!editor.current) return;

    const view = new EditorView({
      doc: "",
      extensions: [
        minimalSetup,
        autocompletion({
          override: [myCompletions],
        }),
        EditorView.theme({
          "&": { height: "40px" },
          ".cm-scroller": { overflow: "hidden" },
          ".cm-content": { padding: "8px" },
        }),
      ],
      parent: editor.current,
    });

    setView(view);

    return () => view.destroy();
  }, []);

  return <div ref={editor} className="search-editor" />;
};

export default Search;
