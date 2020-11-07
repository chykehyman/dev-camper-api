import express from 'express';
import {
  getAllBootcamps,
  getAllBootcampsWithinRadius,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from '../controllers/bootcamp';

const router = express.Router();

router.route('/').get(getAllBootcamps).post(createBootcamp);
router
  .route('/radius/:zipcode/:distance/:radiusMetrics')
  .get(getAllBootcampsWithinRadius);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
