import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileQuestion,
  LockKeyhole,
  NotebookPen,
  Printer,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { DocumentToc } from "../components/content/DocumentToc";
import { MarkdownDocument } from "../components/content/MarkdownDocument";
import {
  blocksById,
  documentKindLabels,
  documentsById,
  documentsByRoute,
  getDocumentNeighbors,
  loadCourseMarkdown,
  prepareMarkdownForReader,
} from "../lib/course";
import { formatHours } from "../lib/format";
import { useCourseProgress } from "../state/progress";

export function DocumentPage() {
  const location = useLocation();
  const document = documentsByRoute.get(location.pathname);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [answerConfirmed, setAnswerConfirmed] = useState(false);
  const {
    state,
    completedSet,
    bookmarkSet,
    toggleCompleted,
    toggleBookmark,
    setNote,
    setLastVisited,
  } = useCourseProgress();

  useEffect(() => {
    if (!document) return;
    let active = true;
    setMarkdown(null);
    setLoadError(false);
    setAnswerConfirmed(false);

    loadCourseMarkdown(document)
      .then((content) => {
        if (!active) return;
        setMarkdown(prepareMarkdownForReader(content, document));
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    setLastVisited(document.id);
    window.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      active = false;
    };
  }, [document, setLastVisited]);

  useEffect(() => {
    if (!markdown || !location.hash) return;
    const target = window.document.getElementById(
      decodeURIComponent(location.hash.slice(1)),
    );
    target?.scrollIntoView({ block: "start" });
  }, [location.hash, markdown]);

  const taskCount = useMemo(
    () => (markdown?.match(/^- \[[ xX]\]\s+/gm) ?? []).length,
    [markdown],
  );

  if (!document) {
    return (
      <section className="empty-state">
        <FileQuestion size={42} aria-hidden="true" />
        <h1>Матеріал не знайдено</h1>
        <Link className="button" to="/course">
          Повернутися до програми
        </Link>
      </section>
    );
  }

  const block = document.blockId
    ? blocksById.get(document.blockId)
    : undefined;
  const { previous, next } = getDocumentNeighbors(document.id);
  const answerDocument = document.answerId
    ? documentsById.get(document.answerId)
    : undefined;
  const isComplete = completedSet.has(document.id);
  const isBookmarked = bookmarkSet.has(document.id);
  const checkedTasks = state.checklistItems[document.id]?.length ?? 0;
  const note = state.notes[document.id] ?? "";
  const isSolution =
    document.kind === "answer" || document.kind === "assessment-key";

  return (
    <div
      className="document-page"
      style={
        {
          "--document-accent": block?.accent ?? "#8e7dff",
        } as CSSProperties
      }
    >
      <article className="reader-column">
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/">Головна</Link>
          <ChevronRight size={14} aria-hidden="true" />
          {block ? (
            <>
              <Link to={`/course#block-${block.id}`}>{block.shortTitle}</Link>
              <ChevronRight size={14} aria-hidden="true" />
            </>
          ) : null}
          <span>{documentKindLabels[document.kind]}</span>
        </nav>

        {isSolution && (
          <div className="solution-banner">
            <LockKeyhole size={18} aria-hidden="true" />
            <div>
              <strong>Solution material</strong>
              <span>
                Використовуй після власної спроби й за правилами курсу.
              </span>
            </div>
          </div>
        )}

        <header className="document-header">
          <div className="document-kicker">
            <span>{document.id}</span>
            {block && <span>{block.titleUk}</span>}
          </div>
          <h1>{document.title}</h1>
          <p>{document.excerpt}</p>

          <div className="document-meta">
            {document.totalHours ? (
              <span>
                <Clock3 size={16} aria-hidden="true" />
                {formatHours(document.totalHours)}
              </span>
            ) : (
              <span>
                <Clock3 size={16} aria-hidden="true" />
                ≈ {document.readMinutes} хв читання
              </span>
            )}
            {taskCount > 0 && (
              <span>
                <CheckCircle2 size={16} aria-hidden="true" />
                {checkedTasks}/{taskCount} checklist
              </span>
            )}
          </div>

          <div className="document-actions">
            <button
              type="button"
              className={`button${isComplete ? " is-success" : ""}`}
              onClick={() => toggleCompleted(document.id)}
            >
              {isComplete ? <Check size={17} /> : <CheckCircle2 size={17} />}
              {isComplete ? "Завершено" : "Позначити завершеним"}
            </button>
            <button
              type="button"
              className={`button button-secondary${
                isBookmarked ? " is-active" : ""
              }`}
              onClick={() => toggleBookmark(document.id)}
            >
              <Bookmark size={17} fill={isBookmarked ? "currentColor" : "none"} />
              {isBookmarked ? "Збережено" : "Зберегти"}
            </button>
            <button
              type="button"
              className="button button-ghost print-button"
              onClick={() => window.print()}
            >
              <Printer size={17} />
              Друк / PDF
            </button>
          </div>
        </header>

        {loadError && (
          <div className="inline-error">
            Не вдалося завантажити Markdown-файл. Онови сторінку.
          </div>
        )}

        {!markdown && !loadError ? (
          <div className="reader-skeleton" aria-label="Завантаження матеріалу">
            <span />
            <span />
            <span />
            <span />
          </div>
        ) : null}

        {markdown && (
          <MarkdownDocument document={document} markdown={markdown} />
        )}

        {answerDocument && !isSolution && (
          <section className="answer-gate">
            <div className="answer-gate-icon">
              <LockKeyhole size={24} aria-hidden="true" />
            </div>
            <div>
              <span className="eyebrow">Перевірка рішення</span>
              <h2>Спочатку спробуй самостійно</h2>
              <p>
                Рішення корисне для порівняння архітектури, але не замінює
                власну діагностику й три рівні підказок.
              </p>
              {!answerConfirmed ? (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setAnswerConfirmed(true)}
                >
                  Я зробив власну спробу
                </button>
              ) : (
                <Link className="button" to={answerDocument.route}>
                  Відкрити рішення
                  <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </section>
        )}

        <details className="notes-panel">
          <summary>
            <NotebookPen size={18} aria-hidden="true" />
            Мої нотатки до матеріалу
            {note.trim() && <span>збережено локально</span>}
          </summary>
          <div>
            <textarea
              value={note}
              onChange={(event) => setNote(document.id, event.target.value)}
              placeholder="Що було незрозуміло? Який root cause знайшов? Що повторити після перерви?"
              aria-label="Особисті нотатки"
            />
            <small>
              Нотатка зберігається лише в цьому браузері. Її можна експортувати
              на сторінці прогресу.
            </small>
          </div>
        </details>

        {(previous || next) && (
          <nav className="document-neighbors" aria-label="Сусідні уроки">
            {previous ? (
              <Link to={previous.route} className="neighbor-card">
                <ArrowLeft size={19} aria-hidden="true" />
                <span>
                  <small>Попередній</small>
                  <strong>{previous.title}</strong>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={next.route} className="neighbor-card is-next">
                <span>
                  <small>Наступний</small>
                  <strong>{next.title}</strong>
                </span>
                <ArrowRight size={19} aria-hidden="true" />
              </Link>
            ) : null}
          </nav>
        )}
      </article>

      {markdown && (
        <aside className="reader-aside">
          <DocumentToc headings={document.headings} />
        </aside>
      )}
    </div>
  );
}
