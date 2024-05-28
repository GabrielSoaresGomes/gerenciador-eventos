import axios from 'axios';
import * as Network from 'expo-network';

const BASE_URL = 'https://grumpy-monkeys-prove.loca.lt/api/events';

class Api {
    constructor() {
        this.headers = {
            "Content-Type": "application/json"
        };
        this.isConnected = false;
    }

    async verifyConnection() {
        try {
            const connectionResult = await Network.getNetworkStateAsync();
            if (connectionResult?.isConnected && connectionResult.isInternetReachable) {
                this.isConnected = true;
            } else {
                this.isConnected = false;
            }
            console.log('Conexão verificada com sucesso! Conectado: ', this.isConnected);
        } catch (error) {
            console.log('Error ao verificar conexão network: ', error);
            this.isConnected = false;
        }

    }

    async get(url) {
        try {
            await this.verifyConnection();
            if (this.isConnected) {
                const fullUrl = `${BASE_URL}/${url}`;
                console.log(`Mandando requisição GET para: ${fullUrl}`);
                const response = await axios.get(fullUrl);
                console.log(`Response coletado para GET ${url}: `, response.data);
                return response.data;
            }
        } catch (error) {
            console.log(`Erro ao realizar requisição GET para a URL: ${BASE_URL + url}, error: `, error);
            return null;
        }
    }

    async post(url, body) {
        try {
            await this.verifyConnection();
            if (this.isConnected) {
                const fullUrl = `${BASE_URL}/${url}`;
                const response = await axios.post(fullUrl, body, {
                    headers: this.headers
                });
                console.log(`Response coletado para POST ${url}: `, response.data);
                return response.data;
            }
        } catch (error) {
            console.log(`Erro ao realizar requisição POST para a URL: ${BASE_URL + url}, e com body ${JSON.stringify(body)} error: `, error);
            return null;
        }
    }

    async put(url, body) {
        try {
            await this.verifyConnection();
            if (this.isConnected) {
                const fullUrl = `${BASE_URL}/${url}`;
                const response = await axios.put(fullUrl, body, {
                    headers: this.headers
                });
                console.log(`Response coletado para PUT ${url}: `, response.data);
                return response.data;
            }
        } catch (error) {
            console.log(`Erro ao realizar requisição PUT para a URL: ${BASE_URL + url}, e com body ${JSON.stringify(body)} error: `, error);
            return null;
        }
    }

    async delete(url) {
        try {
            await this.verifyConnection();
            if (this.isConnected) {
                const fullUrl = `${BASE_URL}/${url}`;
                const response = await axios.delete(fullUrl, {
                    headers: this.headers
                });
                console.log(`Response coletado para DELETE ${url}: `, response.data);
                return response.data;
            }
        } catch (error) {
            console.log(`Erro ao realizar requisição DELETE para a URL: ${BASE_URL + url}, error: `, error);
            return null;
        }
    }
}

const ApiInstance = new Api();
export default ApiInstance;
