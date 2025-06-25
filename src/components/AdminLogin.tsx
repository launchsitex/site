import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Redirect to admin panel on successful login
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      navigate('/admin');
    }
  });

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-secondary-light p-8 rounded-xl shadow-2xl border border-gray-800 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">כניסת מנהל</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#c1ff00',
                    brandAccent: '#a9e600',
                  }
                }
              }
            }}
            providers={[]}
            view="sign_in"
            showLinks={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'אימייל',
                  password_label: 'סיסמה',
                  button_label: 'כניסה',
                  loading_button_label: 'מתחבר...',
                  email_input_placeholder: 'הכנס את האימייל שלך',
                  password_input_placeholder: 'הכנס סיסמה',
                }
              }
            }}
            onError={(error) => {
              setError(error.message);
            }}
          />
        </div>
      </div>
      
      {/* Copyright Footer */}
      <footer className="py-4 text-center text-gray-400">
        <p>© {new Date().getFullYear()} LaunchSite. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;