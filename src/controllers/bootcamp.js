import { Types } from 'mongoose';
import asyncHandler from '../middlewares/asyncHandler';
import BootCampModel from '../models/Bootcamp';
import errorResponse from '../utils/errorResponse';

const getAllBootcamps = asyncHandler(async (req, res) => {
  const bootcamps = await BootCampModel.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
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
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
