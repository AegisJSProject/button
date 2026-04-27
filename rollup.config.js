import terser from '@rollup/plugin-terser';

const external = ['@aegisjsproject/styles/reset.js', '@aegisjsproject/styles/layers.js', '@aegisjsproject/styles/custom-button.js'];

export default [{
	input: 'button.js',
	external,
	output: [{
		file: 'button.cjs',
		format: 'cjs',
	}, {
		file: 'button.min.js',
		format: 'module',
		plugins: [terser()],
		sourcemap: true,
	}],
}];
