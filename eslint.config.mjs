import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import eslintImport from 'eslint-plugin-import'

import globals from 'globals'

export default tseslint.config(
    { ignores: ['node_modules', 'dist', 'generated'] },
    {
        extends: [...tseslint.configs.recommendedTypeChecked, eslint.configs.recommended],
        files: ['**/*.ts'],
        plugins: {
            'simple-import-sort': simpleImportSort,
            'prettier': prettier,
            'unused-imports': unusedImports,
            'eslint-plugin-import': eslintImport,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            parser: tseslint.parser,
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.node
            }
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
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'no-duplicate-imports': ["error", { "includeExports": true }],
            'eslint-plugin-import/no-duplicates': 'error',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/unbound-method': 'off',
        },
    }
)
