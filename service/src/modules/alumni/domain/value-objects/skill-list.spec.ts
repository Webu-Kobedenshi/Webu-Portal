import { SkillList } from "./skill-list";

describe("SkillList", () => {
  it("normalizes and limits to 3 skills", () => {
    const list = SkillList.from([" React ", "Node", "React", "TypeScript", "Prisma"]);

    expect(list.toArray()).toEqual(["React", "Node", "TypeScript"]);
  });

  it("returns empty list from undefined", () => {
    const list = SkillList.from(undefined);

    expect(list.toArray()).toEqual([]);
  });
});
