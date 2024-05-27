const DatabaseConnector = require('./connectors/database-connector');


class EventRepository {
    constructor() {
        this.databaseConnector = new DatabaseConnector();
    }

    // async selectAllCategories (){
    //     const connection = await this.databaseConnector.generateConnection();
    //     const result = await connection.query(`
    //         SELECT *
    //         FROM category
    //         WHERE deleted_at is null
    //     `);
    //     return result?.rows;
    // }
    //
    // async selectCategoryById(categoryId) {
    //     const connection = await this.databaseConnector.generateConnection();
    //     const result = await connection.query(`
    //         SELECT *
    //         FROM category
    //         WHERE id = $1
    //         AND deleted_at is null
    //     `, [categoryId]);
    //     return result?.rows?.[0];
    // }
    //
    // async insertCategory(categoryData, categoryImage) {
    //     const connection = await this.databaseConnector.generateConnection();
    //     const result = await connection.query(`
    //         INSERT INTO category (name, description, image)
    //         VALUES ($1, $2, $3)
    //     `, [categoryData?.name, categoryData?.description, categoryImage]);
    //     return result?.rows;
    // }
    //
    // async updateCategory(categoryId, categoryData, categoryImage){
    //     const connection = await this.databaseConnector.generateConnection();
    //     const result = await connection.query(`
    //         UPDATE category
    //         SET name = $1,
    //         description = $2,
    //         image = $3
    //         WHERE id = $4
    //     `, [categoryData?.name, categoryData?.description, categoryImage, categoryId]);
    //     return result?.rows;
    // }
    //
    // async deleteCategory(categoryId) {
    //     const connection = await this.databaseConnector.generateConnection();
    //     const result = await connection.query(`
    //         UPDATE category
    //         SET deleted_at = now()
    //         WHERE deleted_at is null
    //         AND id = $1
    //         RETURNING id
    //     `, [categoryId]);
    //     return result?.rows?.[0];
    // }
    //
    // async deleteAllExercisesByCategoryId(categoryId) {
    //     const connection = await this.databaseConnector.generateConnection();
    //     await connection.query(`
    //         UPDATE exercise
    //         SET deleted_at = now()
    //         WHERE category_id = $1
    //     `, [categoryId]);
    // }

    async getAllEvents() {
        const connection = await this.databaseConnector.generateConnection();
        const result = await connection.query(`
            SELECT *
            FROM events
        `);
        return result.rows;
    }

    async getEventById(eventId) {
        const connection = await this.databaseConnector.generateConnection();
        const result = await connection.query(`
            SELECT *
            FROM events
            WHERE id = $1
        `, [eventId]);
        return result.rows[0];
    }

    async deleteEventById(eventId) {
        const connection = await this.databaseConnector.generateConnection();
        const result = await connection.query(`
            DELETE FROM events
            WHERE id = $1
            RETURNING id
        `, [eventId]);
        return result?.rows[0]?.id;
    }

    async insertEvent(eventBody) {
        const connection = await this.databaseConnector.generateConnection();
        const result = await connection.query(`
            INSERT INTO events (title, date, time_start, time_end, address, location, description, image)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `, [eventBody.title, eventBody.date, eventBody.time_start, eventBody.time_end, eventBody.address, eventBody.location, eventBody.description, eventBody.image]);
        return result.rows[0]?.id;
    }
}

module.exports = EventRepository;