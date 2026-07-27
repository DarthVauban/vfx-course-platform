import {
  Children,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ComponentPropsWithoutRef,
} from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  resolveMarkdownHref,
} from "../../lib/course";
import { useCourseProgress } from "../../state/progress";
import type { CourseDocument } from "../../types/course";
import { MermaidDiagram } from "./MermaidDiagram";

interface MarkdownDocumentProps {
  document: CourseDocument;
  markdown: string;
}

interface CodeElementProps {
  className?: string;
  children?: unknown;
}

function MarkdownPre({
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const child = Children.only(children);
  const codeElement = isValidElement<CodeElementProps>(child) ? child : null;
  const className = codeElement?.props.className ?? "";
  const code = String(codeElement?.props.children ?? "").replace(/\n$/, "");
  const [copied, setCopied] = useState(false);

  if (className.includes("language-mermaid")) {
    return <MermaidDiagram chart={code} />;
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-frame">
      <button
        type="button"
        className="copy-code"
        onClick={copyCode}
        aria-label="Копіювати код"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span>{copied ? "Скопійовано" : "Копіювати"}</span>
      </button>
      <pre {...props}>{child}</pre>
    </div>
  );
}

function createMarkdownLink(document: CourseDocument) {
  return function MarkdownLink({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement>) {
    const resolved = resolveMarkdownHref(document, href);

    if (/^https?:\/\//i.test(resolved)) {
      return (
        <a
          href={resolved}
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
          <ExternalLink
            className="external-link-icon"
            size={13}
            aria-hidden="true"
          />
        </a>
      );
    }

    if (resolved.startsWith("/")) {
      return (
        <Link to={resolved} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a href={resolved} {...props}>
        {children}
      </a>
    );
  };
}

export function MarkdownDocument({
  document,
  markdown,
}: MarkdownDocumentProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const { state, setChecklistItem } = useCourseProgress();
  const checkedItems = state.checklistItems[document.id] ?? [];

  useLayoutEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    const checked = new Set(checkedItems);
    const inputs = Array.from(
      root.querySelectorAll<HTMLInputElement>(
        ".task-list-item input[type='checkbox']",
      ),
    );
    inputs.forEach((input, index) => {
      input.disabled = false;
      input.checked = checked.has(index);
      input.dataset.checklistIndex = String(index);
      input.setAttribute(
        "aria-label",
        `Checklist пункт ${index + 1} у ${document.title}`,
      );
      input
        .closest(".task-list-item")
        ?.classList.toggle("is-checked", input.checked);
    });

    const handleChange = (event: Event) => {
      const input = event.target;
      if (
        !(input instanceof HTMLInputElement) ||
        input.type !== "checkbox" ||
        !input.closest(".task-list-item")
      ) {
        return;
      }

      const itemIndex = Number(input.dataset.checklistIndex);
      if (!Number.isInteger(itemIndex)) return;

      input
        .closest(".task-list-item")
        ?.classList.toggle("is-checked", input.checked);
      setChecklistItem(document.id, itemIndex, input.checked);
    };

    const handleTaskClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("input, a, button, pre, code")) return;

      const taskItem = target.closest(".task-list-item");
      if (!taskItem || !root.contains(taskItem)) return;
      taskItem
        .querySelector<HTMLInputElement>("input[type='checkbox']")
        ?.click();
    };

    root.addEventListener("change", handleChange);
    root.addEventListener("click", handleTaskClick);

    return () => {
      root.removeEventListener("change", handleChange);
      root.removeEventListener("click", handleTaskClick);
    };
  }, [checkedItems, document.id, document.title, markdown, setChecklistItem]);

  const MarkdownLink = createMarkdownLink(document);

  return (
    <div ref={articleRef} className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeHighlight,
        ]}
        components={{
          a: MarkdownLink,
          pre: MarkdownPre,
          code({ className, children, ...props }) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="table-scroll" tabIndex={0}>
                <table {...props}>{children}</table>
              </div>
            );
          },
          input({ checked: _checked, disabled: _disabled, node: _node, ...props }) {
            return <input {...props} />;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
