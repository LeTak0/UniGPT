import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
	fallbackLocale: 'en',
	loaders: [
		{
			locale: 'de',
			key: 'common',
			loader: async () => (
				await import('./translations/de/common.json')
			).default,
		},
		{
			locale: 'de',
			key: 'chat',
			loader: async () => (
				await import('./translations/de/chat.json')
			).default,
		},
		{
			locale: 'en',
			key: 'common',
			loader: async () => (
				await import('./translations/en/common.json')
			).default,
		},
		{
			locale: 'en',
			key: 'chat',
			loader: async () => (
				await import('./translations/en/chat.json')
			).default,
		},
		{
			locale: 'de',
			key: 'error',
			loader: async () => (
				await import('./translations/de/error.json')
			).default,
		},
		{
			locale: 'en',
			key: 'error',
			loader: async () => (
				await import('./translations/en/error.json')
			).default,
		},
		{
			locale: 'de',
			key: 'manage',
			loader: async () => (
				await import('./translations/de/manage.json')
			).default,
		},
		{
			locale: 'en',
			key: 'manage',
			loader: async () => (
				await import('./translations/en/manage.json')
			).default,
		}
	],
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);