import {ContentType} from "@/utils/constants.js";
import {config} from "@/config.js";
import {useAuthStore} from "../stores/auth";
import {storeToRefs} from "pinia";

let instance = null;

export class XtreamService {

    constructor(url, username, password) {
        this.url = url.replace(/\/$/, ''); // Remove trailing slash
        this.username = username;
        this.password = password;

        // On utilise toujours le proxy configuré
        this.proxyUrl = config.proxyUrl;
    }

    static getInstance() {
        const {credentials} = storeToRefs(useAuthStore())

        if (!credentials.value.url || !credentials.value.username || !credentials.value.password) {
            throw new Error('URL, username and password are required.')
        }
        // Si une instance existe déja, on vérifie si les url/identifiants/pass ont changé pour recreer un nouveau service
        if (instance) {
            const cleanUrl = credentials.value.url.replace(/\/$/, '');
            if (instance.url !== cleanUrl || instance.username !== credentials.value.username || instance.password !== credentials.value.password) {
                instance = null;
            }
        }
        if (!instance) {
            // Création du service
            instance = new XtreamService(credentials.value.url, credentials.value.username, credentials.value.password)
        }
        return instance;
    }

    // Méthode privée pour centraliser les appels à l'API
    async _callApi(params) {
        // On passe toujours par le proxy
        let response = await this._callProxyXtreamApi(params);
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        return response.json();
    }

    _callProxyXtreamApi = async (params) => {
        // Appel via le proxy (POST)
        return await fetch(this.proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                serverUrl: this.url,
                params: {
                    username: this.username,
                    password: this.password,
                    ...params,
                },
            }),
        });
    }

    _isEmpty(data) {
        if (Array.isArray(data)) {
            return data.length === 0;
        }
        if (data && typeof data === 'object') {
            return Object.keys(data).length === 0;
        }
        return false;
    }

    // Appel multiple car Xtream renvoi parfois des reponses 200 vide
    _secureCallApi = async (params) => {
        let result = await this._callApi(params);
        if (this._isEmpty(result)) {
            result = await this._callApi(params);
        }
        return result;
    }

    // Méthode privée pour générer l'URL de téléchargement
    _generateDownloadUrl(type, streamId, extension) {
        // On retourne toujours l'URL directe pour le téléchargement
        // Le proxy ne fonctionne pas pour les fichiers à cause des protections IP/WAF
        return `${this.url}/${ContentType.MOVIES === type ? 'movie' : 'series'}/${this.username}/${this.password}/${streamId}.${extension}`;
    }

    async authenticate() {
        const data = await this._callApi({action: ''});
        if (data.user_info && data.user_info.auth === 1) {
            return data;
        }
        throw new Error('Authentication failed');
    }

    async getMovies() {
        let params = {action: 'get_vod_streams'}
        return await this._secureCallApi(params);
    }

    async getSeries() {
        let params = {action: 'get_series'}
        return await this._secureCallApi(params);
    }

    async getSeriesInfo(seriesId) {
        let params = {action: 'get_series_info', series_id: seriesId}
        return await this._secureCallApi(params);
    }

    async getMovieCategories() {
        return this._callApi({action: 'get_vod_categories'});
    }

    async getSeriesCategories() {
        return this._callApi({action: 'get_series_categories'});
    }

    // Génération des URLs de téléchargement
    getMovieDownloadUrl(streamId, extension) {
        return this._generateDownloadUrl(ContentType.MOVIES, streamId, extension);
    }

    getEpisodeDownloadUrl(streamId, extension) {
        return this._generateDownloadUrl(ContentType.SERIES, streamId, extension);
    }
}
