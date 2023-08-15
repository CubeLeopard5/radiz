<template>
    <div>
        <RadizButton :text="$t('header.login.text')" @onClick="visible = true"/>
        <a-modal v-model:visible="visible" :title="$t('header.login.text') + ': ' + errMessage"
            :style="{ '--bg-error': (error) ? '#FF4D4D' : '#13850a' }" :class="(error) ? 'login-failure' : ''"
            :footer="null">
            <a-form :model="formState" name="normal_login" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-form-item :label="$t('header.login.email.label')" name="email" :rules="[
                    {
                        required: true,
                        message: $t('header.login.email.no-input')
                    },
                    {
                        type: 'email',
                        message: $t('header.login.email.wrong-input')
                    },
                ]">
                    <a-input v-model:value="formState.email">
                        <template #prefix>
                            <MailOutlined/>
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item :label="$t('header.login.password.label')" name="password" :rules="[
                    {
                        required: true,
                        message: $t('header.login.password.no-input')
                    }
                ]">
                    <a-input-password v-model:value="formState.password">
                        <template #prefix>
                            <LockOutlined/>
                        </template>
                    </a-input-password>
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                    <div class="group-button-log-can">
                        <RadizButtonError :text="$t('header.login.buttons.cancel')" @onClick="resetForm"/>
                        <RadizButton :text="$t('header.login.buttons.submit')" @onClick="sendLogin" :disabled="checkInputs()"/>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { useMainStore } from '~/store/main';
import { defineComponent, reactive } from 'vue';
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue';

interface FormState {
    email: string;
    password: string;
};

export default defineComponent({
    components: {
        MailOutlined,
        LockOutlined,
    },
    setup() {
        const request = useRequest();
        const router = useRouter();
        const store = useMainStore();
        const formState = reactive<FormState>({
            email: '',
            password: '',
        });
        const visible = ref<boolean>(false);
        let error = ref<boolean>(false);
        let errMessage = ref<string>('');

        const sendLogin = async() => {
            const response = await request.login(formState.password, formState.email);
            if (!response.token) {
                errMessage.value = response.response;
                error.value = true;
            } else {
                localStorage.setItem('authToken', response.token);
                store.setConnectedUser(response);
                errMessage.value = '';
                error.value = false;
                visible.value = false;
                resetForm();
                router.push({ path: '/home' });
            }
        };

        const checkInputs = () => {
            if (!formState.email || !formState.password) {
                return true;
            }
            return false;
        };

        const resetForm = () => {
            formState.email = '';
            formState.password = '';
        };

        return {
            formState,
            visible,
            error,
            errMessage,
            sendLogin,
            checkInputs,
            resetForm,
        }
    }
});
</script>

<style>
.ant-modal-header {
    background: var(--bg-error);
    border-bottom: none;
}

.ant-modal-title {
    color: black;
}

.ant-modal-body {
    background: var(--bg);
    padding-bottom: 1px !important
}

.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: var(--color-primary);
}

.ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused {
    border-color: var(--color-primary);
    box-shadow: none;
}

.ant-form-item-label > label {
    color: var(--color);
}

.group-button-log-can {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.login-failure {
	animation-name: shakeError;
	animation-fill-mode: forwards;
	animation-duration: 600ms;
	animation-timing-function: ease-in-out;
}

@keyframes shakeError {
	0% {
		transform: translateX(0); }
	15% {
		transform: translateX(0.375rem); }
	30% {
		transform: translateX(-0.375rem); }
	45% {
		transform: translateX(0.375rem); }
	60% {
		transform: translateX(-0.375rem); }
	75% {
		transform: translateX(0.375rem); }
	90% {
		transform: translateX(-0.375rem); }
	100% {
		transform: translateX(0);
	}
}
</style>