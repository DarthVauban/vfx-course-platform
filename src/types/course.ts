export type CourseDocumentKind =
  | "guide"
  | "glossary"
  | "sources"
  | "lesson"
  | "assessment"
  | "answer"
  | "assessment-key"
  | "checklist";

export interface CourseHeading {
  level: number;
  title: string;
  slug: string;
}

export interface CourseDocument {
  id: string;
  kind: CourseDocumentKind;
  route: string;
  order: number;
  sourcePath: string;
  title: string;
  blockId: string | null;
  lessonNumber: string | null;
  theoryHours: number | null;
  practiceHours: number | null;
  totalHours: number | null;
  headings: CourseHeading[];
  excerpt: string;
  words: number;
  readMinutes: number;
  parentId?: string;
  answerId?: string | null;
}

export interface CourseBlock {
  id: string;
  folder: string;
  title: string;
  titleUk: string;
  shortTitle: string;
  theoryHours: number;
  practiceHours: number;
  materialHours: number;
  totalHours: number;
  accent: string;
  description: string;
}

export interface CourseManifest {
  generatedAt: string;
  version: number;
  stats: {
    lessons: number;
    assessments: number;
    answers: number;
    checklists: number;
    hours: number;
    theoryHours: number;
    practiceHours: number;
    materialPracticeHours: number;
    mermaidDiagrams: number;
  };
  blocks: CourseBlock[];
  documents: CourseDocument[];
}

export interface SearchDocument {
  id: string;
  title: string;
  route: string;
  kind: CourseDocumentKind;
  blockId: string | null;
  blockTitle: string;
  headings: string;
  text: string;
}

