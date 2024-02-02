// @ts-check
import { prepareConfig } from '@dtrw/eslint-config/configs/index.js';
import { defineFlatConfig } from 'eslint-define-config';


export default defineFlatConfig([
    ...await prepareConfig({
        json: true,
        react: true
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
        files: ['src/worker/*'],
        languageOptions: { parserOptions: { project: 'tsconfig.worker.json' } },
        settings: { 'import/resolver': { typescript: true } }
    },
    {
        rules: {
            'quote-props': ['error', 'as-needed', { unnecessary: false }],
            'no-restricted-imports': [
                'error', {
                    paths: [
                        {
                            name: 'react-redux',
                            importNames: ['useSelector', 'useDispatch'],
                            message: 'Use useAppSelector and useAppDispatch instead.'
                        }
                    ]
                }
            ],
            '@typescript-eslint/no-magic-numbers': 'off'
        }
    }
]);
