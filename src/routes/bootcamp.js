import express from 'express';
import {
  getAllBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from '../controllers/bootcamp';

const router = express.Router();

router.route('/').get(getAllBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
