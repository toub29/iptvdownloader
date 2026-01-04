import {defineStore} from 'pinia'
import {ref} from 'vue'
import {encryptStorage} from '../utils/encryption'

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false)
    const credentials = ref({
        url: '',
        username: '',
        password: ''
    })

    // Action de déconnexion
    const resetCredentials = () => {
        // On vide les credentials sensibles lors de la déconnexion, mais on garde l'URL
        credentials.value.username = ''
        credentials.value.password = ''
    }

    const logout = () => {
        isAuthenticated.value = false
        resetCredentials()
    }

    return {
        isAuthenticated: isAuthenticated,
        credentials: credentials,
        logout: logout,
        resetCredentials: resetCredentials
    }
}, {
    persist: {
        // On persiste tout l'état nécessaire pour survivre au F5
        paths: ['credentials', 'isAuthenticated'],
        storage: encryptStorage,
    },
})
