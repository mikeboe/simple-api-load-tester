import postgresDb from "../../db/postgresDb";
import { Request } from "express";
import { newId } from "../../lib/newId";
import Logger from "../../lib/logger";

async function getAllTests() {
    const result = await postgresDb.query('SELECT * FROM tests');
    return result.rows;
}

async function getTestById(req: Request) {
    const result = await postgresDb.query('SELECT * FROM tests WHERE id = $1', [req.params.id]);
    Logger.info('Test:', result.rows[0]);
    return result.rows[0];
}

async function createTest(req: Request) {
    const id = newId('tst_');
    const result = await postgresDb.query('INSERT INTO tests (id, test_name, base_url, duration, rps, use_statistical_distribution, headers, endpoints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [id, req.body.config.test_name, req.body.config.baseUrl, req.body.config.durationInSeconds, req.body.config.requestsPerSecond, req.body.config.useStatisticalDistribution, JSON.stringify(req.body.headers), JSON.stringify(req.body.endpoints)]);
    return result.rows[0];
}

async function updateTest(req: Request) {
    const result = await postgresDb.query('UPDATE tests SET name = $1, config = $2 WHERE id = $3 RETURNING *', [req.body.name, req.body.config, req.params.id]);
    return result.rows[0];
}

async function deleteTest(req: Request) {
    const result = await postgresDb.query('DELETE FROM tests WHERE id = $1', [req.params.id]);
    return result.rows[0];
}

export {
    getAllTests,
    getTestById,
    createTest,
    updateTest,
    deleteTest
}