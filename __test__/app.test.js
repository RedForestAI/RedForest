import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

describe('Login', () => {
    test('Successful login', async () => {
        const wrapper = mount(App)
        const username_input = wrapper.get("#username")
        await username_input.setValue("test_username")
    })
})

