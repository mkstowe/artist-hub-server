import { describe, it, expect, mock } from "bun:test";
import { getDropdownCategories } from "../admin-repo";
import { db } from "../../db"; // Assuming this is your Kysely instance

describe("Admin Repo Functions", () => {
  it("getDropdownCategories should return categories", async () => {
    const mockCategories = { statusCode: 200, body: JSON.stringify({label: "Category 1" })};

    // Manually mock the selectFrom method of the Kysely db instance
    db.selectFrom = () => ({
      selectAll: () => ({
        execute: () => Promise.resolve(mockCategories),
      }),
    });

    const result = await getDropdownCategories();
    expect(result).toEqual(mockCategories);

    // Optionally, verify the mock was called
    // (you can log it or manually track calls)
    console.log("selectFrom called");
  });
});