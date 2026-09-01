/**
 * @type {import('prettier').Config &
 * import('prettier-plugin-tailwindcss').PluginOptions &
 * import('@ianvs/prettier-plugin-sort-imports').PluginConfig}
 */
export default {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    jsxSingleQuote: false,
    printWidth: 100,
    tabWidth: 4,
    endOfLine: 'lf',
    plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
    importOrder: [
        '^(react/(.*)$)|^(react$)',
        '^(next/(.*)$)|^(next$)',
        '<THIRD_PARTY_MODULES>',

        '',

        '^@/generated/(.*)$',
        '^@/features/(.*)$',
        '^@/components/(.*)$',
        '^@/hooks/(.*)$',
        '^@/lib/(.*)$',
        '^@/utils/(.*)$',
        '^@/validators/(.*)$',
        '^@/types/(.*)$',
        '^@/tests/(.*)$',
        '^@/app/(.*)$',
        '^@/(.*)$',

        '',

        '^[./]',
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    importOrderTypeScriptVersion: '5.0.0',
    tailwindStylesheet: './src/app/globals.css',
    tailwindFunctions: ['clsx', 'cva', 'cn'],
};
