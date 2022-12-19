import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

describe('Login', () => {
    it('accepts login', () => {
        const wrapper = mount(App)
        await wrapper.find("#username").setValue("test_username")
    })
})
