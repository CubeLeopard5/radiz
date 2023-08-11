export default defineNuxtConfig({
    plugins:['@/plugins/antd', '@/plugins/i18n'],
    modules: [
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
    ],
    runtimeConfig: {
		public: {
			baseUrl: process.env.BACKEND_ADDR || 'http://localhost:8000',
		}
	},
})
