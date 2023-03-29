import React, { useCallback, useMemo } from "react";

import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { Element, Leaf } from "@/components/slate/elements";

type SlatViewProps = {
  content: string;
};

export default function SlateView({ content }: SlatViewProps) {
  const parsedContent = JSON.parse(content);
  const editor = useMemo(() => withReact(createEditor()), []);
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  return (
    <Slate editor={editor} value={parsedContent}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly
      />
    </Slate>
  );
}
