import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/job.model.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected for seeding');

  // Example job data
  const jobs = [
    {
      title: "Frontend Developer",
      description: "Looking for a skilled React developer to work on our platform.",
      budget: 5000,
      deadline: new Date(Date.now() + 7*24*60*60*1000), // 7 days from now
      location: "New York",
      postedBy: "6401f6ef8d9f1a0e5f1b2c34" // Replace with a valid user id from your database
    },
    {
      title: "Backend Developer",
      description: "Experienced Node.js developer needed for building RESTful APIs.",
      budget: 6000,
      deadline: new Date(Date.now() + 10*24*60*60*1000), // 10 days from now
      location: "Remote",
      postedBy: "6401f6ef8d9f1a0e5f1b2c34"
    }
  ];

  // Clear existing jobs and insert sample data
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log('Seeding complete');
  process.exit();
})
.catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
