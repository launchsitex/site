import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SiteContent {
  id: string;
  section_id: string;
  content_key: string;
  content_value: string;
  content_type: string;
}

interface SiteMedia {
  id: string;
  media_key: string;
  file_name: string;
  file_url: string;
  file_type: string;
  alt_text?: string;
  section_id?: string;
}

interface SiteSection {
  id: string;
  section_key: string;
  section_name: string;
  is_active: boolean;
  display_order: number;
  section_config: any;
}

interface SiteNavigation {
  id: string;
  nav_key: string;
  label: string;
  href: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

interface SiteSettings {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description?: string;
}

export function useCMS() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [media, setMedia] = useState<SiteMedia[]>([]);
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [navigation, setNavigation] = useState<SiteNavigation[]>([]);
  const [settings, setSettings] = useState<SiteSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all CMS data
  const fetchCMSData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [contentRes, mediaRes, sectionsRes, navigationRes, settingsRes] = await Promise.all([
        supabase.from('site_content').select('*').order('section_id'),
        supabase.from('site_media').select('*').order('created_at'),
        supabase.from('site_sections').select('*').order('display_order'),
        supabase.from('site_navigation').select('*').order('display_order'),
        supabase.from('site_settings').select('*').order('setting_key')
      ]);

      if (contentRes.error) throw contentRes.error;
      if (mediaRes.error) throw mediaRes.error;
      if (sectionsRes.error) throw sectionsRes.error;
      if (navigationRes.error) throw navigationRes.error;
      if (settingsRes.error) throw settingsRes.error;

      setContent(contentRes.data || []);
      setMedia(mediaRes.data || []);
      setSections(sectionsRes.data || []);
      setNavigation(navigationRes.data || []);
      setSettings(settingsRes.data || []);
    } catch (err: any) {
      console.error('Error fetching CMS data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update content
  const updateContent = async (sectionId: string, contentKey: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          section_id: sectionId,
          content_key: contentKey,
          content_value: value
        }, {
          onConflict: 'section_id,content_key'
        });

      if (error) throw error;
      await fetchCMSData();
      return true;
    } catch (err: any) {
      console.error('Error updating content:', err);
      setError(err.message);
      return false;
    }
  };

  // Update section
  const updateSection = async (sectionKey: string, updates: Partial<SiteSection>) => {
    try {
      const { error } = await supabase
        .from('site_sections')
        .update(updates)
        .eq('section_key', sectionKey);

      if (error) throw error;
      await fetchCMSData();
      return true;
    } catch (err: any) {
      console.error('Error updating section:', err);
      setError(err.message);
      return false;
    }
  };

  // Update navigation
  const updateNavigation = async (navKey: string, updates: Partial<SiteNavigation>) => {
    try {
      const { error } = await supabase
        .from('site_navigation')
        .update(updates)
        .eq('nav_key', navKey);

      if (error) throw error;
      await fetchCMSData();
      return true;
    } catch (err: any) {
      console.error('Error updating navigation:', err);
      setError(err.message);
      return false;
    }
  };

  // Update settings
  const updateSetting = async (settingKey: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: settingKey,
          setting_value: value
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;
      await fetchCMSData();
      return true;
    } catch (err: any) {
      console.error('Error updating setting:', err);
      setError(err.message);
      return false;
    }
  };

  // Upload media
  const uploadMedia = async (file: File, mediaKey: string, sectionId?: string, altText?: string) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${mediaKey}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-media')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-media')
        .getPublicUrl(filePath);

      // Save media record
      const { error: dbError } = await supabase
        .from('site_media')
        .upsert({
          media_key: mediaKey,
          file_name: fileName,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          alt_text: altText,
          section_id: sectionId
        }, {
          onConflict: 'media_key'
        });

      if (dbError) throw dbError;
      await fetchCMSData();
      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading media:', err);
      setError(err.message);
      return null;
    }
  };

  // Helper functions to get specific content
  const getContent = (sectionId: string, contentKey: string, defaultValue = '') => {
    const item = content.find(c => c.section_id === sectionId && c.content_key === contentKey);
    return item?.content_value || defaultValue;
  };

  const getSetting = (settingKey: string, defaultValue = '') => {
    const item = settings.find(s => s.setting_key === settingKey);
    return item?.setting_value || defaultValue;
  };

  const getMedia = (mediaKey: string) => {
    return media.find(m => m.media_key === mediaKey);
  };

  const getActiveNavigation = () => {
    return navigation.filter(n => n.is_active).sort((a, b) => a.display_order - b.display_order);
  };

  const getActiveSections = () => {
    return sections.filter(s => s.is_active).sort((a, b) => a.display_order - b.display_order);
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  return {
    content,
    media,
    sections,
    navigation,
    settings,
    loading,
    error,
    updateContent,
    updateSection,
    updateNavigation,
    updateSetting,
    uploadMedia,
    getContent,
    getSetting,
    getMedia,
    getActiveNavigation,
    getActiveSections,
    refetch: fetchCMSData
  };
}