import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		csrf: false,		//should be enabled, but is currently disabled for demonstration purposes
	},
};

export default config;
