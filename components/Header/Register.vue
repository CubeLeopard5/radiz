<template>
    <div>
        <RadizButton :text="$t('header.register.text')" @onClick="visible = true"/>
        <a-modal v-model:visible="visible" :title="$t('header.register.text') + ': ' + errMessage"
            :style="{ '--bg-error': (error) ? '#FF4D4D' : '#13850a' }" :class="(error) ? 'register-failure' : ''"
            :footer="null">
            <a-form :model="formState" name="normal_register" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-form-item :label="$t('header.register.email.label')" name="email" :rules="[
                    {
                        required: true,
                        message: $t('header.register.email.no-input')
                    },
                    {
                        type: 'email',
                        message: $t('header.register.email.wrong-input')
                    },
                ]">
                    <a-input v-model:value="formState.email">
                        <template #prefix>
                            <MailOutlined/>
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item :label="$t('header.register.username.label')" name="username" :rules="[
                    {
                        required: true,
                        message: $t('header.register.username.no-input')
                    }
                ]">
                    <a-input v-model:value="formState.username">
                        <template #prefix>
                            <UserOutlined/>
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item :label="$t('header.register.password.label')" name="password" :rules="[
                    {
                        required: true,
                        message: $t('header.register.password.no-input')
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
                        <RadizButtonError :text="$t('header.register.buttons.cancel')" @onClick="resetForm"/>
                        <RadizButton :text="$t('header.register.buttons.submit')" @onClick="sendRegister" :disabled="checkInputs()"/>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { useMainStore } from '~/store/main';
import { defineComponent, reactive } from 'vue';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons-vue';

interface FormState {
    email: string;
    username: string;
    password: string;
};

export default defineComponent({
    components: {
        MailOutlined,
        UserOutlined,
        LockOutlined,
    },
    setup() {
        const request = useRequest();
        const router = useRouter();
        const store = useMainStore();
        const formState = reactive<FormState>({
            email: '',
            username: '',
            password: '',
        });
        const visible = ref<boolean>(false);
        let error = ref<boolean>(false);
        let errMessage = ref<string>('');

        const sendRegister = async() => {
            const response = await request.register(formState.username, formState.password, formState.email);
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
            if (!formState.email || !formState.password || !formState.username) {
                return true;
            }
            return false;
        };

        const resetForm = () => {
            formState.username = '',
            formState.email = '';
            formState.password = '';
        };

        return {
            formState,
            visible,
            error,
            errMessage,
            sendRegister,
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

.register-failure {
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