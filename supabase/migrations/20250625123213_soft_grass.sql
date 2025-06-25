-- Create database tables for LaunchSite

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Contact forms table
CREATE TABLE IF NOT EXISTS contact_forms (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  package_choice VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page visits table for analytics
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id VARCHAR(255) NOT NULL,
  visit_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45)
);

-- Deals management table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  source VARCHAR(100) NOT NULL,
  package_type VARCHAR(100) NOT NULL,
  amount_paid DECIMAL(10,2),
  payment_method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'פתוחה',
  closing_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site content management tables
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id VARCHAR(100) NOT NULL,
  content_key VARCHAR(100) NOT NULL,
  content_value TEXT,
  content_type VARCHAR(50) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, content_key)
);

CREATE TABLE IF NOT EXISTS site_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_key VARCHAR(100) UNIQUE NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER,
  alt_text TEXT,
  section_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(100) UNIQUE NOT NULL,
  section_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  section_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nav_key VARCHAR(100) UNIQUE NOT NULL,
  label VARCHAR(255) NOT NULL,
  href VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_forms_created_at ON contact_forms(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON contact_forms(status);
CREATE INDEX IF NOT EXISTS idx_page_visits_visit_time ON page_visits(visit_time);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_id ON page_visits(page_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section_id, content_key);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_forms_updated_at
  BEFORE UPDATE ON contact_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_media_updated_at
  BEFORE UPDATE ON site_media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_sections_updated_at
  BEFORE UPDATE ON site_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_navigation_updated_at
  BEFORE UPDATE ON site_navigation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO site_content (section_id, content_key, content_value, content_type) VALUES
('hero', 'title', 'בונים עבורך דף נחיתה מעוצב ומוכן להמריא', 'text'),
('hero', 'subtitle', 'אנחנו מתמחים בבניית דפי נחיתה מקצועיים שמושכים לקוחות, מניעים פעולות ומגדילים המרות. עיצוב מודרני, טכנולוגיה מתקדמת, וליווי אישי לכל אורך הדרך.', 'text'),
('about', 'title', 'אודות LaunchSite', 'text'),
('services', 'title', 'השירותים שלנו', 'text'),
('portfolio', 'title', 'דפי נחיתה לדוגמה', 'text'),
('testimonials', 'title', 'לקוחות ממליצים', 'text'),
('pricing', 'title', 'החבילות שלנו', 'text'),
('faq', 'title', 'שאלות נפוצות', 'text'),
('contact', 'title', 'השאירו פרטים ונחזור אליכם בהקדם', 'text')
ON CONFLICT (section_id, content_key) DO NOTHING;

INSERT INTO site_sections (section_key, section_name, display_order, is_active) VALUES
('hero', 'סקשן הבית', 1, true),
('about', 'אודות', 2, true),
('services', 'שירותים', 3, true),
('portfolio', 'דוגמאות עבודות', 4, true),
('testimonials', 'המלצות', 5, true),
('pricing', 'מחירים', 6, true),
('faq', 'שאלות נפוצות', 7, true),
('contact', 'יצירת קשר', 8, true)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO site_navigation (nav_key, label, href, icon, display_order, is_active) VALUES
('home', 'בית', '/#home', 'Home', 1, true),
('about', 'אודות', '/#about', 'User', 2, true),
('services', 'שירותים', '/#services', 'FileText', 3, true),
('portfolio', 'דוגמאות', '/#portfolio', 'Layout', 4, true),
('testimonials', 'המלצות', '/#testimonials', 'MessageSquare', 5, true),
('pricing', 'מסלולים', '/#pricing', 'CreditCard', 6, true),
('faq', 'שאלות נפוצות', '/#faq', 'HelpCircle', 7, true),
('contact', 'צור קשר', '/#contact', 'Mail', 8, true),
('accessibility', 'הצהרת נגישות', '/accessibility', 'Accessibility', 9, true)
ON CONFLICT (nav_key) DO NOTHING;

INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', 'LaunchSite - בניית דפי נחיתה מקצועיים', 'text', 'כותרת האתר'),
('site_description', 'בניית דפי נחיתה מקצועיים ומעוצבים לעסקים', 'text', 'תיאור האתר'),
('primary_color', '#c1ff00', 'color', 'צבע ראשי'),
('secondary_color', '#141414', 'color', 'צבע משני'),
('whatsapp_number', '972000000000', 'text', 'מספר וואטסאפ'),
('contact_email', 'launchsitex@gmail.com', 'email', 'אימייל יצירת קשר')
ON CONFLICT (setting_key) DO NOTHING;

-- Create default admin user (change password after first login!)
INSERT INTO admin_users (email, password) VALUES 
('admin@launchsite.com', crypt('admin123', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;