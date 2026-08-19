import { listCategories } from '@/features/category/queries/category-listing.query';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ?? 1;
    const perPage = searchParams.get('perPage') ?? 10;
    const result = await listCategories({
        page,
        perPage,
    });
    if (!result.success) {
        return Response.json(result, { status: 500 });
    }
    return Response.json(result);
}
