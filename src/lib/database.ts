import pkg from 'pg';
const { Pool } = pkg;

// Database connection configuration
const pool = new Pool({
  host: import.meta.env.VITE_DB_HOST || 'asgqcks08k8cosssk0kcwvk4',
  port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
  database: import.meta.env.VITE_DB_NAME || 'postgres',
  user: import.meta.env.VITE_DB_USER || 'quickjob',
  password: import.meta.env.VITE_DB_PASSWORD || 'Pinokio590@@',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Execute query
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Get a client from the pool
export const getClient = async () => {
  return await pool.connect();
};

export default pool;