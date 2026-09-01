/** 
 * @type {import('prettier').Config &
 * import('prettier-plugin-tailwindcss').PluginOptions &
 * import('@ianvs/prettier-plugin-sort-imports').PluginOptions}
 */
export default {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    jsxSingleQuote: false,
    printWidth: 100,
    tabWidth: 4,
    endOfLine: 'lf',
    plugins: [
        '@ianvs/prettier-plugin-sort-imports',
        'prettier-plugin-tailwindcss'
    ],
    importOrder: [
        '^(react/(.*)$)|^(react$)',        
        '^(next/(.*)$)|^(next$)',
        '<THIRD_PARTY_MODULES>',        

        '',

        '^@/types/(.*)$',
        '^@/config/(.*)$',
        '^@/lib/(.*)$', 
        '^@/hooks/(.*)$',    
        '^@/components/(.*)$',
        '^@/app/(.*)$',
        '^@/styles/(.*)$',

        '',
        
        '^[./]',
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    importOrderTypeScriptVersion: "5.0.0",
    tailwindStylesheet: './src/app/globals.css',
    tailwindFunctions: ['clsx', 'cva', 'cn']
};
