import React, { useState } from 'react';
import { useCMS } from '../hooks/useCMS';
import { 
  Save, 
  Upload, 
  Edit3, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Palette, 
  Type, 
  Image, 
  Navigation,
  Settings,
  FileText,
  Loader,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';

const CMSManager: React.FC = () => {
  const {
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
    refetch
  } = useCMS();

  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'sections' | 'navigation' | 'settings'>('content');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const handleSave = async (type: string, key: string, value: string, additionalData?: any) => {
    setSaving(true);
    let success = false;

    try {
      switch (type) {
        case 'content':
          const [sectionId, contentKey] = key.split('.');
          success = await updateContent(sectionId, contentKey, value);
          break;
        case 'section':
          success = await updateSection(key, additionalData);
          break;
        case 'navigation':
          success = await updateNavigation(key, additionalData);
          break;
        case 'setting':
          success = await updateSetting(key, value);
          break;
      }

      if (success) {
        setEditingItem(null);
        setTempValues({});
      }
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, mediaKey: string, sectionId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(mediaKey);
    try {
      await uploadMedia(file, mediaKey, sectionId);
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setUploadingFile(null);
    }
  };

  const tabs = [
    { key: 'content', label: 'תוכן', icon: <FileText size={20} /> },
    { key: 'media', label: 'מדיה', icon: <Image size={20} /> },
    { key: 'sections', label: 'סקשנים', icon: <Eye size={20} /> },
    { key: 'navigation', label: 'ניווט', icon: <Navigation size={20} /> },
    { key: 'settings', label: 'הגדרות', icon: <Settings size={20} /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin" size={32} />
        <span className="mr-3">טוען נתוני CMS...</span>
      </div>
    );
  }

  return (
    <div className="bg-secondary-light rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-secondary/50 p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold mb-4">ניהול תוכן האתר (CMS)</h2>
        
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-secondary font-bold'
                  : 'bg-secondary hover:bg-secondary-light text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 m-6 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="p-6">
        {/* Content Management */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">ניהול תוכן טקסטואלי</h3>
            
            {['hero', 'about', 'services', 'portfolio', 'testimonials', 'pricing', 'faq', 'contact'].map((sectionId) => (
              <div key={sectionId} className="bg-secondary/30 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-4 capitalize">{sectionId}</h4>
                
                {content
                  .filter(c => c.section_id === sectionId)
                  .map((item) => {
                    const itemKey = `${item.section_id}.${item.content_key}`;
                    const isEditing = editingItem === itemKey;
                    const tempValue = tempValues[itemKey] || item.content_value;
                    
                    return (
                      <div key={itemKey} className="mb-4 p-3 bg-secondary/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <label className="font-medium text-primary">{item.content_key}</label>
                          <button
                            onClick={() => {
                              if (isEditing) {
                                handleSave('content', itemKey, tempValue);
                              } else {
                                setEditingItem(itemKey);
                                setTempValues({ ...tempValues, [itemKey]: item.content_value });
                              }
                            }}
                            disabled={saving}
                            className="text-primary hover:text-primary-dark transition-colors"
                          >
                            {saving && editingItem === itemKey ? (
                              <Loader className="animate-spin" size={16} />
                            ) : isEditing ? (
                              <Save size={16} />
                            ) : (
                              <Edit3 size={16} />
                            )}
                          </button>
                        </div>
                        
                        {isEditing ? (
                          <textarea
                            value={tempValue}
                            onChange={(e) => setTempValues({ ...tempValues, [itemKey]: e.target.value })}
                            className="w-full bg-secondary border border-gray-700 rounded-md p-3 focus:outline-none focus:border-primary"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-300">{item.content_value}</p>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        )}

        {/* Media Management */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">ניהול מדיה</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.map((item) => (
                <div key={item.id} className="bg-secondary/30 p-4 rounded-lg">
                  <div className="aspect-video bg-secondary rounded-lg mb-3 overflow-hidden">
                    {item.file_type.startsWith('image/') ? (
                      <img
                        src={item.file_url}
                        alt={item.alt_text || item.file_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-bold mb-2">{item.media_key}</h4>
                  <p className="text-sm text-gray-400 mb-3">{item.file_name}</p>
                  
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, item.media_key, item.section_id || undefined)}
                        className="hidden"
                      />
                      <div className="bg-primary hover:bg-primary-dark text-secondary font-bold py-2 px-3 rounded-md cursor-pointer text-center transition-colors flex items-center justify-center gap-2">
                        {uploadingFile === item.media_key ? (
                          <Loader className="animate-spin" size={16} />
                        ) : (
                          <Upload size={16} />
                        )}
                        <span>החלף</span>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections Management */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">ניהול סקשנים</h3>
            
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="bg-secondary/30 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleSave('section', section.section_key, '', { display_order: section.display_order - 1 })}
                        className="text-primary hover:text-primary-dark"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleSave('section', section.section_key, '', { display_order: section.display_order + 1 })}
                        className="text-primary hover:text-primary-dark"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    
                    <div>
                      <h4 className="font-bold">{section.section_name}</h4>
                      <p className="text-sm text-gray-400">מיקום: {section.display_order}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleSave('section', section.section_key, '', { is_active: !section.is_active })}
                      className={`p-2 rounded-lg transition-colors ${
                        section.is_active
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {section.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Management */}
        {activeTab === 'navigation' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">ניהול תפריט ניווט</h3>
            
            <div className="space-y-4">
              {navigation.map((nav) => {
                const isEditing = editingItem === nav.nav_key;
                
                return (
                  <div key={nav.id} className="bg-secondary/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleSave('navigation', nav.nav_key, '', { display_order: nav.display_order - 1 })}
                            className="text-primary hover:text-primary-dark"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => handleSave('navigation', nav.nav_key, '', { display_order: nav.display_order + 1 })}
                            className="text-primary hover:text-primary-dark"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                        
                        <div>
                          <h4 className="font-bold">{nav.label}</h4>
                          <p className="text-sm text-gray-400">{nav.href}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave('navigation', nav.nav_key, '', { is_active: !nav.is_active })}
                          className={`p-2 rounded-lg transition-colors ${
                            nav.is_active
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {nav.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (isEditing) {
                              const label = tempValues[`${nav.nav_key}_label`] || nav.label;
                              const href = tempValues[`${nav.nav_key}_href`] || nav.href;
                              handleSave('navigation', nav.nav_key, '', { label, href });
                            } else {
                              setEditingItem(nav.nav_key);
                              setTempValues({
                                ...tempValues,
                                [`${nav.nav_key}_label`]: nav.label,
                                [`${nav.nav_key}_href`]: nav.href
                              });
                            }
                          }}
                          className="text-primary hover:text-primary-dark"
                        >
                          {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 font-medium">תווית</label>
                          <input
                            type="text"
                            value={tempValues[`${nav.nav_key}_label`] || ''}
                            onChange={(e) => setTempValues({ ...tempValues, [`${nav.nav_key}_label`]: e.target.value })}
                            className="w-full bg-secondary border border-gray-700 rounded-md p-3 focus:outline-none focus:border-primary"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-2 font-medium">קישור</label>
                          <input
                            type="text"
                            value={tempValues[`${nav.nav_key}_href`] || ''}
                            onChange={(e) => setTempValues({ ...tempValues, [`${nav.nav_key}_href`]: e.target.value })}
                            className="w-full bg-secondary border border-gray-700 rounded-md p-3 focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Settings Management */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">הגדרות כלליות</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {settings.map((setting) => {
                const isEditing = editingItem === setting.setting_key;
                const tempValue = tempValues[setting.setting_key] || setting.setting_value;
                
                return (
                  <div key={setting.id} className="bg-secondary/30 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold">{setting.setting_key}</h4>
                        {setting.description && (
                          <p className="text-sm text-gray-400">{setting.description}</p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleSave('setting', setting.setting_key, tempValue);
                          } else {
                            setEditingItem(setting.setting_key);
                            setTempValues({ ...tempValues, [setting.setting_key]: setting.setting_value });
                          }
                        }}
                        disabled={saving}
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        {saving && editingItem === setting.setting_key ? (
                          <Loader className="animate-spin" size={16} />
                        ) : isEditing ? (
                          <Save size={16} />
                        ) : (
                          <Edit3 size={16} />
                        )}
                      </button>
                    </div>
                    
                    {isEditing ? (
                      setting.setting_type === 'color' ? (
                        <input
                          type="color"
                          value={tempValue}
                          onChange={(e) => setTempValues({ ...tempValues, [setting.setting_key]: e.target.value })}
                          className="w-full h-12 bg-secondary border border-gray-700 rounded-md focus:outline-none focus:border-primary"
                        />
                      ) : (
                        <input
                          type={setting.setting_type === 'email' ? 'email' : 'text'}
                          value={tempValue}
                          onChange={(e) => setTempValues({ ...tempValues, [setting.setting_key]: e.target.value })}
                          className="w-full bg-secondary border border-gray-700 rounded-md p-3 focus:outline-none focus:border-primary"
                        />
                      )
                    ) : (
                      <div className="flex items-center gap-2">
                        {setting.setting_type === 'color' && (
                          <div
                            className="w-6 h-6 rounded border border-gray-700"
                            style={{ backgroundColor: setting.setting_value }}
                          />
                        )}
                        <span className="text-gray-300">{setting.setting_value}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CMSManager;