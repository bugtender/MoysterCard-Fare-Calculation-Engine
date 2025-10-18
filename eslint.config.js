import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
	{
		ignores: [
			'node_modules',
			'dist',
			'build',
		],
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: parserTs,
		},
		plugins: {
			'@typescript-eslint': eslintPluginTs,
			'prettier': prettier,
		},
		rules: {
			...eslintPluginTs.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': ['warn'],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'prettier/prettier': ['error', { 
				singleQuote: true, 
				semi: true,
				trailingComma: 'es5',
				printWidth: 100,
				tabWidth: 2,
        bracketSameLine: true,
			}],
		},
	},
];