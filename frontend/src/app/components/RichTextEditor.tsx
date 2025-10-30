'use client';

import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';

let quillInstance: any = null; // Prevent duplicate Quill instances

export const RichTextEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEditor = async () => {
      // Avoid reinitialization if already created
      if (quillInstance || !editorRef.current) return;

      const hljs = (await import('highlight.js')).default;
      (window as any).hljs = hljs;

      await new Promise((resolve) => setTimeout(resolve, 50));

      const Quill = (await import('quill')).default;

      if (!isMounted) return;

      quillInstance = new Quill(editorRef.current!, {
        modules: {
          syntax: true,
          toolbar: [
            [{ font: [] }, { size: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }, { align: [] }],
            ['link', 'image', 'video', 'formula'],
            ['clean'],
          ],
        },
        placeholder: 'Compose an epic...',
        theme: 'snow',
      });
    };

    loadEditor();

    // 🧹 Cleanup: destroy instance when navigating away
    return () => {
      isMounted = false;
      if (quillInstance) {
        const toolbar = editorRef.current?.parentElement?.querySelector('.ql-toolbar');
        toolbar?.remove(); // remove toolbar manually
        quillInstance = null; // reset global instance
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div ref={editorRef} className="min-h-[400px]" />
    </div>
  );
};
