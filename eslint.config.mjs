import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default tseslint.config(
    { ignores: ['node_modules', 'dist', 'generated'] },
    {
        extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.ts'],
        plugins: {
            'simple-import-sort': simpleImportSort,
            'prettier': prettier,
        },
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    printWidth: 80,
                    tabWidth: 4,
                    singleQuote: true,
                    trailingComma: 'all',
                    arrowParens: 'always',
                    semi: false,
                },
            ],
        }
    }
)
