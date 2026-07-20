import { mockPrisma } from "@/tests/mocks/db";
import { Prisma } from "@/generated/prisma";
import { createCategory } from "./category.service";

describe("Category Service: createCategory", () => {
    it("should successfully create a category and return an ok result", async () => {
        const input = {
            name: "Electronics",
            slug: "electronics",
            description: "All kinds of electronic items",
            isActive: true,
        };

        const fakeDbResponse = {
            id: "22",
            name: input.name,
            slug: input.slug,
            description: input.description,
            isActive: input.isActive,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        }

        mockPrisma.category.create.mockResolvedValue(fakeDbResponse);

        const result = await createCategory(input);

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toMatchObject({
                id: fakeDbResponse.id,
                name: input.name,
                slug: input.slug,
                description: input.description,
                isActive: input.isActive,
            });
            expect(result.data).toHaveProperty("createdAt");
        }
    });

    it("should return a domain error if the category name already exists", async () => {
        const input = {
            name: "Duplicate Name",
            slug: "new-slug",
            description: "This is a duplicate category",
            isActive: true,
        }

        const prismaError = new Prisma.PrismaClientKnownRequestError(
            "Unique constraint failed on the fields: (`name`)",
            { code: "P2002", clientVersion: "5.x", meta: { target: ["name"] } }
        );
        mockPrisma.category.create.mockRejectedValue(prismaError);

        const result = await createCategory(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error).toMatchObject({
                code: "CATEGORY_ALREADY_EXISTS",
                fields: {
                    name: expect.arrayContaining([expect.stringContaining(input.name)]),
                }
            });
        }
    });

    it("should return a domain error if the category slug already exists", async () => {
        const input = {
            name: "New Name",
            slug: "duplicate-slug",
            description: "This is a duplicate category",
            isActive: true,
        };
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            "Unique constraint failed on the fields: (`slug`)",
            { code: "P2002", clientVersion: "5.x", meta: { target: ["slug"] } }
        );
        mockPrisma.category.create.mockRejectedValue(prismaError);

        const result = await createCategory(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error).toMatchObject({
                code: "CATEGORY_ALREADY_EXISTS",
                fields: {
                    slug: expect.arrayContaining([expect.stringContaining(input.slug)])
                }
            });
        }
    });

    it("should return an UNEXPECTED error for generic database errors", async () => {
        const input = {
            name: "Duplicate Name",
            slug: "duplicate-slug",
            description: "This is a duplicate category",
            isActive: true,
        };


        const genericError = new Error("Database connection lost");
        mockPrisma.category.create.mockRejectedValue(genericError);

        const result = await createCategory(input);

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error).toMatchObject({
                code: "UNEXPECTED",
                message: "An unexpected error occurred while creating the category"
            });
        }
    });
});
