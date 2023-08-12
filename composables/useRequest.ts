import { useMainStore } from '~/store/main';

interface RequestObject {
    accessToken?: boolean;
	endpoint: string,
	method: string,
	body?: string,
}

export const useRequest = () => {
    const store = useMainStore();

    const sendRequestToServer = (obj: RequestObject) => {
        const url = useRuntimeConfig().public.baseUrl;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': (obj.accessToken) ? store.accessToken : '',
        }
    
        return fetch(`${url}/${obj.endpoint}`, {
            method: obj.method,
            headers: headers,
            body: obj.body,
        }).then(response => response.json());
    };

    const login = async(password: string, email: string) => {
        const response = await sendRequestToServer({
            method: "POST",
            endpoint: `login`,
            body: JSON.stringify({
                password,
                email,
            })
        });
        if (response.token) {
            store.setAccessToken(response.token);
        }
        return response;
    };

    const register = async(username: string, password: string, email: string) => {
        const response = await sendRequestToServer({
            method: "POST",
            endpoint: `register`,
            body: JSON.stringify({
                username,
                password,
                email,
            })
        });
        if (response.token) {
            store.setAccessToken(response.token);
        }
        return response;
    };

    return {
        sendRequestToServer,
        login,
        register,
    }
};