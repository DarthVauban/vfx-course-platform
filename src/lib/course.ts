import manifestJson from "../generated/course-manifest.json";
import type {
  CourseBlock,
  CourseDocument,
  CourseManifest,
} from "../types/course";

export const courseManifest = manifestJson as CourseManifest;
export const courseBlocks = courseManifest.blocks;
export const courseDocuments = courseManifest.documents;

export const documentsById = new Map(
  courseDocuments.map((document) => [document.id, document]),
);
export const documentsByRoute = new Map(
  courseDocuments.map((document) => [document.route, document]),
);
export const documentsBySourcePath = new Map(
  courseDocuments.map((document) => [document.sourcePath, document]),
);
export const blocksById = new Map(
  courseBlocks.map((block) => [block.id, block]),
);

export const lessonDocuments = courseDocuments.filter(
  (document) => document.kind === "lesson",
);
export const assessmentDocuments = courseDocuments.filter(
  (document) => document.kind === "assessment",
);
export const learningSequence = courseDocuments.filter(
  (document) =>
    document.kind === "lesson" || document.kind === "assessment",
);

const markdownModules = import.meta.glob(
  "../../stylized-vfx-course/**/*.md",
  {
    query: "?raw",
    import: "default",
  },
) as Record<string, () => Promise<string>>;

export async function loadCourseMarkdown(document: CourseDocument) {
  const moduleKey = `../../stylized-vfx-course/${document.sourcePath}`;
  const loader = markdownModules[moduleKey];

  if (!loader) {
    throw new Error(`Markdown module not found: ${document.sourcePath}`);
  }

  return loader();
}

export function getBlock(blockId: string | null): CourseBlock | undefined {
  return blockId ? blocksById.get(blockId) : undefined;
}

export function getDocumentsForBlock(blockId: string) {
  return learningSequence.filter((document) => document.blockId === blockId);
}

export function getLessonDocumentsForBlock(blockId: string) {
  return lessonDocuments.filter((document) => document.blockId === blockId);
}

export function getDocumentNeighbors(documentId: string) {
  const index = learningSequence.findIndex(
    (document) => document.id === documentId,
  );

  return {
    previous: index > 0 ? learningSequence[index - 1] : undefined,
    next:
      index >= 0 && index < learningSequence.length - 1
        ? learningSequence[index + 1]
        : undefined,
  };
}

function normalizeRelativePath(currentSourcePath: string, target: string) {
  const currentDirectory = currentSourcePath.split("/").slice(0, -1);
  const targetSegments = target.split("/");
  const resolved = [...currentDirectory];

  for (const segment of targetSegments) {
    if (!segment || segment === ".") continue;
    if (segment === "..") {
      resolved.pop();
    } else {
      resolved.push(segment);
    }
  }

  return resolved.join("/");
}

export function resolveMarkdownHref(
  currentDocument: CourseDocument,
  href?: string,
) {
  if (!href || href.startsWith("#")) return href ?? "";
  if (/^(?:https?:|mailto:)/i.test(href)) return href;

  const [targetPath, hash] = href.split("#");
  if (!targetPath.toLowerCase().endsWith(".md")) return href;

  const resolvedPath = normalizeRelativePath(
    currentDocument.sourcePath,
    decodeURIComponent(targetPath),
  );
  const targetDocument = documentsBySourcePath.get(resolvedPath);
  if (!targetDocument) return href;

  return `${targetDocument.route}${hash ? `#${hash}` : ""}`;
}

export function prepareMarkdownForReader(
  markdown: string,
  document: CourseDocument,
) {
  const lines = markdown.split(/\r?\n/);
  let removedTitle = false;

  return lines
    .filter((line) => {
      if (removedTitle || !/^#{1,2}\s+/.test(line)) return true;
      const clean = line
        .replace(/^#{1,2}\s+/, "")
        .replace(/[*_`]/g, "")
        .trim();

      removedTitle = true;
      if (/^(?:1\.\s*)?Назва$/i.test(clean)) return false;
      if (clean === document.title) return false;
      return true;
    })
    .filter((line, index, allLines) => {
      if (!/^#{1,2}\s+/.test(line)) return true;
      const clean = line
        .replace(/^#{1,2}\s+/, "")
        .replace(/[*_`]/g, "")
        .trim();
      if (clean !== document.title) return true;

      const previousContent = allLines
        .slice(0, index)
        .some((candidate) => candidate.trim().length > 0);
      return previousContent;
    })
    .join("\n");
}

export const documentKindLabels: Record<CourseDocument["kind"], string> = {
  guide: "Гайд",
  glossary: "Глосарій",
  sources: "Джерела",
  lesson: "Урок",
  assessment: "Контрольна",
  answer: "Рішення",
  "assessment-key": "Ключ",
  checklist: "Checklist",
};

