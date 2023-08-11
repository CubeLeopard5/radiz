export default defineNuxtConfig({
    plugins:['@/plugins/antd', '@/plugins/i18n'],
    modules: [
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@vueuse/nuxt',
		'@nuxtjs/color-mode',
    ],
    runtimeConfig: {
		public: {
			baseUrl: process.env.BACKEND_ADDR || 'http://localhost:8000',
		}
	},
})
