import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = new Pool({
  host: process.env.VITE_DB_HOST || 'asgqcks08k8cosssk0kcwvk4',
  port: parseInt(process.env.VITE_DB_PORT || '5432'),
  database: process.env.VITE_DB_NAME || 'postgres',
  user: process.env.VITE_DB_USER || 'quickjob',
  password: process.env.VITE_DB_PASSWORD || 'Pinokio590@@',
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  try {
    console.log('🔄 מתחבר למסד הנתונים...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ התחברות למסד הנתונים הצליחה');
    
    // Read and execute init SQL
    const sqlPath = path.join(__dirname, '../database/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🔄 מריץ סקריפט יצירת טבלאות...');
    await client.query(sql);
    console.log('✅ טבלאות נוצרו בהצלחה');
    
    // Test queries
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 טבלאות שנוצרו:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
    console.log('🎉 אתחול מסד הנתונים הושלם בהצלחה!');
    
    console.log('\n📝 פרטי התחברות למנהל:');
    console.log('  אימייל: admin@launchsite.com');
    console.log('  סיסמה: admin123');
    console.log('  ⚠️  חשוב: שנה את הסיסמה לאחר הכניסה הראשונה!');
    
  } catch (error) {
    console.error('❌ שגיאה באתחול מסד הנתונים:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();