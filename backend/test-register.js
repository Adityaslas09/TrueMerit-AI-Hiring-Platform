const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb+srv://aditya111311_db_user:gi2WukNsjjFFNKR9@cluster0.v9i6kig.mongodb.net/truemerit?appName=Cluster0');
  try {
    await User.create({ name: 'test', email: 'test_curl@test.com', password: 'password123', role: 'student' });
    console.log("Success");
  } catch (e) {
    console.error("Error thrown:", e);
    console.error(e.stack);
  }
  process.exit();
}

test();
