import { promises as fs } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

const workspaceRoot = process.cwd();
const courseRoot = path.join(workspaceRoot, "stylized-vfx-course");
const generatedRoot = path.join(workspaceRoot, "src", "generated");
const publicGeneratedRoot = path.join(workspaceRoot, "public", "generated");

const blocks = [
  {
    id: "01",
    folder: "01_UE_FOUNDATIONS",
    title: "Unreal Engine Foundations",
    titleUk: "Основи Unreal Engine",
    shortTitle: "UE Foundations",
    theoryHours: 6.5,
    practiceHours: 15.5,
    materialHours: 0,
    accent: "#67d9ff",
    description:
      "Безпечний UE 5.8 sandbox, дисципліна assets, test level і відтворюваний debugging baseline.",
  },
  {
    id: "02",
    folder: "02_VFX_DESIGN",
    title: "VFX Design",
    titleUk: "Дизайн VFX",
    shortTitle: "VFX Design",
    theoryHours: 6.5,
    practiceHours: 17.5,
    materialHours: 0,
    accent: "#f59cf4",
    description:
      "Reference analysis, silhouette, value, color, timing і мова читабельного gameplay-ефекту.",
  },
  {
    id: "03",
    folder: "03_MATERIAL_FOUNDATIONS",
    title: "Material Foundations",
    titleUk: "Основи матеріалів",
    shortTitle: "Materials I",
    theoryHours: 18.5,
    practiceHours: 51.5,
    materialHours: 51.5,
    accent: "#ff9b64",
    description:
      "Shader mental model, math, UV, procedural masks, textures, blending, depth і системний debugging.",
  },
  {
    id: "04",
    folder: "04_STYLIZED_VFX_MATERIALS",
    title: "Stylized VFX Materials",
    titleUk: "Стилізовані VFX-матеріали",
    shortTitle: "Materials II",
    theoryHours: 11.5,
    practiceHours: 44.5,
    materialHours: 44.5,
    accent: "#ffcc66",
    description:
      "Dissolve, distortion, flow, gradient mapping, Fresnel, WPO й runtime data для production VFX.",
  },
  {
    id: "05",
    folder: "05_PHOTOSHOP_VFX_TEXTURES",
    title: "Photoshop VFX Textures",
    titleUk: "VFX-текстури",
    shortTitle: "Textures",
    theoryHours: 5,
    practiceHours: 23,
    materialHours: 14,
    accent: "#ff6f91",
    description:
      "Малювання noise, smoke, slash, sparks, ramps, distortion і packed textures із перевіркою в UE.",
  },
  {
    id: "06",
    folder: "06_BLENDER_AND_SUBSTANCE",
    title: "Blender and Substance",
    titleUk: "Blender і Substance",
    shortTitle: "3D & Procedural",
    theoryHours: 5,
    practiceHours: 19,
    materialHours: 5,
    accent: "#a58cff",
    description:
      "VFX meshes, UV, normals, vertex color та процедурні masks для Material і Niagara pipeline.",
  },
  {
    id: "07",
    folder: "07_NIAGARA_FOUNDATIONS",
    title: "Niagara Foundations",
    titleUk: "Основи Niagara",
    shortTitle: "Niagara I",
    theoryHours: 14,
    practiceHours: 46,
    materialHours: 4,
    accent: "#62e6c8",
    description:
      "System, Emitter, modules, forces, renderers, bindings і контрольний production-style Niagara system.",
  },
  {
    id: "08",
    folder: "08_NIAGARA_ADVANCED",
    title: "Niagara Advanced",
    titleUk: "Просунута Niagara",
    shortTitle: "Niagara II",
    theoryHours: 7.5,
    practiceHours: 20.5,
    materialHours: 2,
    accent: "#5ba8ff",
    description:
      "CPU/GPU, collisions, events, data interfaces, user parameters, reusable modules і scalability.",
  },
  {
    id: "09",
    folder: "09_EFFECT_ARCHETYPES",
    title: "Effect Archetypes",
    titleUk: "Архетипи ефектів",
    shortTitle: "Archetypes",
    theoryHours: 11,
    practiceHours: 47,
    materialHours: 9,
    accent: "#f56d72",
    description:
      "Вогонь, вода, лід, електрика, вітер, земля, природа, світло й void як цілісні style languages.",
  },
  {
    id: "10",
    folder: "10_GAMEPLAY_AND_OPTIMIZATION",
    title: "Gameplay and Optimization",
    titleUk: "Gameplay та оптимізація",
    shortTitle: "Production",
    theoryHours: 9,
    practiceHours: 31,
    materialHours: 4,
    accent: "#89d46f",
    description:
      "Lifecycle, sockets, notifies, reusable parameters, profiling, budgets, scalability і presentation.",
  },
  {
    id: "11",
    folder: "11_PORTFOLIO_PROJECTS",
    title: "Portfolio Projects",
    titleUk: "Портфоліо-проєкти",
    shortTitle: "Portfolio",
    theoryHours: 6,
    practiceHours: 40,
    materialHours: 6,
    accent: "#ffd65c",
    description:
      "Чотири production briefs, breakdowns, reel, case studies і підготовка до junior VFX applications.",
  },
].map((block) => ({
  ...block,
  totalHours: block.theoryHours + block.practiceHours,
}));

const rootDocumentConfig = {
  "00_START_HERE.md": {
    id: "START",
    kind: "guide",
    route: "/guide/start",
    order: 0,
  },
  "01_COURSE_MAP.md": {
    id: "COURSE-MAP",
    kind: "guide",
    route: "/guide/course-map",
    order: 1,
  },
  "02_GLOSSARY.md": {
    id: "GLOSSARY",
    kind: "glossary",
    route: "/resources/glossary",
    order: 2,
  },
  "03_STUDY_AND_SELF_REVIEW.md": {
    id: "STUDY-SYSTEM",
    kind: "guide",
    route: "/guide/study-system",
    order: 3,
  },
  "SOURCES.md": {
    id: "SOURCES",
    kind: "sources",
    route: "/resources/sources",
    order: 4,
  },
};

const normalizePath = (value) => value.split(path.sep).join("/");

const walkMarkdown = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdown(absolutePath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(absolutePath);
    }
  }

  return files;
};

const cleanInlineMarkdown = (value) =>
  value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const stripMarkdown = (value) =>
  value
    .replace(/^---[\s\S]*?---/m, " ")
    .replace(/^```[^\n]*$/gm, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-+*]\s+\[[ xX]\]\s+/gm, "")
    .replace(/^\s*[-+*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[`*_~<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractFallbackTitle = (content, relativePath) => {
  const lines = content.split(/\r?\n/).slice(0, 30);
  const candidates = lines
    .filter((line) => /^#{1,2}\s+/.test(line))
    .map((line) => cleanInlineMarkdown(line.replace(/^#{1,2}\s+/, "")));

  const meaningful = candidates.find(
    (candidate) =>
      !/^(?:1\.\s*)?Назва$/i.test(candidate) &&
      !/^Рішення вправ/i.test(candidate),
  );

  let title = meaningful ?? candidates[0] ?? path.basename(relativePath, ".md");
  title = title.replace(/^1\.\s+(?=(?:L|Урок))/i, "");
  return title;
};

const extractHeadings = (content) => {
  const slugger = new GithubSlugger();
  const headings = [];
  const pattern = /^(#{1,3})\s+(.+)$/gm;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const title = cleanInlineMarkdown(match[2]);
    if (!title) continue;
    headings.push({
      level: match[1].length,
      title,
      slug: slugger.slug(title),
    });
  }

  return headings;
};

const selectReaderHeadings = (headings) => {
  const usable = headings.filter(
    (heading) =>
      !/^(?:1\.\s*)?Назва$/i.test(heading.title) &&
      !/^Урок\s+\d{2}\.\d{2}/i.test(heading.title),
  );
  if (usable.length === 0) return [];

  const minimumLevel = Math.min(
    ...usable.map((heading) => heading.level),
    2,
  );
  return usable
    .filter((heading) => heading.level <= minimumLevel + 1)
    .slice(0, 28);
};

const extractExcerpt = (content, title) => {
  const paragraphs = content
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\n\s*\n/)
    .map(stripMarkdown)
    .filter(
      (paragraph) =>
        paragraph.length > 70 &&
        paragraph !== title &&
        !paragraph.startsWith("Після уроку"),
    );

  return (paragraphs[0] ?? stripMarkdown(content)).slice(0, 260);
};

const courseMapPath = path.join(courseRoot, "01_COURSE_MAP.md");
const courseMapContent = await fs.readFile(courseMapPath, "utf8");
const mappedLessons = new Map();
let activeBlockId = null;

for (const line of courseMapContent.split(/\r?\n/)) {
  const blockHeading = line.match(/^#\s+(\d{2})\.\s+/);
  if (blockHeading) {
    activeBlockId = blockHeading[1];
    continue;
  }

  const lessonRow = line.match(
    /^\|\s*(\d{2})\.(\d{2})\s*\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([\d.,]+)\/([\d.,]+)\s*\|/,
  );

  if (!lessonRow || !activeBlockId) continue;

  const [, rowBlock, lessonNumber, fileName, title, theory, practice] =
    lessonRow;
  if (rowBlock !== activeBlockId) {
    throw new Error(`Course map block mismatch for ${rowBlock}.${lessonNumber}`);
  }

  const block = blocks.find((candidate) => candidate.id === rowBlock);
  if (!block) throw new Error(`Unknown block ${rowBlock}`);

  mappedLessons.set(`${block.folder}/${fileName}`, {
    id: `L${rowBlock}-${lessonNumber}`,
    blockId: rowBlock,
    lessonNumber,
    title: cleanInlineMarkdown(title),
    theoryHours: Number(theory.replace(",", ".")),
    practiceHours: Number(practice.replace(",", ".")),
  });
}

const absoluteFiles = await walkMarkdown(courseRoot);
const sourcePaths = new Set(
  absoluteFiles.map((file) => normalizePath(path.relative(courseRoot, file))),
);
const documents = [];
const searchDocuments = [];

for (const absolutePath of absoluteFiles) {
  const sourcePath = normalizePath(path.relative(courseRoot, absolutePath));
  const fileName = path.posix.basename(sourcePath);
  const directory = path.posix.dirname(sourcePath);
  const content = await fs.readFile(absolutePath, "utf8");
  const headings = extractHeadings(content);
  const fallbackTitle = extractFallbackTitle(content, sourcePath);
  const words = stripMarkdown(content).split(/\s+/).filter(Boolean).length;

  let document;

  if (rootDocumentConfig[sourcePath]) {
    const config = rootDocumentConfig[sourcePath];
    document = {
      ...config,
      sourcePath,
      title: fallbackTitle,
      blockId: null,
      lessonNumber: null,
      theoryHours: null,
      practiceHours: null,
      totalHours: null,
    };
  } else if (directory === "CHECKLISTS") {
    const stem = path.posix.basename(fileName, ".md");
    document = {
      id: `CHECK-${stem}`,
      kind: "checklist",
      route: `/checklists/${stem.toLowerCase().replaceAll("_", "-")}`,
      order: 600,
      sourcePath,
      title: fallbackTitle,
      blockId: null,
      lessonNumber: null,
      theoryHours: null,
      practiceHours: null,
      totalHours: null,
    };
  } else if (directory === "EXERCISE_ANSWERS") {
    const lessonMatch = fileName.match(/^L(\d{2})-(\d{2})_(.+)_answers\.md$/);
    const blockMatch = fileName.match(/^B(\d{2})_BLOCK_ASSESSMENT_KEY\.md$/);
    const stem = path.posix.basename(fileName, ".md");

    if (lessonMatch) {
      const [, blockId, lessonNumber] = lessonMatch;
      document = {
        id: `SOL-L${blockId}-${lessonNumber}`,
        kind: "answer",
        route: `/answers/${stem.toLowerCase().replaceAll("_", "-")}`,
        order: 700 + Number(blockId) * 100 + Number(lessonNumber),
        sourcePath,
        title: fallbackTitle,
        blockId,
        lessonNumber,
        parentId: `L${blockId}-${lessonNumber}`,
        theoryHours: null,
        practiceHours: null,
        totalHours: null,
      };
    } else if (blockMatch) {
      const blockId = blockMatch[1];
      document = {
        id: `KEY-B${blockId}`,
        kind: "assessment-key",
        route: `/answers/${stem.toLowerCase().replaceAll("_", "-")}`,
        order: 750 + Number(blockId) * 100,
        sourcePath,
        title: fallbackTitle,
        blockId,
        lessonNumber: null,
        parentId: `A${blockId}`,
        theoryHours: null,
        practiceHours: null,
        totalHours: null,
      };
    } else {
      throw new Error(`Unrecognized answer file: ${sourcePath}`);
    }
  } else if (fileName === "BLOCK_ASSESSMENT.md") {
    const block = blocks.find((candidate) => candidate.folder === directory);
    if (!block) throw new Error(`Assessment outside a known block: ${sourcePath}`);
    document = {
      id: `A${block.id}`,
      kind: "assessment",
      route: `/assessment/${block.id}`,
      order: Number(block.id) * 100 + 99,
      sourcePath,
      title: fallbackTitle,
      blockId: block.id,
      lessonNumber: null,
      theoryHours: null,
      practiceHours: null,
      totalHours: null,
    };
  } else {
    const mapped = mappedLessons.get(sourcePath);
    if (!mapped) throw new Error(`Lesson missing from course map: ${sourcePath}`);
    document = {
      ...mapped,
      kind: "lesson",
      route: `/learn/${mapped.id.toLowerCase()}`,
      order: Number(mapped.blockId) * 100 + Number(mapped.lessonNumber),
      sourcePath,
      totalHours: mapped.theoryHours + mapped.practiceHours,
    };
  }

  const excerpt = extractExcerpt(content, document.title);
  const enriched = {
    ...document,
    headings: selectReaderHeadings(headings),
    excerpt,
    words,
    readMinutes: Math.max(1, Math.ceil(words / 190)),
  };
  documents.push(enriched);
  searchDocuments.push({
    id: enriched.id,
    title: enriched.title,
    route: enriched.route,
    kind: enriched.kind,
    blockId: enriched.blockId,
    blockTitle:
      blocks.find((block) => block.id === enriched.blockId)?.titleUk ?? "",
    headings: headings.map((heading) => heading.title).join(" "),
    text: stripMarkdown(content),
  });

  const markdownLinkPattern = /\[[^\]]*\]\(([^)]+\.md(?:#[^)]+)?)\)/g;
  let linkMatch;
  while ((linkMatch = markdownLinkPattern.exec(content)) !== null) {
    const rawTarget = linkMatch[1].split("#")[0];
    if (/^[a-z]+:\/\//i.test(rawTarget)) continue;
    const resolvedTarget = normalizePath(
      path.posix.normalize(path.posix.join(directory, rawTarget)),
    );
    if (!sourcePaths.has(resolvedTarget)) {
      throw new Error(`Broken Markdown link in ${sourcePath}: ${linkMatch[1]}`);
    }
  }
}

documents.sort((left, right) => left.order - right.order);

for (const lesson of documents.filter((document) => document.kind === "lesson")) {
  const answer = documents.find(
    (document) =>
      document.kind === "answer" && document.parentId === lesson.id,
  );
  lesson.answerId = answer?.id ?? null;
}

for (const assessment of documents.filter(
  (document) => document.kind === "assessment",
)) {
  const key = documents.find(
    (document) =>
      document.kind === "assessment-key" &&
      document.parentId === assessment.id,
  );
  assessment.answerId = key?.id ?? null;
}

const routeSet = new Set();
const idSet = new Set();
for (const document of documents) {
  if (routeSet.has(document.route)) {
    throw new Error(`Duplicate document route: ${document.route}`);
  }
  if (idSet.has(document.id)) {
    throw new Error(`Duplicate document id: ${document.id}`);
  }
  routeSet.add(document.route);
  idSet.add(document.id);
}

const expectedCounts = {
  lesson: 66,
  assessment: 11,
  answer: 66,
  "assessment-key": 11,
  checklist: 7,
};

for (const [kind, expected] of Object.entries(expectedCounts)) {
  const actual = documents.filter((document) => document.kind === kind).length;
  if (actual !== expected) {
    throw new Error(`Expected ${expected} ${kind} docs, found ${actual}`);
  }
}

if (mappedLessons.size !== 66) {
  throw new Error(`Expected 66 course-map lessons, found ${mappedLessons.size}`);
}

const lessonHours = documents
  .filter((document) => document.kind === "lesson")
  .reduce((sum, document) => sum + document.totalHours, 0);

if (lessonHours !== 456) {
  throw new Error(`Expected 456 lesson hours, found ${lessonHours}`);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  version: 1,
  stats: {
    lessons: 66,
    assessments: 11,
    answers: 77,
    checklists: 7,
    hours: 456,
    theoryHours: 100.5,
    practiceHours: 355.5,
    materialPracticeHours: 140,
    mermaidDiagrams: 24,
  },
  blocks,
  documents,
};

await fs.mkdir(generatedRoot, { recursive: true });
await fs.mkdir(publicGeneratedRoot, { recursive: true });
await fs.writeFile(
  path.join(generatedRoot, "course-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
await fs.writeFile(
  path.join(publicGeneratedRoot, "course-search.json"),
  `${JSON.stringify(searchDocuments)}\n`,
  "utf8",
);

console.log(
  `Course data generated: ${documents.length} documents, 66 lessons, 456 hours.`,
);
