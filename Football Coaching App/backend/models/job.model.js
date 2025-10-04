import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  location: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  status: { type: String, enum: ['open', 'in progress', 'completed', 'cancelled'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);
