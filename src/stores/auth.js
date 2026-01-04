import {defineStore} from 'pinia'
import {ref} from 'vue'
import {XtreamService} from '../services/xtream'

export const useAuthStore = defineStore('auth', () => {
    // --- STATE ---
    const isAuthenticated = ref(false)
    const credentials = ref({
        url: '',
        username: '',
        password: ''
    })

    // Action principale de connexion
    const login = async () => {
        if (!credentials.value.url || !credentials.value.username || !credentials.value.password) {
            throw new Error('URL, username and password are required.')
        }

        // Création du service et authentification
        const service = XtreamService.create(credentials.value.url, credentials.value.username, credentials.value.password)
        await service.authenticate()

        // Si succès, on met à jour l'état
        isAuthenticated.value = true
    }

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
        login: login,
        logout: logout,
        resetCredentials: resetCredentials
    }
}, {
    persist: {
        // On ne persiste que l'URL. Le reste est géré par le navigateur (autocomplete) ou la session mémoire.
        paths: ['credentials.url'],
    },
})
