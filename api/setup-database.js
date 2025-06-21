const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_HOST?.includes('rds.amazonaws.com') ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`User: ${process.env.DB_USER}`);
    
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    
    console.log('✅ Database connection successful!');
    console.log('📊 PostgreSQL version:', result.rows[0].version);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.code === '28P01') {
      console.error('💡 Check your database password in the .env file');
    } else if (error.code === 'ENOTFOUND') {
      console.error('💡 Check your database host/endpoint');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Database server might be down or not accepting connections');
    }
    
    return false;
  }
}

async function createSchema() {
  try {
    console.log('📋 Creating database schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'docs', 'database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Schema creation failed:', error.message);
    
    // Check if tables already exist
    if (error.message.includes('already exists')) {
      console.log('💡 Some tables already exist - this is normal');
      return true;
    }
    
    return false;
  }
}

async function seedTestData() {
  try {
    console.log('🌱 Adding test tenant data...');
    
    // Check if demo tenant already exists
    const existingTenant = await pool.query('SELECT id FROM tenants WHERE id = $1', ['bluepineai-test-tenant']);
    
    if (existingTenant.rows.length === 0) {
      // Insert test tenant that matches your domain
      await pool.query(`
        INSERT INTO tenants (id, name, plan, status, allowed_email_domains) 
        VALUES ($1, $2, $3, $4, $5)
      `, [
        'bluepineai-test-tenant',
        'Blue Pine AI Test Organization', 
        'pro', 
        'active',
        ['bluepineai.com', 'gmail.com'] // Allow your domains
      ]);
      
      console.log('✅ Test tenant created: bluepineai-test-tenant');
    } else {
      console.log('💡 Test tenant already exists');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test data seeding failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up Blue Pine AI Database\n');
  
  // Test connection
  const connectionSuccess = await testConnection();
  if (!connectionSuccess) {
    console.log('\n❌ Setup failed. Please check your database configuration.');
    process.exit(1);
  }
  
  console.log('');
  
  // Create schema
  const schemaSuccess = await createSchema();
  if (!schemaSuccess) {
    console.log('\n❌ Schema creation failed.');
    process.exit(1);
  }
  
  console.log('');
  
  // Seed test data
  const seedSuccess = await seedTestData();
  if (!seedSuccess) {
    console.log('\n⚠️  Test data seeding failed, but database is ready.');
  }
  
  console.log('\n🎉 Database setup complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Start the API server: npm start');
  console.log('2. Test PointClickCare integration with your credentials');
  console.log('3. Visit http://localhost:8084/signin to test login');
  
  await pool.end();
}

main().catch(console.error); 