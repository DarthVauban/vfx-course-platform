import {
  BookOpen,
  ChevronDown,
  FlaskConical,
  Gauge,
  GraduationCap,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  courseBlocks,
  getDocumentsForBlock,
  lessonDocuments,
} from "../../lib/course";
import { useCourseProgress } from "../../state/progress";
import { CommandPalette } from "../search/CommandPalette";

interface NavigationLinkProps {
  to: string;
  icon: typeof Gauge;
  label: string;
  onNavigate: () => void;
}

function NavigationLink({
  to,
  icon: Icon,
  label,
  onNavigate,
}: NavigationLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-link${isActive ? " is-active" : ""}`
      }
      onClick={onNavigate}
    >
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const {
    completedLessonCount,
    lessonProgress,
    completedSet,
  } = useCourseProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const activeBlockId = useMemo(() => {
    for (const block of courseBlocks) {
      if (
        getDocumentsForBlock(block.id).some(
          (document) => document.route === location.pathname,
        )
      ) {
        return block.id;
      }
    }
    return null;
  }, [location.pathname]);

  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(
    () => new Set(activeBlockId ? [activeBlockId] : ["01"]),
  );

  useEffect(() => {
    if (!activeBlockId) return;
    setExpandedBlocks((current) => new Set(current).add(activeBlockId));
  }, [activeBlockId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        До основного вмісту
      </a>

      <aside className={`sidebar${mobileOpen ? " is-open" : ""}`}>
        <div className="sidebar-brand">
          <Link to="/" className="brand-mark" onClick={closeMobile}>
            <span className="brand-glyph" aria-hidden="true">
              <Sparkles size={20} />
            </span>
            <span>
              <strong>Arcana VFX</strong>
              <small>UE · Materials · Niagara</small>
            </span>
          </Link>
          <button
            type="button"
            className="icon-button sidebar-close"
            onClick={closeMobile}
            aria-label="Закрити навігацію"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Головна навігація">
          <NavigationLink
            to="/"
            icon={Gauge}
            label="Навчальний центр"
            onNavigate={closeMobile}
          />
          <NavigationLink
            to="/course"
            icon={BookOpen}
            label="Програма курсу"
            onNavigate={closeMobile}
          />
          <NavigationLink
            to="/progress"
            icon={GraduationCap}
            label="Мій прогрес"
            onNavigate={closeMobile}
          />
          <NavigationLink
            to="/labs/material-math"
            icon={FlaskConical}
            label="Material Math Lab"
            onNavigate={closeMobile}
          />
        </nav>

        <div className="sidebar-section-label">
          <span>11 блоків</span>
          <span>{completedLessonCount}/66</span>
        </div>

        <div className="block-navigation">
          {courseBlocks.map((block) => {
            const lessons = getDocumentsForBlock(block.id);
            const completed = lessons.filter((document) =>
              completedSet.has(document.id),
            ).length;
            const expanded = expandedBlocks.has(block.id);

            return (
              <section
                key={block.id}
                className={`sidebar-block${
                  activeBlockId === block.id ? " is-current" : ""
                }`}
                style={{ "--block-accent": block.accent } as CSSProperties}
              >
                <button
                  type="button"
                  className="sidebar-block-trigger"
                  onClick={() =>
                    setExpandedBlocks((current) => {
                      const next = new Set(current);
                      if (next.has(block.id)) next.delete(block.id);
                      else next.add(block.id);
                      return next;
                    })
                  }
                  aria-expanded={expanded}
                >
                  <span className="block-index">{block.id}</span>
                  <span className="block-trigger-copy">
                    <strong>{block.shortTitle}</strong>
                    <small>
                      {completed}/{lessons.length}
                    </small>
                  </span>
                  <ChevronDown
                    size={16}
                    className={expanded ? "is-rotated" : ""}
                    aria-hidden="true"
                  />
                </button>

                {expanded && (
                  <div className="sidebar-lessons">
                    {lessons.map((document) => (
                      <NavLink
                        key={document.id}
                        to={document.route}
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          `sidebar-lesson${isActive ? " is-active" : ""}${
                            completedSet.has(document.id) ? " is-complete" : ""
                          }`
                        }
                      >
                        <span className="lesson-status" aria-hidden="true" />
                        <span>{document.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <div className="sidebar-progress">
          <div className="progress-label">
            <span>Загальний прогрес</span>
            <strong>{Math.round(lessonProgress * 100)}%</strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${lessonProgress * 100}%` }} />
          </div>
          <small>{lessonDocuments.length - completedLessonCount} уроків попереду</small>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={closeMobile}
          aria-label="Закрити навігацію"
        />
      )}

      <div className="app-column">
        <header className="topbar">
          <button
            type="button"
            className="icon-button mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Відкрити навігацію"
          >
            <Menu size={21} />
          </button>

          <div className="topbar-context">
            <span className="status-dot" aria-hidden="true" />
            <span>UE 5.8 learning path</span>
          </div>

          <button
            type="button"
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Відкрити пошук"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search size={17} aria-hidden="true" />
            <span>Пошук у 166 матеріалах</span>
            <kbd>Ctrl K</kbd>
          </button>
        </header>

        <main id="main-content" className="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
