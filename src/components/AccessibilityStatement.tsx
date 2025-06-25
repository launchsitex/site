import React from 'react';
import Sidebar from './Sidebar';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessibilityStatement: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      
      <main className="lg:pr-20">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-secondary-light p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-8 group"
                aria-label="חזרה לדף הבית"
              >
                <Home 
                  size={24} 
                  className="transition-transform group-hover:-translate-x-1" 
                />
                <span className="font-medium">חזרה לדף הבית</span>
              </Link>

              <h1 className="text-3xl font-bold mb-8">הצהרת נגישות לאתר LaunchSite</h1>
              
              <div className="space-y-8 text-gray-300">
                <div>
                  <h2 className="text-2xl font-bold mb-4">כללי</h2>
                  <p className="leading-relaxed">
                    אנו ב־LaunchSite מחויבים לספק חוויית גלישה נגישה לכלל המשתמשים, לרבות אנשים עם מוגבלויות. 
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">התאמות שבוצעו באתר</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">ניווט מקלדת מלא</h3>
                      <p>ניתן לנווט באתר בעזרת מקלדת בלבד באמצעות כפתורי ה־Tab ו־Shift+Tab.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">שימוש בתגיות נכונות (ARIA)</h3>
                      <p>כל האלמנטים באתר מסומנים בתגיות נגישות על מנת לשפר את יכולת הזיהוי שלהם בקוראי מסך.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">התאמת צבעים וניגודיות</h3>
                      <p>הקפדנו על ניגודיות מתאימה בין צבעי הטקסט לרקע, על מנת לאפשר קריאה נוחה.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">תמיכה בקוראי מסך</h3>
                      <p>האתר תומך בקוראי מסך פופולריים כגון NVDA ו־JAWS, כולל אפשרות לתיאור תמונות (Alt Text) וניווט כותרות תקין.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">טפסים נגישים</h3>
                      <p>כל שדות הטפסים באתר כוללים תוויות והסבר קצר לשימוש.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">הגדלת טקסט</h3>
                      <p>ניתן להגדיל ולהקטין את גודל הגופן על ידי שימוש בקיצורי דרך במקלדת (Ctrl + ו־Ctrl -).</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">וידאו ותמונות</h3>
                      <p>כל הסרטונים מלווים בכותרות ותיאורים טקסטואליים על מנת להנגיש את המידע גם למשתמשים עם לקויות ראייה.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">דרכי פנייה בנושא נגישות</h2>
                  <p className="mb-4">אם במהלך הגלישה באתר נתקלתם בקושי בנגישות או שיש לכם הצעה לשיפור בנושא, נשמח לקבל את פנייתכם.</p>
                  
                  <div className="space-y-2">
                    <p>
                      <strong className="text-primary">אימייל: </strong>
                      <a href="mailto:launchsitex@gmail.com" className="text-primary hover:underline">launchsitex@gmail.com</a>
                    </p>
                    <p>
         
                    </p>
                  </div>

                  <p className="mt-4">אנו מתחייבים לטפל בכל פנייה בהקדם האפשרי ולפעול לשיפור הנגישות באתר.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AccessibilityStatement;