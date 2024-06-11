import express from 'express';
import * as testController from '../../controllers/test/testController';

const router = express.Router();

router.get('/', testController.getAllTests);
router.get('/:id', testController.getTestById);
router.post('/', testController.createTest);
router.put('/:id', testController.updateTest);
router.delete('/:id', testController.deleteTest);

export { router as testRoutes}