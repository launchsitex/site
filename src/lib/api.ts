import { query } from './database';

// Contact Forms API
export const contactFormsAPI = {
  // Create new contact form submission
  create: async (data: {
    full_name: string;
    email: string;
    phone: string;
    package_choice: string;
  }) => {
    const result = await query(
      `INSERT INTO contact_forms (full_name, email, phone, package_choice, status, created_at) 
       VALUES ($1, $2, $3, $4, 'new', NOW()) 
       RETURNING *`,
      [data.full_name, data.email, data.phone, data.package_choice]
    );
    return result.rows[0];
  },

  // Get all contact forms
  getAll: async () => {
    const result = await query(
      'SELECT * FROM contact_forms ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Update contact form status
  updateStatus: async (id: number, status: string) => {
    const result = await query(
      'UPDATE contact_forms SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Delete contact form
  delete: async (id: number) => {
    const result = await query(
      'DELETE FROM contact_forms WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }
};

// Page Visits API
export const pageVisitsAPI = {
  // Track page visit
  track: async (data: {
    page_id: string;
    source?: string;
    user_agent?: string;
    ip_address?: string;
  }) => {
    const result = await query(
      `INSERT INTO page_visits (page_id, source, user_agent, ip_address, visit_time) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [data.page_id, data.source, data.user_agent, data.ip_address]
    );
    return result.rows[0];
  },

  // Get visits analytics
  getAnalytics: async (days: number = 30) => {
    const result = await query(
      `SELECT 
         DATE(visit_time) as date,
         COUNT(*) as visits,
         source
       FROM page_visits 
       WHERE visit_time >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(visit_time), source
       ORDER BY date DESC`
    );
    return result.rows;
  }
};

// Deals API
export const dealsAPI = {
  // Create new deal
  create: async (data: {
    client_name: string;
    phone: string;
    email: string;
    source: string;
    package_type: string;
    amount_paid?: number;
    payment_method?: string;
    status?: string;
    closing_date?: string;
    notes?: string;
  }) => {
    const result = await query(
      `INSERT INTO deals (
        client_name, phone, email, source, package_type, 
        amount_paid, payment_method, status, closing_date, notes, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
      RETURNING *`,
      [
        data.client_name, data.phone, data.email, data.source, data.package_type,
        data.amount_paid, data.payment_method, data.status || 'פתוחה',
        data.closing_date, data.notes
      ]
    );
    return result.rows[0];
  },

  // Get all deals
  getAll: async () => {
    const result = await query(
      'SELECT * FROM deals ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Update deal
  update: async (id: string, data: any) => {
    const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = Object.values(data);
    
    const result = await query(
      `UPDATE deals SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },

  // Delete deal
  delete: async (id: string) => {
    const result = await query(
      'DELETE FROM deals WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }
};

// Authentication API
export const authAPI = {
  // Simple authentication (you might want to implement JWT)
  login: async (email: string, password: string) => {
    // This is a basic implementation - in production, use proper password hashing
    const result = await query(
      'SELECT * FROM admin_users WHERE email = $1 AND password = crypt($2, password)',
      [email, password]
    );
    return result.rows[0];
  },

  // Create admin user (run this once to create your admin account)
  createAdmin: async (email: string, password: string) => {
    const result = await query(
      `INSERT INTO admin_users (email, password, created_at) 
       VALUES ($1, crypt($2, gen_salt('bf')), NOW()) 
       RETURNING id, email, created_at`,
      [email, password]
    );
    return result.rows[0];
  }
};