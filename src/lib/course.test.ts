import { describe, expect, it } from "vitest";
import {
  assessmentDocuments,
  courseBlocks,
  courseDocuments,
  courseManifest,
  documentsById,
  documentsByRoute,
  lessonDocuments,
} from "./course";

describe("generated course manifest", () => {
  it("contains the complete approved curriculum", () => {
    expect(courseBlocks).toHaveLength(11);
    expect(lessonDocuments).toHaveLength(66);
    expect(assessmentDocuments).toHaveLength(11);
    expect(courseDocuments).toHaveLength(166);
    expect(courseManifest.stats.hours).toBe(456);
    expect(courseManifest.stats.materialPracticeHours).toBe(140);
  });

  it("uses unique public routes", () => {
    expect(documentsByRoute.size).toBe(courseDocuments.length);
  });

  it("connects every lesson and assessment to its solution", () => {
    for (const document of [...lessonDocuments, ...assessmentDocuments]) {
      expect(document.answerId, `${document.id} has no answer`).toBeTruthy();
      expect(
        documentsById.has(document.answerId ?? ""),
        `${document.id} points to a missing answer`,
      ).toBe(true);
    }
  });

  it("assigns every lesson to a known block", () => {
    const blockIds = new Set(courseBlocks.map((block) => block.id));
    for (const lesson of lessonDocuments) {
      expect(blockIds.has(lesson.blockId ?? "")).toBe(true);
      expect(lesson.totalHours).toBeGreaterThan(0);
    }
  });
});
