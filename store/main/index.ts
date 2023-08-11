import { defineStore } from 'pinia';

export const useMainStore = defineStore({
	id: 'main-store',
	state: () => {
		return {
			accessToken: "",
			connectedUser: {},
		}
	},
	actions: {
		setAccessToken(token: string) {
			this.accessToken = token;
		},
		setConnectedUser(obj: object) {
			this.connectedUser = obj;
		},
	},
	getters: {},
	persist: {
		storage: persistedState.localStorage,
	},
})