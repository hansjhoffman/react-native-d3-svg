module.exports = {
	env: {
		es6: true,
		jest: true,
		browser: true
	},
	extends: [
		"eslint:recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:react/recommended",
	],
	parser: "babel-eslint",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		}
	},
	rules: {
		"import/extensions": ["error", "never", { json: "always" }],
		"import/first": 2,
		"import/newline-after-import": 2,
		"import/no-duplicates": 2,
		"import/order": [
			"error",
			{
				groups: [
					["builtin", "external"],
					["internal"],
					["parent", "sibling", "index"]
				],
				"newlines-between": "always"
			}
		],
		"react/prop-types": 2
	},
	settings: {
		"import/resolver": {
			node: {
				extensions: [".js", ".jsx"],
				paths: ["./src"]
			}
		},
		react: {
			pragma: "React",
			version: "detect"
		}
	}
}

