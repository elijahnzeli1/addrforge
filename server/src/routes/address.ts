import express from 'express';
import { body } from 'express-validator';
import { auth as authenticate } from '../middleware/auth';
import { addressController } from '../controllers/address';

const router = express.Router();

router.use(authenticate);

router.post('/', [
  body('street').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('postalCode').trim().notEmpty(),
  body('country').trim().notEmpty(),
], addressController.createAddress);

router.get('/', addressController.getAddresses);

router.put('/:id', [
  body('street').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('state').optional().trim().notEmpty(),
  body('postalCode').optional().trim().notEmpty(),
  body('country').optional().trim().notEmpty(),
], addressController.updateAddress);

router.delete('/:id', addressController.deleteAddress);

export default router;
