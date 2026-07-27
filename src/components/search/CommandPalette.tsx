import MiniSearch, { type SearchResult } from "minisearch";
import {
  ArrowRight,
  BookOpen,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { documentKindLabels } from "../../lib/course";
import type { SearchDocument } from "../../types/course";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

type StoredSearchResult = SearchResult & {
  title?: string;
  route?: string;
  kind?: SearchDocument["kind"];
  blockTitle?: string;
};

let searchEnginePromise: Promise<MiniSearch<SearchDocument>> | null = null;

async function loadSearchEngine() {
  if (searchEnginePromise) return searchEnginePromise;

  searchEnginePromise = fetch("/generated/course-search.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Не вдалося завантажити пошуковий індекс.");
      }
      return response.json() as Promise<SearchDocument[]>;
    })
    .then((documents) => {
      const engine = new MiniSearch<SearchDocument>({
        fields: ["title", "blockTitle", "headings", "text"],
        storeFields: ["title", "route", "kind", "blockTitle"],
        searchOptions: {
          boost: { title: 6, headings: 3, blockTitle: 2 },
          fuzzy: 0.18,
          prefix: true,
        },
      });
      engine.addAll(documents);
      return engine;
    });

  return searchEnginePromise;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [engine, setEngine] = useState<MiniSearch<SearchDocument> | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setError(null);

    loadSearchEngine()
      .then((loaded) => {
        if (!active) return;
        setEngine(loaded);
        window.setTimeout(() => inputRef.current?.focus(), 0);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Помилка пошуку.");
      });

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const results = useMemo<StoredSearchResult[]>(() => {
    const normalized = query.trim();
    if (!engine || normalized.length < 2) return [];
    return engine.search(normalized).slice(0, 12) as StoredSearchResult[];
  }, [engine, query]);

  if (!open) return null;

  const openResult = (route?: string) => {
    if (!route) return;
    navigate(route);
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    openResult(results[0]?.route);
  };

  return (
    <div className="command-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="command-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Пошук у матеріалах курсу"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <form className="command-search" onSubmit={handleSubmit}>
          <Search size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Наприклад: Fresnel, ribbon, overdraw…"
            aria-label="Пошуковий запит"
          />
          {!engine && !error ? (
            <LoaderCircle className="spin" size={18} aria-label="Завантаження" />
          ) : (
            <button
              type="button"
              className="icon-button"
              onClick={onClose}
              aria-label="Закрити пошук"
            >
              <X size={18} />
            </button>
          )}
        </form>

        <div className="command-results" aria-live="polite">
          {error && <p className="command-message is-error">{error}</p>}
          {!error && query.length < 2 && (
            <div className="command-empty">
              <BookOpen size={30} strokeWidth={1.4} aria-hidden="true" />
              <p>Введи щонайменше два символи.</p>
              <span>Пошук працює по повному тексту всіх 166 матеріалів.</span>
            </div>
          )}
          {!error && query.length >= 2 && results.length === 0 && (
            <p className="command-message">Нічого не знайдено.</p>
          )}
          {results.map((result) => (
            <button
              key={String(result.id)}
              type="button"
              className="command-result"
              onClick={() => openResult(result.route)}
            >
              <span className="result-kind">
                {result.kind ? documentKindLabels[result.kind] : "Матеріал"}
              </span>
              <span className="result-copy">
                <strong>{result.title}</strong>
                <small>{result.blockTitle || "Загальні матеріали"}</small>
              </span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          ))}
        </div>

        <footer className="command-footer">
          <span>
            <kbd>Enter</kbd> відкрити перший результат
          </span>
          <span>
            <kbd>Esc</kbd> закрити
          </span>
        </footer>
      </section>
    </div>
  );
}

