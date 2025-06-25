import React, { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { contactFormsAPI } from '../lib/api';

interface ContactFormProps {
  setShowThankYou: (show: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ setShowThankYou }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: 'basic'
  });
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'שם מלא הוא שדה חובה';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'אימייל הוא שדה חובה';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'כתובת אימייל לא תקינה';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'מספר טלפון הוא שדה חובה';
    } else if (!/^0\d{8,9}$/.test(formData.phone)) {
      errors.phone = 'מספר טלפון לא תקין';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await contactFormsAPI.create({
        full_name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        package_choice: formData.package
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        package: 'basic'
      });
      setShowThankYou(true);
    } catch (error) {
      alert('אירעה שגיאה בשליחת הטופס. אנא נסו שוב מאוחר יותר.');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  return (
    <section id="contact" className="py-16 px-4 relative">
      <div className="absolute inset-0 angular-bg opacity-10 z-0"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-secondary-light p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center animate-fade-in">השאירו פרטים ונחזור אליכם בהקדם</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in animate-delay-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  שם מלא <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-secondary border ${formErrors.name ? 'border-red-500' : 'border-gray-700'} rounded-md p-3 focus:outline-none focus:border-primary transition-colors`}
                  dir="rtl"
                />
                {formErrors.name && <p className="mt-1 text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block mb-2 font-medium">
                  טלפון <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-secondary border ${formErrors.phone ? 'border-red-500' : 'border-gray-700'} rounded-md p-3 focus:outline-none focus:border-primary transition-colors`}
                  dir="rtl"
                />
                {formErrors.phone && <p className="mt-1 text-red-500 text-sm">{formErrors.phone}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                אימייל <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-secondary border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-md p-3 focus:outline-none focus:border-primary transition-colors`}
                dir="rtl"
              />
              {formErrors.email && <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="package" className="block mb-2 font-medium">בחירת חבילה</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-4 border ${formData.package === 'basic' ? 'border-primary bg-secondary-light' : 'border-gray-700 bg-secondary'} rounded-md cursor-pointer transition-all hover:border-primary`}>
                  <input
                    type="radio"
                    name="package"
                    value="basic"
                    checked={formData.package === 'basic'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="block text-lg font-bold mb-1">Basic</span>
                    <span className="text-sm text-gray-400">חבילה בסיסית</span>
                  </div>
                </label>
                
                <label className={`flex items-center justify-center p-4 border ${formData.package === 'premium' ? 'border-primary bg-secondary-light' : 'border-gray-700 bg-secondary'} rounded-md cursor-pointer transition-all hover:border-primary`}>
                  <input
                    type="radio"
                    name="package"
                    value="premium"
                    checked={formData.package === 'premium'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="block text-lg font-bold mb-1">Premium</span>
                    <span className="text-sm text-gray-400">חבילה פרימיום</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-12 rounded-md flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-secondary border-t-transparent rounded-full"></div>
                    <span>שולח...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>שליחה</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;