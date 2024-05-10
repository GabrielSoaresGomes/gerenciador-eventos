class EnvironmentValidation {
    constructor() {
        this.DEFAULT_POST = 2004;
        this.envVars = Object.freeze({
            DATABASE_NAME: process.env.DATABASE_NAME,
            DATABASE_USER: process.env.DATABASE_USER,
            DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
            DATABASE_HOST: process.env.DATABASE_HOST,
            DATABASE_PORT: process.env.DATABASE_PORT,
            DATABASE_CONNECTION_LIMIT: process.env.DATABASE_CONNECTION_LIMIT,
            // JWT_KEY: process.env.JWT_KEY,
            PORT: process.env.PORT || this.DEFAULT_POST
        });
        this.#validateEnv();
        console.log('.env foi carregado com sucesso:  ', this.envVars);
    }

    #validateEnv() {
        for (const key of Object.keys(this.envVars)) {
            if (this.envVars[key] === undefined) {
                throw new Error(`Variável ${key} está faltando no .env! Verifique o arquivo ${__filename} para saber quais variáveis o componente precisa!`);
            }
        }
    }

    getVar(varName) {
        return this.envVars[varName];
    }
}

module.exports = new EnvironmentValidation();