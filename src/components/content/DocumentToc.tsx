import { ListTree } from "lucide-react";
import type { CourseHeading } from "../../types/course";

interface DocumentTocProps {
  headings: CourseHeading[];
}

export function DocumentToc({ headings }: DocumentTocProps) {
  const usable = headings.filter(
    (heading) =>
      !/^(?:1\.\s*)?Назва$/i.test(heading.title) &&
      !/^Урок\s+\d{2}\.\d{2}/i.test(heading.title),
  );
  const minimumLevel = Math.min(...usable.map((heading) => heading.level), 2);
  const visible = usable
    .filter((heading) => heading.level <= minimumLevel + 1)
    .slice(0, 28);

  if (visible.length < 2) return null;

  return (
    <nav className="document-toc" aria-label="Зміст документа">
      <div className="toc-title">
        <ListTree size={16} aria-hidden="true" />
        <span>У цьому матеріалі</span>
      </div>
      <ol>
        {visible.map((heading) => (
          <li
            key={`${heading.slug}-${heading.level}`}
            className={`toc-level-${heading.level}`}
          >
            <a href={`#${heading.slug}`}>{heading.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

