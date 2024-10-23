import { describe, expect, it } from "bun:test";
import {
  DropdownCategoryUpdate,
  NewDropdownCategory,
} from "../../db/schema/public/DropdownCategory";
import { NewDropdownOption } from "../../db/schema/public/DropdownOption";
import {
  createDropdown,
  deleteDropdown,
  getDropdownById,
  getDropdownByLabel,
  getDropdownCategories,
  getDropdownCategoryById,
  getDropdownCategoryByLabel,
  getDropdowns,
  updateDropdown,
} from "../admin-repo";

describe("Admin Repo Functions", () => {
  it("getDropdownCategories should return all categories", async () => {
    const result = await getDropdownCategories();
    expect(result).toBeDefined();
    expect(result!.length).toBeGreaterThan(0);
    expect(result![0]).toHaveProperty("id");
    expect(result![0]).toHaveProperty("label");
    expect(result![0]).toHaveProperty("index");
    expect(result![0].label).toBe("Country");
  });
  it("getDropdownCategoryById should return one category", async () => {
    const result = await getDropdownCategoryById(1);
    expect(result).toBeDefined();
    expect(result!.label).toBe("Country");
  }),
    it("getDropdownCategoryById should return error response for non-existent category", async () => {
      await expect(getDropdownCategoryById(999)).rejects.toThrow();
    }),
    it("getDropdownCategoryByLabel should return one category", async () => {
      const result = await getDropdownCategoryByLabel("Country");
      expect(result).toBeDefined();
      expect(result!.label).toBe("Country");
    }),
    it("getDropdownCategoryByLabel should return error response for non-existent category", async () => {
      await expect(getDropdownCategoryByLabel("Nope")).rejects.toThrow();
    }),
    it("getDropdowns should return all categories with options", async () => {
      const result = await getDropdowns();
      expect(result).toBeDefined();
      expect(result!.length).toBeGreaterThan(0);
      expect(result![0]).toHaveProperty("options");
      expect(result![0].options.length).toBeGreaterThan(0);
    }),
    it("getDropdownById should return one category with options", async () => {
      const result = await getDropdownById(1);
      expect(result).toBeDefined();
      expect(result!.label).toBe("Country");
      expect(result).toHaveProperty("options");
      expect(result!.options.length).toBeGreaterThan(0);
    }),
    it("getDropdownById should return error response for non-existent category", async () => {
      await expect(getDropdownById(999)).rejects.toThrow();
    }),
    it("getDropdownByLabel should return one category with options", async () => {
      const result = await getDropdownByLabel("Country");
      expect(result).toBeDefined();
      expect(result!.label).toBe("Country");
      expect(result).toHaveProperty("options");
      expect(result!.options.length).toBeGreaterThan(0);
    }),
    it("getDropdownByLabel should return error response for non-existent category", async () => {
      await expect(getDropdownByLabel("Nope")).rejects.toThrow();
    }),
    it("createDropdown should create a new category and options", async () => {
      const newCategory: NewDropdownCategory = {
        label: "New Category",
        index: 999,
      };
      const newOptions: Partial<NewDropdownOption>[] = [
        {
          value: "option1",
          label: "Option 1",
          index: 1,
        },
        {
          value: "option2",
          label: "Option 2",
          index: 2,
        },
      ];
      const result = await createDropdown(newCategory, newOptions);
      expect(result).toBeDefined();
      expect(result!.label).toBe(newCategory.label);
      expect(result!.index).toBe(newCategory.index);
      expect(result!.options.length).toBe(newOptions.length);
      await deleteDropdown(result!.id);
    }),
    it("updateDropdown should update an existing category and options", async () => {
      const newCategory: NewDropdownCategory = {
        label: "New Category",
        index: 999,
      };
      const newOptions: Partial<NewDropdownOption>[] = [
        {
          value: "option1",
          label: "Option 1",
          index: 1,
        },
        {
          value: "option2",
          label: "Option 2",
          index: 2,
        },
      ];
      const created = await createDropdown(newCategory, newOptions);
      expect(created).toBeDefined();
      const updatedCategory: DropdownCategoryUpdate = {
        label: "Updated Category",
        index: 999,
      };
      const updatedOptions: Partial<NewDropdownOption>[] = [
        {
          value: "updatedOption1",
          label: "Updated Option 1",
          index: 1,
        },
      ];
      const result = await updateDropdown(
        created!.id,
        updatedCategory,
        updatedOptions
      );
      expect(result).toBeDefined();
      expect(result!.label).toBe(updatedCategory.label);
      expect(result!.index).toBe(updatedCategory.index);
      expect(result!.options.length).toBe(updatedOptions.length);
      expect(result!.options[0].value).toBe(updatedOptions[0].value);
      expect(result!.options[0].label).toBe(updatedOptions[0].label);
      expect(result!.options[0].index).toBe(updatedOptions[0].index);
      await deleteDropdown(result!.id);
    }),
    it("deleteDropdown should delete an existing category and options", async () => {
      const newCategory: NewDropdownCategory = {
        label: "New Category",
        index: 999,
      };
      const newOptions: Partial<NewDropdownOption>[] = [
        {
          value: "option1",
          label: "Option 1",
          index: 1,
        },
        {
          value: "option2",
          label: "Option 2",
          index: 2,
        },
      ];
      const created = await createDropdown(newCategory, newOptions);
      expect(created).toBeDefined();
      const result = await deleteDropdown(created!.id);
      expect(result).toBeDefined();
      await expect(getDropdownById(result.id)).rejects.toThrow();
    });
});
