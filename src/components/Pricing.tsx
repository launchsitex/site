import React from 'react';
import { Check, Rocket } from 'lucide-react';

const Pricing: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-12 px-4 relative">
      <div className="absolute inset-0 angular-bg opacity-10 z-0"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-secondary-light p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">החבילות שלנו</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Package */}
            <div className="bg-secondary/50 rounded-xl p-6 border border-gray-700 relative animate-fade-in">
              <div className="absolute -top-3 right-4 bg-green-500 text-secondary text-sm font-bold px-3 py-1 rounded-full">
                Basic
              </div>
              
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-6">Basic Landing</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">₪1,190</span>
                    <span className="text-gray-400">הקמה חד־פעמית</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">₪250</span>
                    <span className="text-gray-400">תחזוקה חודשית</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'הקמת דף נחיתה',
                    'התאמה מלאה לכל סוגי המסכים',
                    'טעינה מהירה גם בגלישה סלולרית',
                    'אחסון בענן מאובטח',
                    'קפיצה ישירה ל-WhatsApp',
                    'תמיכה ב-RTL לעברית',
                    'תמיכה טכנית מלאה',
                    'עדכוני אבטחה ותחזוקה חודשית'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="text-green-500" size={20} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToContact}
                  className="w-full bg-green-500 hover:bg-green-600 text-secondary font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  מעוניין בחבילה זו
                </button>
              </div>
            </div>

            {/* Premium Package */}
            <div className="bg-secondary/50 rounded-xl p-6 border border-primary relative animate-fade-in animate-delay-100">
              <div className="absolute -top-3 right-4 bg-primary text-secondary text-sm font-bold px-3 py-1 rounded-full">
                Premium
              </div>
              
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-6">Premium Landing</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">₪1,990</span>
                    <span className="text-gray-400">הקמה חד־פעמית</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">₪450</span>
                    <span className="text-gray-400">תחזוקה חודשית</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'כל מה שכלול בחבילת Basic',
                    'עמוד נחיתה מעוצב בצורה מקצועית',
                    'טופס יצירת קשר הכולל פאנל ניהול לידים מתקדם',
                    'אחסון בענן מאובטח ומהיר',
                    'תמיכה טכנית שוטפת',
                    'רישום דומיין לבחירת הלקוח',
                    'וידאו רקע / אנימציה לחוויה ייחודית',
                    'תמיכה טכנית 24/7 דרך WhatsApp',
                    'עד 5 עדכונים בחודש ללא עלות'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="text-primary" size={20} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToContact}
                  className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  מעוניין בחבילה זו
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;