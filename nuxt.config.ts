export default defineNuxtConfig({
    plugins:['@/plugins/antd', '@/plugins/i18n'],
    modules: [
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
    ],
})
