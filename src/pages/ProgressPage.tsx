import {
  Bookmark,
  CheckCircle2,
  Download,
  FileCheck2,
  RotateCcw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import {
  assessmentDocuments,
  blocksById,
  courseBlocks,
  documentsById,
  getLessonDocumentsForBlock,
  lessonDocuments,
} from "../lib/course";
import { useCourseProgress } from "../state/progress";

export function ProgressPage() {
  const {
    state,
    completedSet,
    completedLessonCount,
    lessonProgress,
    setAssessmentScore,
    exportProgress,
    importProgress,
    resetProgress,
  } = useCourseProgress();
  const inputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState("");

  const downloadProgress = () => {
    const blob = new Blob([exportProgress()], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `arcana-vfx-progress-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback("Резервну копію завантажено.");
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      importProgress(await file.text());
      setFeedback("Прогрес успішно імпортовано.");
    } catch {
      setFeedback("Цей файл не схожий на резервну копію прогресу.");
    } finally {
      event.target.value = "";
    }
  };

  const reset = () => {
    if (!window.confirm("Скинути весь прогрес, нотатки та результати?")) return;
    resetProgress();
    setFeedback("Локальний прогрес скинуто.");
  };

  const bookmarkDocuments = state.bookmarks
    .map((id) => documentsById.get(id))
    .filter((document) => document !== undefined);
  const notesCount = Object.values(state.notes).filter(
    (note) => note.trim().length > 0,
  ).length;
  const passedAssessments = assessmentDocuments.filter(
    (assessment) =>
      (state.assessmentResults[assessment.id]?.score ?? 0) >= 80,
  ).length;

  return (
    <div className="page-stack progress-page">
      <header className="page-header">
        <span className="eyebrow">Особистий журнал</span>
        <h1>Прогрес, mastery gates та нотатки</h1>
        <p>
          Дані зберігаються локально у браузері. Експортуй резервну копію,
          особливо перед очищенням браузера або переходом на інший комп’ютер.
        </p>
      </header>

      <section className="progress-overview panel">
        <div
          className="progress-orbit progress-orbit-large"
          style={{ "--progress": `${lessonProgress * 360}deg` } as CSSProperties}
        >
          <div>
            <strong>{Math.round(lessonProgress * 100)}%</strong>
            <span>завершено</span>
          </div>
        </div>
        <div className="progress-overview-copy">
          <span className="eyebrow">Загальний результат</span>
          <h2>{completedLessonCount} із {lessonDocuments.length} уроків</h2>
          <div className="progress-track">
            <span style={{ width: `${lessonProgress * 100}%` }} />
          </div>
        </div>
        <div className="mini-stat">
          <ShieldCheck size={21} />
          <strong>{passedAssessments}/11</strong>
          <span>mastery gates</span>
        </div>
        <div className="mini-stat">
          <Bookmark size={21} />
          <strong>{bookmarkDocuments.length}</strong>
          <span>закладок</span>
        </div>
        <div className="mini-stat">
          <FileCheck2 size={21} />
          <strong>{notesCount}</strong>
          <span>нотаток</span>
        </div>
      </section>

      <div className="progress-columns">
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Блоки</span>
              <h2>Навчальний прогрес</h2>
            </div>
          </div>
          <div className="block-progress-list">
            {courseBlocks.map((block) => {
              const lessons = getLessonDocumentsForBlock(block.id);
              const complete = lessons.filter((lesson) =>
                completedSet.has(lesson.id),
              ).length;
              const ratio = lessons.length ? complete / lessons.length : 0;
              return (
                <Link
                  to={`/course#block-${block.id}`}
                  className="block-progress-row"
                  key={block.id}
                  style={{ "--block-accent": block.accent } as CSSProperties}
                >
                  <span className="block-index">{block.id}</span>
                  <span className="block-progress-copy">
                    <strong>{block.shortTitle}</strong>
                    <span>
                      <i style={{ width: `${ratio * 100}%` }} />
                    </span>
                  </span>
                  <small>{complete}/{lessons.length}</small>
                  {complete === lessons.length && (
                    <CheckCircle2 size={17} className="success-icon" />
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="panel assessment-journal">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Самоперевірка</span>
              <h2>Mastery gates</h2>
            </div>
            <span className="threshold-badge">поріг 80%</span>
          </div>
          <div className="assessment-score-list">
            {assessmentDocuments.map((assessment) => {
              const block = blocksById.get(assessment.blockId ?? "");
              const score = state.assessmentResults[assessment.id]?.score;
              const passed = score !== undefined && score >= 80;
              return (
                <div className="assessment-score-row" key={assessment.id}>
                  <Link to={assessment.route}>
                    <small>Блок {assessment.blockId}</small>
                    <strong>{block?.shortTitle ?? assessment.title}</strong>
                  </Link>
                  <label className={passed ? "is-passed" : ""}>
                    <span className="sr-only">
                      Результат контрольної роботи {assessment.id}
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score ?? ""}
                      placeholder="—"
                      onChange={(event) =>
                        setAssessmentScore(
                          assessment.id,
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                        )
                      }
                    />
                    <span>%</span>
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="progress-columns lower">
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Швидкий доступ</span>
              <h2>Закладки</h2>
            </div>
          </div>
          {bookmarkDocuments.length ? (
            <div className="bookmark-list">
              {bookmarkDocuments.map((document) => (
                <Link to={document.route} key={document.id}>
                  <Bookmark size={16} fill="currentColor" />
                  <span>
                    <strong>{document.title}</strong>
                    <small>{document.id}</small>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="compact-empty">
              <Bookmark size={24} />
              <p>Збережені уроки з’являться тут.</p>
            </div>
          )}
        </section>

        <section className="panel data-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Локальні дані</span>
              <h2>Резервна копія</h2>
            </div>
          </div>
          <p>
            Файл містить статус уроків, checklist, оцінки, закладки й особисті
            нотатки. Матеріали курсу до нього не дублюються.
          </p>
          <div className="data-actions">
            <button className="button button-primary" type="button" onClick={downloadProgress}>
              <Download size={17} /> Експортувати
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={17} /> Імпортувати
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              hidden
            />
            <button className="button button-danger" type="button" onClick={reset}>
              <RotateCcw size={17} /> Скинути
            </button>
          </div>
          {feedback && <p className="data-feedback" role="status">{feedback}</p>}
        </section>
      </div>
    </div>
  );
}
