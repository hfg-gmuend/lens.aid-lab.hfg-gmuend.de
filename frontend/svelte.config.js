import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html',
			precompress: false,
			strict: false
		}),
		paths: {
			base: dev ? '' : process.env.BASE_PATH || ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for manifest.json since we don't have a PWA manifest yet
				if (path === '/manifest.json') {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
