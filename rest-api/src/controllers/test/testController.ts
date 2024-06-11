import { Request, Response, NextFunction } from 'express';
import * as testService from '../../services/test/testService';
import Logger from '../../lib/logger';

export async function getAllTests(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await testService.getAllTests();
        res.json({ data });
    } catch (error: unknown) {
        Logger.error('Error while getting tests ', (error as Error).message);
        next(error as Error);
    }
}

export async function getTestById(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await testService.getTestById(req);
        res.json({ data });
    } catch (error: unknown) {
        Logger.error('Error while getting test by id ', (error as Error).message);
        next(error as Error);
    }
}

export async function createTest(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await testService.createTest(req);
        res.json({ data });
    } catch (error: unknown) {
        Logger.error('Error while creating test ', (error as Error).message);
        next(error as Error);
    }
}

export async function updateTest(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await testService.updateTest(req);
        res.json({ data });
    } catch (error: unknown) {
        Logger.error('Error while updating test ', (error as Error).message);
        next(error as Error);
    }
}

export async function deleteTest(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await testService.deleteTest(req);
        res.json({ data });
    } catch (error: unknown) {
        Logger.error('Error while deleting test ', (error as Error).message);
        next(error as Error);
    }
}