const BASE_URL = 'localhost:2004/api/events';

class Api {
    constructor() {
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    async get(url) {
        try {
            const response = await fetch(`${BASE_URL}/${url}`, {
                method: 'GET',
                headers: this.headers
            });
            const responseJson = await response.json();
            console.log(`Response coletado para GET ${url}: `, responseJson);
            return responseJson;
        } catch (error) {
            console.log(`Erro ao realizar requisição GET para a URL: ${url}, error: `, error);
            return null;
        }
    }

    async post(url, body) {
        try {
            const response = await fetch(`${BASE_URL}/${url}`, {
                method: 'POST',
                headers: this.headers,
                body
            });
            const responseJson = await response.json();
            console.log(`Response coletado para POST ${url}: `, responseJson);
            return responseJson;
        } catch (error) {
            console.log(`Erro ao realizar requisição POST para a URL: ${url}, e com body ${JSON.stringify(body)} error: `, error);
            return null;
        }
    }

    async put(url, body) {
        try {
            const response = await fetch(`${BASE_URL}/${url}`, {
                method: 'PUT',
                headers: this.headers,
                body
            });
            const responseJson = await response.json();
            console.log(`Response coletado para PUT ${url}: `, responseJson);
            return responseJson;
        } catch (error) {
            console.log(`Erro ao realizar requisição PUT para a URL: ${url}, e com body ${JSON.stringify(body)} error: `, error);
            return null;
        }
    }

    async delete(url) {
        try {
            const response = await fetch(`${BASE_URL}/${url}`, {
                method: 'DELETE',
                headers: this.headers
            });
            const responseJson = await response.json();
            console.log(`Response coletado para DELETE ${url}: `, responseJson);
            return responseJson;
        } catch (error) {
            console.log(`Erro ao realizar requisição DELETE para a URL: ${url}, error: `, error);
            return null;
        }
    }
}