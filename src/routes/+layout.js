import { loadTranslations } from '$lib/translations';

export const ssr = false;

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, data, depends }) => {
	depends('app:session');

	const { pathname } = url;

	const initLocale = navigator.language.split('-')[0];

	await loadTranslations(initLocale, pathname);

	return {
		username: data?.username,
		role: data?.role
	};
}