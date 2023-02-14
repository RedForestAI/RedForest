// Third-party Imports
import axios from 'axios';
import mitt from 'mitt'

// Internal Imports
import { useConfigurationStore } from '@/store/ConfigurationStore'

// Create a new emitter
const emitter = mitt<any>()

// Add a default listening to all events to send to Server-side
emitter.on('*', (type, e) => {

    // Only send payload if user logged in
    const configurationStore = useConfigurationStore()
    if (!configurationStore.loggedIn) {
        return
    }

    // Create payload
    const formData = new FormData()
    const d = new Date()
    formData.append('username', configurationStore.username)
    formData.append('timestamp', d.toISOString())
    formData.append('topic', type.toString())
    formData.append('information', JSON.stringify(e))

    // Send payload
    axios({
        method: 'post',
        url: configurationStore.serverLocation + '/logs',
        data: formData
    }).then((res) => {
        if (res.data.success){
            console.log("Event logged successful: " + type.toString())
        }
        else {
            console.log("Event logged failed: " + type.toString())
        }
    }).catch((error) => {
        alert("Server not detected - data loss:" + error.data)
    })
})

// Provide the emitter
export default emitter
