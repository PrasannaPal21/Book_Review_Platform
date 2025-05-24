require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/book_review_platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      family: 4 // Use IPv4, skip trying IPv6
    });

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'connection' });
    console.log('Test document inserted successfully');
    
    // Clean up test document
    await testCollection.deleteOne({ test: 'connection' });
    console.log('Test document removed');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('Connection Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

testConnection(); 