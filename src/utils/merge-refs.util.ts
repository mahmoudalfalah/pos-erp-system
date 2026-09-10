import type { Ref, RefObject } from 'react';

export function mergeRefs<T>(...refs: (Ref<T> | RefObject<T> | undefined | null)[]) {
    return (node: T | null) => {
        refs.forEach((ref) => {
            if (!ref) return;
            if (typeof ref === 'function') ref(node);
            else if (typeof ref === 'object' && 'current' in ref) {
                (ref as RefObject<T | null>).current = node;
            }
        });
    };
}
