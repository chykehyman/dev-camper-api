import { Types } from 'mongoose';
import asyncHandler from '../middlewares/asyncHandler';
import BootCampModel from '../models/Bootcamp';
import errorResponse from '../utils/errorResponse';
import geocoder from '../utils/geocoder';

const getAllBootcamps = asyncHandler(async (req, res) => {
  let query;
  const reqQuery = { ...req.query };
  const fieldsToExclude = ['select', 'sort', 'page', 'limit'];
  fieldsToExclude.forEach((field) => delete reqQuery[field]);
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = BootCampModel.find(JSON.parse(queryStr));

  // Select Query
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort Query
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else query = query.sort('-createdAt');

  // Pagination Query
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const pagesToSkip = (page - 1) * limit;
  const pageEndIndex = page * limit;
  const totalAvailableBootcamps = await BootCampModel.countDocuments();

  query = query.skip(pagesToSkip).limit(limit);

  const bootcamps = await query;

  // Pagination Result
  const pagination = {};
  if (pageEndIndex < totalAvailableBootcamps) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (pagesToSkip > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

const getAllBootcampsWithinRadius = asyncHandler(async (req, res) => {
  const { zipcode, distance, radiusMetrics } = req.params;
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi OR 6,378 km
  let radius;
  if (radiusMetrics.toLowerCase() === 'miles') radius = distance / 3963;
  if (radiusMetrics.toLowerCase() === 'km') radius = distance / 6378;
  const bootcamps = await BootCampModel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

const createBootcamp = asyncHandler(async (req, res) => {
  const bootcamp = await BootCampModel.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

const getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return next(errorResponse('Invalid bootcamp ID', 422));
  }
  const bootcamp = await BootCampModel.findById(id);
  if (!bootcamp) {
    return next(errorResponse(`Bootcamp with ID ${id} not found`, 404));
  }
  return res.status(200).json({ success: true, data: bootcamp });
});

const updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return next(errorResponse('Invalid bootcamp ID', 422));
  }
  const bootcamp = await BootCampModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(errorResponse(`Bootcamp with ID ${id} not found`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return next(errorResponse('Invalid bootcamp ID', 422));
  }
  const bootcamp = await BootCampModel.findByIdAndDelete(id);
  if (!bootcamp) {
    return next(errorResponse(`Bootcamp with ID ${id} not found`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

export {
  getAllBootcamps,
  getAllBootcampsWithinRadius,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
