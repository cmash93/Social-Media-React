import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/client', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export default mongoose.connection;