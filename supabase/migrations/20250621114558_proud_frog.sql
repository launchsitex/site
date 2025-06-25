/*
  # Create CMS tables for content management
  
  1. New Tables
    - `site_content` - ניהול תוכן טקסטואלי
    - `site_media` - ניהול קבצי מדיה
    - `site_sections` - ניהול סקשנים
    - `site_navigation` - ניהול תפריט ניווט
    - `site_settings` - הגדרות כלליות
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users only
*/

-- Site content table for text management
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id text NOT NULL,
  content_key text NOT NULL,
  content_value text,
  content_type text DEFAULT 'text',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, content_key)
);

-- Site media table for image/file management
CREATE TABLE IF NOT EXISTS site_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_key text UNIQUE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  alt_text text,
  section_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site sections table for managing page sections
CREATE TABLE IF NOT EXISTS site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  section_name text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  section_config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site navigation table for menu management
CREATE TABLE IF NOT EXISTS site_navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nav_key text UNIQUE NOT NULL,
  label text NOT NULL,
  href text NOT NULL,
  icon text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site settings table for general configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  setting_type text DEFAULT 'text',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users only
CREATE POLICY "Authenticated users can manage site content"
  ON site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage site media"
  ON site_media FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage site sections"
  ON site_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage site navigation"
  ON site_navigation FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read access for site content (for displaying on the website)
CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT TO public USING (true);

CREATE POLICY "Public can read site media"
  ON site_media FOR SELECT TO public USING (true);

CREATE POLICY "Public can read active site sections"
  ON site_sections FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Public can read active site navigation"
  ON site_navigation FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT TO public USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section_id, content_key);
CREATE INDEX IF NOT EXISTS idx_site_media_key ON site_media(media_key);
CREATE INDEX IF NOT EXISTS idx_site_sections_order ON site_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_site_navigation_order ON site_navigation(display_order);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Insert default content
INSERT INTO site_content (section_id, content_key, content_value, content_type) VALUES
('hero', 'title', 'בונים עבורך דף נחיתה מעוצב ומוכן להמריא', 'text'),
('hero', 'subtitle', 'אנחנו מתמחים בבניית דפי נחיתה מקצועיים שמושכים לקוחות, מניעים פעולות ומגדילים המרות. עיצוב מודרני, טכנולוגיה מתקדמת, וליווי אישי לכל אורך הדרך.', 'text'),
('hero', 'cta_text', 'השאר פרטים ונחזור אליך', 'text'),
('about', 'title', 'אודות LaunchSite', 'text'),
('about', 'description', 'בעולם שבו לכל לקוח יש רק 5 שניות להתרשם – דף הנחיתה שלך הוא כל מה שיש לך כדי להוכיח שאתה מקצועי, אמין ושווה את הקליק.', 'text'),
('services', 'title', 'השירותים שלנו', 'text'),
('portfolio', 'title', 'דפי נחיתה לדוגמה', 'text'),
('testimonials', 'title', 'לקוחות ממליצים', 'text'),
('pricing', 'title', 'החבילות שלנו', 'text'),
('faq', 'title', 'שאלות נפוצות', 'text'),
('contact', 'title', 'השאירו פרטים ונחזור אליכם בהקדם', 'text')
ON CONFLICT (section_id, content_key) DO NOTHING;

-- Insert default sections
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

-- Insert default navigation
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

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', 'LaunchSite - בניית דפי נחיתה מקצועיים', 'text', 'כותרת האתר'),
('site_description', 'בניית דפי נחיתה מקצועיים ומעוצבים לעסקים', 'text', 'תיאור האתר'),
('primary_color', '#c1ff00', 'color', 'צבע ראשי'),
('secondary_color', '#141414', 'color', 'צבע משני'),
('font_family', 'Heebo', 'text', 'פונט ראשי'),
('whatsapp_number', '972000000000', 'text', 'מספר וואטסאפ'),
('contact_email', 'launchsitex@gmail.com', 'email', 'אימייל יצירת קשר')
ON CONFLICT (setting_key) DO NOTHING;