<template>
    <div>
        <a-button @click="visible = true">
            <span> Login </span>
        </a-button>
        <a-modal v-model:visible="visible" :title="'Login' + ': ' + errMessage" @ok="handleOk"
            :style="{ '--bg-error': (error) ? '#FF4D4D' : '#13850a' }" :class="(error) ? 'login-failure' : ''"
            :footer="null">
            <a-form :model="formState" name="normal_login" class="login-form">
                <a-form-item :label="'Email'" name="email" :rules="[
                    {
                        required: true,
                        message: 'aa'
                    },
                    {
                        type: 'email',
                        message: 'email'
                    },
                ]">
                    <a-input v-model:value="formState.email">
                        <template #prefix>
                            <UserOutlined/>
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item :label="'Password'" name="password" :rules="[{ required: true, message: 'ee' }]">
                    <a-input-password v-model:value="formState.password" v-on:keyup.enter="handleOk">
                        <template #prefix>
                            <LockOutlined/>
                        </template>
                    </a-input-password>
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button type="primary" html-type="submit" @click="handleOk">Submit</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

interface FormState {
    email: string;
    password: string;
};

export default defineComponent({
    components: {
        UserOutlined,
        LockOutlined,
    },
    setup() {
        const request = useRequest();
        const formState = reactive<FormState>({
            email: '',
            password: '',
        });
        const visible = ref<boolean>(false);
        let error = ref<boolean>(false);
        let errMessage = ref<string>('');

        const handleOk = async() => {
            const response = await request.login(formState.password, formState.email);
            if (!response.token) {
                errMessage.value = response.response;
                error.value = true;
            } else {
                errMessage.value = '';
                error.value = false;
                visible.value = false;
            }
        };

        const checkInputs = () => {
            if (!formState.email || formState.password) {
                return true;
            }
            return false;
        };

        return {
            formState,
            visible,
            error,
            errMessage,
            handleOk,
            checkInputs,
        }
    }
});
</script>

<style>
.ant-modal-header {
    background: var(--bg-error);
}

.ant-modal-title {
    color: var(--color);
}

.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: var(--color-primary);
}

.ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused {
    border-color: var(--color-primary);
    box-shadow: none;
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