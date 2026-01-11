import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', authenticate, CategoryController.createCategory);
router.put('/:id', authenticate, CategoryController.updateCategory);
router.delete('/:id', authenticate, CategoryController.deleteCategory);

export default router;
