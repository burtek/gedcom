// @ts-check
import { prepareConfig } from '@dtrw/eslint-config/configs/index.js';
import { defineFlatConfig } from 'eslint-define-config';


export default defineFlatConfig([
    ...await prepareConfig({
        json: {},
        react: {}
    }),
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: { JSX: 'readonly' },
            parserOptions: { project: 'tsconfig.json' }
        },
        settings: { 'import/resolver': { typescript: true } }
    },
    {
        files: ['vite.config.ts'],
        languageOptions: { parserOptions: { project: 'tsconfig.node.json' } },
        settings: {
            'import/resolver': {
                typescript: true,
                node: true
            },
            'node': { version: '18' }
        }
    },
    {
        rules: {
            'quote-props': ['error', 'as-needed', { unnecessary: false }],
            '@typescript-eslint/no-magic-numbers': 'off'
        }
    }
]);
