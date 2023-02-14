import { defineStore } from 'pinia'
import emitter from '@/emitter'

type ConfigurationDetails = {
    serverLocation: string
    username: string
    password: string
    loggedIn: boolean
    inNotebook: boolean
    quizHidden: boolean
    zoom: number
}

export const useConfigurationStore = defineStore('configuration', {
    state: () => {
        return {
            serverLocation: '',
            username: '',
            password: '',
            loggedIn: false,
            inNotebook: false,
            quizHidden: true,
            zoom: 1,
            quizButtonEnabled: false
        } as ConfigurationDetails
    },
    actions: {
        recordServer(serverLocation: string){ 
            this.serverLocation = serverLocation
        },
        logIn(username: string, password: string) {
            this.loggedIn = true // Later need to check with database
            this.username = username
            this.password = password

            // Emit the initial state of everything
            emitter.emit('init_storeSnapshot', JSON.stringify(this.$state))
        },
        logOut() {
            this.loggedIn = false
            this.username = ''
            this.password = ''
        },
        toggleQuiz() {
            this.quizHidden = !this.quizHidden
            // Emit the initial state of everything
            emitter.emit('config_quizHidden', JSON.stringify(this.quizHidden))
        },
        zoomIn() {
            if (this.zoom < 2) {
                this.zoom += 0.1
            }
        },
        zoomOut() {
            if (this.zoom > 0.1){
                this.zoom -= 0.1
            }
        }
    }
})
