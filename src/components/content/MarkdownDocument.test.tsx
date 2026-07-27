// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CourseProgressProvider } from "../../state/progress";
import type { CourseDocument } from "../../types/course";
import { MarkdownDocument } from "./MarkdownDocument";

const testDocument: CourseDocument = {
  id: "TEST-CHECKLIST",
  kind: "lesson",
  route: "/learn/test-checklist",
  order: 1,
  sourcePath: "TEST.md",
  title: "Checklist test",
  blockId: "01",
  lessonNumber: "01",
  theoryHours: 1,
  practiceHours: 1,
  totalHours: 2,
  headings: [],
  excerpt: "",
  words: 4,
  readMinutes: 1,
};

function renderChecklist() {
  return render(
    <CourseProgressProvider>
      <MarkdownDocument
        document={testDocument}
        markdown={"- [ ] Перший пункт\n- [ ] Другий пункт"}
      />
    </CourseProgressProvider>,
  );
}

describe("Markdown checklist", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("enables generated task checkboxes and toggles checked styling", async () => {
    const user = userEvent.setup();
    renderChecklist();

    const checkbox = screen.getByRole("checkbox", {
      name: "Checklist пункт 1 у Checklist test",
    });
    const taskItem = screen.getByText("Перший пункт");

    expect(checkbox).toBeEnabled();
    expect(checkbox).not.toBeChecked();
    expect(taskItem).not.toHaveClass("is-checked");

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(taskItem).toHaveClass("is-checked");
  });

  it("toggles the checkbox when the task text is clicked", async () => {
    const user = userEvent.setup();
    renderChecklist();

    const checkbox = screen.getByRole("checkbox", {
      name: "Checklist пункт 2 у Checklist test",
    });

    await user.click(screen.getByText("Другий пункт"));

    expect(checkbox).toBeChecked();
  });
});
