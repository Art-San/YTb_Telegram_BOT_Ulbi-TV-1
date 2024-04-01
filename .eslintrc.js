module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['prettier'],
	extends: ['plugin:prettier/recommended'],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'no-console': 1,
		'prettier/prettier': 0,
	},
}

// module.exports = {
// 	env: {
// 		browser: true,
// 		es2021: true,
// 		node: true,
// 	},
// 	extends: [
// 		'eslint:recommended',
// 		'plugin:@typescript-eslint/recommended',
// 		'prettier',
// 	],
// 	parser: '@typescript-eslint/parser',
// 	parserOptions: {
// 		project: 'tsconfig.json',
// 		ecmaVersion: 12,
// 		sourceType: 'module',
// 	},
// 	plugins: ['@typescript-eslint', 'prettier'],
// 	rules: {
// 		// Здесь вы можете добавить свои правила
// 		'prettier/prettier': 'error',
// 	},
// }
