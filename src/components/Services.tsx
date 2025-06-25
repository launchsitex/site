import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Rocket, Globe, MessageSquare, Wrench, Zap, Shield, BarChart, Clock, Smartphone, Code } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 px-4 relative">
      <div className="absolute inset-0 angular-bg opacity-10 z-0"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-secondary-light p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">השירותים שלנו</h2>
            <p className="text-gray-300 leading-relaxed">
              ב־LaunchSite אנחנו לא סתם בונים דפי נחיתה – אנחנו בונים נכסים דיגיטליים ממוקדים תוצאה, שמניעים לפעולה ומביאים לידים לעסק שלך.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Rocket className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold">עיצוב ובניית דף נחיתה מקצועי</h3>
              </div>
              <p className="text-gray-300 mb-4">
                בניית דף נחיתה מעוצב, ממותג ומוכן לפעולה – תוך התאמה מלאה לצרכים שלך.
                הדפים נבנים עם קוד איכותי, טעינה מהירה, התאמה לניידים, ועיצוב שמשדר יוקרה ומקצועיות.
              </p>
              <p className="text-primary">✓ מתאים לקמפיינים ממומנים, מבצעים, או הצגה מרשימה של שירות</p>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Globe className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold">דומיין אישי ואחסון מתקדם</h3>
              </div>
              <p className="text-gray-300 mb-4">
                חבילת Premium כוללת דומיין אישי משלך והגדרה מלאה של DNS.
                האחסון שלנו מבוסס על שרתי ענן מתקדמים עם זמינות של 99.9%.
              </p>
              <p className="text-primary">✓ כולל תעודת SSL ואבטחה מתקדמת</p>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <MessageSquare className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold">מערכת ניהול לידים מתקדמת</h3>
              </div>
              <p className="text-gray-300 mb-4">
                פאנל ניהול ייעודי לניהול כל הפניות במקום אחד, כולל התראות בזמן אמת,
                סטטיסטיקות, וייצוא נתונים לאקסל.
              </p>
              <p className="text-primary">✓ אפשרות לחיבור ישיר ל-WhatsApp העסקי שלך</p>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Wrench className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold">תמיכה טכנית ועדכונים</h3>
              </div>
              <p className="text-gray-300 mb-4">
                תמיכה טכנית 24/7 וביצוע עדכונים שוטפים.
                בחבילת Premium מקבלים עד 5 עדכוני תוכן בחודש ללא תשלום נוסף.
              </p>
              <p className="text-primary">✓ כולל גיבויים אוטומטיים ואבטחה שוטפת</p>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Zap className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold">ביצועים אופטימליים</h3>
              </div>
              <p className="text-gray-300 mb-4">
                דפי הנחיתה שלנו נבנים עם דגש על מהירות טעינה וביצועים.
                קוד נקי, תמונות אופטימליות, ושרתי CDN מהירים.
              </p>
              <p className="text-primary">✓ ציון PageSpeed Insights גבוה במיוחד</p>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <BarChart className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold">ניתוח נתונים ואופטימיזציה</h3>
              </div>
              <p className="text-gray-300 mb-4">
                מעקב אחר ביצועי הדף, ניתוח התנהגות משתמשים,
                ודוחות מפורטים לשיפור אחוזי ההמרה.
              </p>
              <p className="text-primary">✓ כולל המלצות לשיפור ביצועים</p>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Shield className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold">אבטחה ופרטיות</h3>
              </div>
              <p className="text-gray-300 mb-4">
                הגנה מתקדמת על הדף שלך מפני התקפות סייבר,
                גיבוי יומי אוטומטי, ושמירה על פרטיות המשתמשים.
              </p>
              <p className="text-primary">✓ עמידה בתקני אבטחה מחמירים</p>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Smartphone className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold">התאמה מושלמת לנייד</h3>
              </div>
              <p className="text-gray-300 mb-4">
                עיצוב רספונסיבי מלא שמתאים לכל גודל מסך,
                עם דגש מיוחד על חוויית משתמש מעולה בניידים.
              </p>
              <p className="text-primary">✓ בדיקות מקיפות בכל המכשירים</p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">יתרונות נוספים</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg">
                <Shield className="text-primary" size={20} />
                <span>אבטחה מתקדמת</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg">
                <Clock className="text-primary" size={20} />
                <span>זמינות 99.9%</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg">
                <Smartphone className="text-primary" size={20} />
                <span>תאימות מלאה לנייד</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg">
                <Code className="text-primary" size={20} />
                <span>קוד נקי ומהיר</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg">
                <Globe className="text-primary" size={20} />
                <span>תמיכה ב-RTL</span>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-lg">
                <MessageSquare className="text-primary" size={20} />
                <span>צ'אט תמיכה</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;