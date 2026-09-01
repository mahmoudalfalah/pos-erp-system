import 'server-only';

import { db } from '@/lib/db';
import { fail, ok, Result } from '@/types/result.type';
import { auth } from '@/auth';

import type { AuthorizedUser } from '../types/auth.types';
import type { Role } from '../types/role.types';

export const authorizeAction = async (
    allowedRoles: readonly Role[],
): Promise<Result<AuthorizedUser>> => {
    const session = await auth();
    if (!session?.user?.id) {
        return fail({
            code: 'AUTH_UNAUTHENTICATED',
            message: 'User is not authenticated.',
        });
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            role: true,
            isActive: true,
        },
    });

    if (!user) {
        return fail({
            code: 'AUTH_UNAUTHENTICATED',
            message: 'Session Invalid',
        });
    }

    if (!user.isActive) {
        return fail({
            code: 'ACCOUNT_DISABLED',
            message: 'User account is disabled.',
        });
    }

    if (!allowedRoles.includes(user.role)) {
        return fail({
            code: 'AUTH_FORBIDDEN',
            message: 'User does not have permission to perform this action.',
        });
    }

    return ok({
        id: user.id,
        role: user.role,
    });
};
