import { validateId } from "./id.validator";
import { ok, fail } from "@/types/result.type";

describe("validateId", () => {
    it("accepts a valid string id", () => {
        const validId = "electonics-category";
        const result = validateId(validId);
        expect(result).toStrictEqual(ok(validId));
    });
    it("rejects an invalid id [invalid type]", () => {
        const invalidId = false;
        const result = validateId(invalidId);
        expect(result).toStrictEqual(fail({
            code: "VALIDATION",
            message: "Invalid ID"
        }))
    });
    it("rejects an invalid id [empty string]", () => {
        const invalidId = "";
        const result = validateId(invalidId);
        expect(result).toStrictEqual(fail({
            code: "VALIDATION",
            message: "Invalid ID"
        }))
    });
})