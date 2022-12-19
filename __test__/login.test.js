import { mount } from '@vue/test-utils'
import LoginView from "../src/views/LoginView.vue"

describe('Login', () => {
    test('Access the username input and place value', async () => {
        const wrapper = mount(LoginView)
        const username_input = wrapper.get("#username")
        await username_input.setValue("test_username")
    }),
    test('Entering only 1 and entering', async () => {
        const wrapper = mount(LoginView)
        const username_input = wrapper.get("#username")
        await username_input.setValue("test_username")
    })
})
