import { CompanyNameCollection } from "./company-name";

describe("CompanyNameCollection", () => {
  it("trims, removes empties, and deduplicates", () => {
    const collection = CompanyNameCollection.from(["  ACME  ", "", "ACME", " Beta "]);

    expect(collection.toArray()).toEqual(["ACME", "Beta"]);
  });

  it("can detect empty collection", () => {
    const collection = CompanyNameCollection.from(["   ", ""]);

    expect(collection.isEmpty()).toBe(true);
  });
});
