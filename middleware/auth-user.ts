import { useMainStore } from '~/store/main';

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            return navigateTo('/');
        }
    }
    return;
});