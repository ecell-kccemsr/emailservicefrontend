const axios = require('axios');

async function testDelete() {
  try {
    // First, login to get a token
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', {
      email: 'admin@kccemsr.edu.in',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('Login successful, token received');

    // Get users
    console.log('Fetching users...');
    const usersResponse = await axios.get('http://localhost:5002/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Found', usersResponse.data.users.length, 'users');
    
    if (usersResponse.data.users.length > 0) {
      const testUser = usersResponse.data.users[0];
      console.log('First user:', testUser.firstName, testUser.lastName, testUser.email);
      
      // Try to delete the user
      console.log('Attempting to delete user with ID:', testUser._id);
      const deleteResponse = await axios.delete(`http://localhost:5002/api/users/${testUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Delete response:', deleteResponse.data);
      console.log('User deleted successfully!');
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testDelete();
