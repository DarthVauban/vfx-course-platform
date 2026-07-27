import {
  ArrowRight,
  Check,
  Clock3,
  Layers3,
  LockKeyhole,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  courseBlocks,
  getDocumentsForBlock,
  getLessonDocumentsForBlock,
} from "../lib/course";
import { formatHours } from "../lib/format";
import { useCourseProgress } from "../state/progress";

export function CoursePage() {
  const { completedSet, state } = useCourseProgress();

  return (
    <div className="page-stack course-catalog">
      <header className="page-header">
        <span className="eyebrow">Повна програма</span>
        <h1>Від першого матеріалу до portfolio reel</h1>
        <p>
          Рухайся послідовно. Кожен блок завершується контрольною роботою;
          рекомендований поріг переходу — 80%.
        </p>
      </header>

      <div className="course-summary-strip">
        <span><strong>456</strong> годин</span>
        <span><strong>66</strong> уроків</span>
        <span><strong>11</strong> блоків</span>
        <span><strong>80%</strong> mastery gate</span>
      </div>

      <div className="block-card-list">
        {courseBlocks.map((block) => {
          const documents = getDocumentsForBlock(block.id);
          const lessons = getLessonDocumentsForBlock(block.id);
          const assessment = documents.find(
            (document) => document.kind === "assessment",
          );
          const completed = lessons.filter((lesson) =>
            completedSet.has(lesson.id),
          ).length;
          const ratio = lessons.length ? completed / lessons.length : 0;
          const firstIncomplete =
            lessons.find((lesson) => !completedSet.has(lesson.id)) ?? lessons[0];
          const assessmentScore = assessment
            ? state.assessmentResults[assessment.id]?.score
            : undefined;

          return (
            <article
              id={`block-${block.id}`}
              className="block-card"
              key={block.id}
              style={{ "--block-accent": block.accent } as CSSProperties}
            >
              <div className="block-card-heading">
                <span className="large-block-index">{block.id}</span>
                <div>
                  <span className="eyebrow">{block.title}</span>
                  <h2>{block.titleUk}</h2>
                  <p>{block.description}</p>
                </div>
                <div className="block-hours">
                  <Clock3 size={17} />
                  <strong>{formatHours(block.totalHours)}</strong>
                  <span>
                    {formatHours(block.theoryHours)} теорії ·{" "}
                    {formatHours(block.practiceHours)} практики
                  </span>
                  {block.materialHours > 0 && (
                    <small>{formatHours(block.materialHours)} з матеріалами</small>
                  )}
                </div>
              </div>

              <div className="block-card-progress">
                <span>
                  <i style={{ width: `${ratio * 100}%` }} />
                </span>
                <small>{completed} із {lessons.length} уроків</small>
              </div>

              <div className="lesson-grid">
                {lessons.map((lesson) => {
                  const complete = completedSet.has(lesson.id);
                  return (
                    <Link
                      to={lesson.route}
                      className={`lesson-tile${complete ? " is-complete" : ""}`}
                      key={lesson.id}
                    >
                      <span className="lesson-tile-status">
                        {complete ? <Check size={14} /> : lesson.lessonNumber}
                      </span>
                      <span>
                        <strong>{lesson.title}</strong>
                        <small>
                          {lesson.totalHours
                            ? formatHours(lesson.totalHours)
                            : `${lesson.readMinutes} хв`}
                        </small>
                      </span>
                      <ArrowRight size={15} />
                    </Link>
                  );
                })}
              </div>

              <footer className="block-card-footer">
                {assessment ? (
                  <Link className="assessment-link" to={assessment.route}>
                    <LockKeyhole size={18} />
                    <span>
                      <strong>Контрольна робота блоку</strong>
                      <small>
                        {assessmentScore === undefined
                          ? "Результат ще не внесено"
                          : assessmentScore >= 80
                            ? `Складено: ${assessmentScore}%`
                            : `Потрібне повторення: ${assessmentScore}%`}
                      </small>
                    </span>
                  </Link>
                ) : <span />}
                <Link className="button button-secondary" to={firstIncomplete.route}>
                  {completed ? "Продовжити блок" : "Почати блок"}
                  <ArrowRight size={16} />
                </Link>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
