import fs from 'fs';
import 'colors';

import connectDB from './db.config';
import BootcampModel from './models/Bootcamp';

connectDB();

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await BootcampModel.create(bootcamps);
    console.log('Data Imported...'.green.inverse);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

// Delete data
const deleteData = async () => {
  try {
    await BootcampModel.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

const commandLineArg = JSON.parse(process.env.npm_config_argv).original[2];

if (commandLineArg === '-i') {
  importData();
} else if (commandLineArg === '-d') {
  deleteData();
}
