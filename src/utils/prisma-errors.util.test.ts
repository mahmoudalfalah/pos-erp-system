import { Prisma } from "@/generated/prisma";
import { getPrismaUniqueFields } from "@/utils/prisma-errors.util";

describe("Utility: getPrismaUniqueFields", () => {
    it("should return an array of fields when a P202 error is passed", () => {
        const mockError = new Prisma.PrismaClientKnownRequestError(
            "Duplicate entry",
            {
                code: "P2002",
                clientVersion: "5.X",
                meta: { target: ["slug"] },
            }
        );
        const result = getPrismaUniqueFields(mockError);
        expect(result).toEqual(["slug"]);
    });

    it("should return null if the error is not P2002", () => {
        const mockError = new Prisma.PrismaClientKnownRequestError(
            "Not Found",
            {
                code: "P2025",
                clientVersion: "5.X",
            }
        );

        const result = getPrismaUniqueFields(mockError);
        expect(result).toBeNull();
    });

    it("should return null for non-Prisma errors", () => {
        const standardError = new Error("Network timeout");
        const result = getPrismaUniqueFields(standardError);
        expect(result).toBeNull();
    });
});
