import { loadTranslations } from '$lib/translations';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, data }) => {
	const { pathname } = url;

	const initLocale = navigator.language.split('-')[0];

	await loadTranslations(initLocale, pathname);

	return {
		username: data?.username,
		role: data?.role
	};
}