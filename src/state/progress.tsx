import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { lessonDocuments } from "../lib/course";
import { clamp } from "../lib/format";

const STORAGE_KEY = "arcana-vfx-progress-v1";

export interface AssessmentResult {
  score: number;
  updatedAt: string;
}

export interface CourseProgressState {
  version: 1;
  completed: string[];
  bookmarks: string[];
  checklistItems: Record<string, number[]>;
  notes: Record<string, string>;
  assessmentResults: Record<string, AssessmentResult>;
  weeklyHours: number;
  lastVisitedId: string | null;
}

interface CourseProgressContextValue {
  state: CourseProgressState;
  completedSet: Set<string>;
  bookmarkSet: Set<string>;
  completedLessonCount: number;
  lessonProgress: number;
  toggleCompleted: (documentId: string) => void;
  toggleBookmark: (documentId: string) => void;
  setChecklistItem: (
    documentId: string,
    itemIndex: number,
    checked: boolean,
  ) => void;
  setNote: (documentId: string, note: string) => void;
  setAssessmentScore: (assessmentId: string, score: number | null) => void;
  setWeeklyHours: (hours: number) => void;
  setLastVisited: (documentId: string) => void;
  exportProgress: () => string;
  importProgress: (serialized: string) => void;
  resetProgress: () => void;
}

const createInitialState = (): CourseProgressState => ({
  version: 1,
  completed: [],
  bookmarks: [],
  checklistItems: {},
  notes: {},
  assessmentResults: {},
  weeklyHours: 9,
  lastVisitedId: null,
});

function sanitizeState(value: unknown): CourseProgressState {
  if (!value || typeof value !== "object") return createInitialState();
  const source = value as Partial<CourseProgressState>;
  const checklistItems = Object.fromEntries(
    Object.entries(source.checklistItems ?? {})
      .filter(([, items]) => Array.isArray(items))
      .map(([documentId, items]) => [
        documentId,
        [...new Set(
          (items as unknown[]).filter(
            (item): item is number =>
              Number.isInteger(item) && Number(item) >= 0,
          ),
        )].sort((left, right) => left - right),
      ]),
  );
  const notes = Object.fromEntries(
    Object.entries(source.notes ?? {}).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
  const assessmentResults = Object.fromEntries(
    Object.entries(source.assessmentResults ?? {}).flatMap(
      ([assessmentId, result]) => {
        if (!result || typeof result !== "object") return [];
        const candidate = result as Partial<AssessmentResult>;
        const score = Number(candidate.score);
        if (!Number.isFinite(score)) return [];
        return [
          [
            assessmentId,
            {
              score: clamp(Math.round(score), 0, 100),
              updatedAt:
                typeof candidate.updatedAt === "string"
                  ? candidate.updatedAt
                  : new Date().toISOString(),
            },
          ],
        ];
      },
    ),
  );

  return {
    version: 1,
    completed: Array.isArray(source.completed)
      ? source.completed.filter((item): item is string => typeof item === "string")
      : [],
    bookmarks: Array.isArray(source.bookmarks)
      ? source.bookmarks.filter((item): item is string => typeof item === "string")
      : [],
    checklistItems,
    notes,
    assessmentResults,
    weeklyHours: clamp(Number(source.weeklyHours) || 9, 7, 12),
    lastVisitedId:
      typeof source.lastVisitedId === "string" ? source.lastVisitedId : null,
  };
}

function readStoredState() {
  if (typeof window === "undefined") return createInitialState();
  const serialized = window.localStorage.getItem(STORAGE_KEY);
  if (!serialized) return createInitialState();

  try {
    return sanitizeState(JSON.parse(serialized));
  } catch {
    return createInitialState();
  }
}

const CourseProgressContext =
  createContext<CourseProgressContextValue | null>(null);

export function CourseProgressProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<CourseProgressState>(readStoredState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        setState(sanitizeState(JSON.parse(event.newValue)));
      } catch {
        // Ignore malformed data from another tab.
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleInArray = useCallback(
    (field: "completed" | "bookmarks", documentId: string) => {
      setState((current) => {
        const values = new Set(current[field]);
        if (values.has(documentId)) values.delete(documentId);
        else values.add(documentId);
        return { ...current, [field]: [...values] };
      });
    },
    [],
  );

  const setChecklistItem = useCallback(
    (documentId: string, itemIndex: number, checked: boolean) => {
      setState((current) => {
        const values = new Set(current.checklistItems[documentId] ?? []);
        if (checked) values.add(itemIndex);
        else values.delete(itemIndex);

        return {
          ...current,
          checklistItems: {
            ...current.checklistItems,
            [documentId]: [...values].sort((left, right) => left - right),
          },
        };
      });
    },
    [],
  );

  const setNote = useCallback((documentId: string, note: string) => {
    setState((current) => ({
      ...current,
      notes: { ...current.notes, [documentId]: note },
    }));
  }, []);

  const setAssessmentScore = useCallback(
    (assessmentId: string, score: number | null) => {
      setState((current) => {
        const results = { ...current.assessmentResults };
        if (score === null || Number.isNaN(score)) {
          delete results[assessmentId];
        } else {
          results[assessmentId] = {
            score: clamp(Math.round(score), 0, 100),
            updatedAt: new Date().toISOString(),
          };
        }
        return { ...current, assessmentResults: results };
      });
    },
    [],
  );

  const setWeeklyHours = useCallback((hours: number) => {
    setState((current) => ({
      ...current,
      weeklyHours: clamp(Math.round(hours), 7, 12),
    }));
  }, []);

  const setLastVisited = useCallback((documentId: string) => {
    setState((current) =>
      current.lastVisitedId === documentId
        ? current
        : { ...current, lastVisitedId: documentId },
    );
  }, []);

  const importProgress = useCallback((serialized: string) => {
    setState(sanitizeState(JSON.parse(serialized)));
  }, []);

  const resetProgress = useCallback(() => {
    setState(createInitialState());
  }, []);

  const completedSet = useMemo(
    () => new Set(state.completed),
    [state.completed],
  );
  const bookmarkSet = useMemo(
    () => new Set(state.bookmarks),
    [state.bookmarks],
  );
  const completedLessonCount = lessonDocuments.filter((document) =>
    completedSet.has(document.id),
  ).length;

  const value = useMemo<CourseProgressContextValue>(
    () => ({
      state,
      completedSet,
      bookmarkSet,
      completedLessonCount,
      lessonProgress:
        lessonDocuments.length > 0
          ? completedLessonCount / lessonDocuments.length
          : 0,
      toggleCompleted: (documentId) =>
        toggleInArray("completed", documentId),
      toggleBookmark: (documentId) =>
        toggleInArray("bookmarks", documentId),
      setChecklistItem,
      setNote,
      setAssessmentScore,
      setWeeklyHours,
      setLastVisited,
      exportProgress: () => JSON.stringify(state, null, 2),
      importProgress,
      resetProgress,
    }),
    [
      state,
      completedSet,
      bookmarkSet,
      completedLessonCount,
      toggleInArray,
      setChecklistItem,
      setNote,
      setAssessmentScore,
      setWeeklyHours,
      setLastVisited,
      importProgress,
      resetProgress,
    ],
  );

  return (
    <CourseProgressContext.Provider value={value}>
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext);
  if (!context) {
    throw new Error(
      "useCourseProgress must be used inside CourseProgressProvider",
    );
  }
  return context;
}
