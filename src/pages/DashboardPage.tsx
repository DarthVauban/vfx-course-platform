import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  CalendarClock,
  CheckCircle2,
  FlaskConical,
  Gauge,
  Layers3,
  Play,
  Sparkles,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  courseBlocks,
  courseManifest,
  documentsById,
  getLessonDocumentsForBlock,
  lessonDocuments,
} from "../lib/course";
import { formatDate, formatHours } from "../lib/format";
import { useCourseProgress } from "../state/progress";

export function DashboardPage() {
  const {
    state,
    completedSet,
    completedLessonCount,
    lessonProgress,
    setWeeklyHours,
  } = useCourseProgress();

  const firstIncomplete =
    lessonDocuments.find((lesson) => !completedSet.has(lesson.id)) ??
    lessonDocuments[0];
  const continueDocument =
    (state.lastVisitedId && documentsById.get(state.lastVisitedId)) ||
    firstIncomplete;
  const remainingHours = lessonDocuments
    .filter((lesson) => !completedSet.has(lesson.id))
    .reduce((total, lesson) => total + (lesson.totalHours ?? 0), 0);
  const weeksRemaining = Math.max(
    1,
    Math.ceil(remainingHours / state.weeklyHours),
  );
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + weeksRemaining * 7);

  return (
    <div className="dashboard page-stack">
      <section className="hero-panel">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            Self-study path · PC / Console
          </span>
          <h1>
            Створи портфоліо
            <span>stylized anime VFX</span>
          </h1>
          <p>
            Практична траєкторія від основ Unreal Engine до production-ready
            Niagara-ефектів. Матеріали, шейдерне мислення та самоперевірка —
            у центрі програми.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to={continueDocument.route}>
              <Play size={17} fill="currentColor" aria-hidden="true" />
              {completedLessonCount ? "Продовжити навчання" : "Почати курс"}
            </Link>
            <Link className="button button-secondary" to="/course">
              Переглянути програму
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hero-progress-card">
          <div
            className="progress-orbit"
            style={{ "--progress": `${lessonProgress * 360}deg` } as CSSProperties}
            aria-label={`Завершено ${Math.round(lessonProgress * 100)} відсотків`}
          >
            <div>
              <strong>{Math.round(lessonProgress * 100)}%</strong>
              <span>курсу</span>
            </div>
          </div>
          <div className="hero-progress-copy">
            <strong>Твій маршрут</strong>
            <span>
              {completedLessonCount} із {lessonDocuments.length} уроків
            </span>
            <small>{formatHours(remainingHours)} практики й теорії попереду</small>
          </div>
        </div>
      </section>

      <section className="metric-grid" aria-label="Показники курсу">
        <article className="metric-card">
          <span className="metric-icon is-violet">
            <CalendarClock size={20} aria-hidden="true" />
          </span>
          <div>
            <strong>{courseManifest.stats.hours}</strong>
            <span>годин повної програми</span>
          </div>
        </article>
        <article className="metric-card">
          <span className="metric-icon is-cyan">
            <BookOpenCheck size={20} aria-hidden="true" />
          </span>
          <div>
            <strong>{courseManifest.stats.lessons}</strong>
            <span>послідовних уроків</span>
          </div>
        </article>
        <article className="metric-card">
          <span className="metric-icon is-amber">
            <Layers3 size={20} aria-hidden="true" />
          </span>
          <div>
            <strong>{courseManifest.stats.materialPracticeHours}</strong>
            <span>годин material practice</span>
          </div>
        </article>
        <article className="metric-card">
          <span className="metric-icon is-green">
            <CheckCircle2 size={20} aria-hidden="true" />
          </span>
          <div>
            <strong>{courseManifest.stats.assessments}</strong>
            <span>контрольних воріт</span>
          </div>
        </article>
      </section>

      <div className="dashboard-columns">
        <section className="panel roadmap-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Навчальна траєкторія</span>
              <h2>11 блоків до portfolio-ready рівня</h2>
            </div>
            <Link className="text-link" to="/course">
              Уся програма <ArrowRight size={15} />
            </Link>
          </div>

          <div className="roadmap-list">
            {courseBlocks.map((block) => {
              const lessons = getLessonDocumentsForBlock(block.id);
              const complete = lessons.filter((lesson) =>
                completedSet.has(lesson.id),
              ).length;
              const ratio = lessons.length ? complete / lessons.length : 0;

              return (
                <Link
                  to={`/course#block-${block.id}`}
                  className="roadmap-row"
                  key={block.id}
                  style={{ "--block-accent": block.accent } as CSSProperties}
                >
                  <span className="roadmap-index">{block.id}</span>
                  <span className="roadmap-copy">
                    <strong>{block.titleUk}</strong>
                    <small>
                      {block.totalHours} год · {lessons.length} уроків
                    </small>
                  </span>
                  <span className="roadmap-progress">
                    <span>
                      <i style={{ width: `${ratio * 100}%` }} />
                    </span>
                    <small>{complete}/{lessons.length}</small>
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        <div className="dashboard-side">
          <section className="panel continue-panel">
            <span className="eyebrow">Наступний крок</span>
            <div className="continue-visual" aria-hidden="true">
              <span />
              <span />
              <span />
              <Sparkles size={31} />
            </div>
            <span className="document-id">{continueDocument.id}</span>
            <h2>{continueDocument.title}</h2>
            <p>{continueDocument.excerpt}</p>
            <Link className="button button-primary button-wide" to={continueDocument.route}>
              Відкрити матеріал <ArrowRight size={17} />
            </Link>
          </section>

          <section className="panel pace-panel">
            <div className="section-heading compact">
              <div>
                <span className="eyebrow">Твій темп</span>
                <h2>{state.weeklyHours} год / тиждень</h2>
              </div>
              <Gauge size={25} aria-hidden="true" />
            </div>
            <input
              type="range"
              min="7"
              max="12"
              step="1"
              value={state.weeklyHours}
              onChange={(event) => setWeeklyHours(Number(event.target.value))}
              aria-label="Годин навчання на тиждень"
            />
            <div className="pace-scale" aria-hidden="true">
              <span>7</span><span>12</span>
            </div>
            <p>
              Орієнтовно <strong>{weeksRemaining} тиж.</strong> до завершення
              поточного обсягу — близько {formatDate(finishDate)}.
            </p>
          </section>

          <section className="panel quick-tools">
            <span className="eyebrow">Практичні інструменти</span>
            <Link to="/labs/material-math">
              <FlaskConical size={20} aria-hidden="true" />
              <span>
                <strong>Material Math Lab</strong>
                <small>Remap, Power та Smoothstep наживо</small>
              </span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/resources/glossary">
              <Boxes size={20} aria-hidden="true" />
              <span>
                <strong>VFX-глосарій</strong>
                <small>Швидка довідка з термінів</small>
              </span>
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
