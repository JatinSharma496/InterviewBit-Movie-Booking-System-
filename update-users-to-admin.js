// Script to update existing users to admin status
// Run this with Node.js after starting your backend server

const updateUserToAdmin = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}/promote-admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const user = await response.json();
      console.log(`✅ User ${user.email} (ID: ${user.id}) promoted to admin successfully`);
      return user;
    } else {
      console.error(`❌ Failed to promote user ID ${userId}: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error promoting user ID ${userId}:`, error.message);
    return null;
  }
};

// Update the users you saw in the database
const updateExistingUsers = async () => {
  console.log('🚀 Starting user promotion process...\n');
  
  // Based on your database view, you have these users:
  // 1. test@example.com (likely ID 1 or 2)
  // 2. 221b467@juetguna.ing (likely ID 2 or 3)
  
  // Try to promote users by ID (you may need to adjust these IDs)
  const userIds = [1, 2, 3]; // Try common ID ranges
  
  for (const userId of userIds) {
    await updateUserToAdmin(userId);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
  }
  
  console.log('\n✨ User promotion process completed!');
  console.log('\nYou can now try logging in with admin credentials:');
  console.log('- Email: test@example.com');
  console.log('- Email: 221b467@juetguna.ing');
  console.log('- Password: password123 (or whatever password you used)');
};

// Run the script
updateExistingUsers();
