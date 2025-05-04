/*
 * Run this script to create an admin user in Supabase Auth
 * Example usage: node scripts/create-admin-user.js admin@example.com securePassword123
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

// Check if URL and service key are available
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or Service Role Key is missing.');
  console.error('Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY in your .env.local file.');
  process.exit(1);
}

// Create Supabase admin client (with service role key)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  // Get email and password from command line arguments
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Error: Email and password are required.');
    console.error('Usage: node scripts/create-admin-user.js admin@example.com securePassword123');
    process.exit(1);
  }

  try {
    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' },
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      process.exit(1);
    }

    console.log('Admin user created successfully:');
    console.log(`Email: ${data.user.email}`);
    console.log(`User ID: ${data.user.id}`);
    console.log(`Role: ${data.user.user_metadata.role}`);
  } catch (error) {
    console.error('Unexpected error:', error.message);
    process.exit(1);
  }
}

createAdmin(); 