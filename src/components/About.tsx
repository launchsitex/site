import React from 'react';
import { Rocket, CheckCircle, Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 px-4 relative">
      <div className="absolute inset-0 angular-bg opacity-10 z-0"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-secondary-light p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
          <div className="text-center mb-8">
            <h4 className="text-primary font-medium text-xl mb-4">אודות LaunchSite</h4>
            <p className="text-2xl font-bold mb-6">
              בעולם שבו לכל לקוח יש רק 5 שניות להתרשם – דף הנחיתה שלך הוא כל מה שיש לך כדי להוכיח שאתה מקצועי, אמין ושווה את הקליק.
            </p>
          </div>

          <div className="space-y-6">
            <div className="animate-fade-in">
              <p className="text-gray-300 leading-relaxed mb-6">
                LaunchSite נולדה מתוך ההבנה שעסקים קטנים, יזמים ובעלי מקצוע לא צריכים אתר מורכב ומסורבל כדי להצליח בדיגיטל.
                מה שהם באמת צריכים זה דף חכם, ממוקד ויפהפה – כזה שמניע לפעולה, אוסף לידים ומייצר תוצאות בפועל.
              </p>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg animate-fade-in animate-delay-100">
              <h3 className="text-xl font-bold mb-4">מה אנחנו מציעים?</h3>
              <ul className="space-y-3">
                {[
                  'עיצוב בהתאמה אישית – מבוסס על זהות המותג שלך וקהל היעד.',
                  'פיתוח טכני מהיר – הדף מוכן תוך 3–5 ימי עסקים.',
                  'תמיכה מלאה בעברית, רספונסיביות מלאה לניידים.',
                  'טופס יצירת קשר או וואטסאפ צף – כך שלא תאבד לידים.',
                  'אפשרות לדומיין אישי ואחסון מאובטח.',
                  'תמחור הוגן – ללא הפתעות, עם מסלולי Basic ו־Premium.'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="text-primary mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-secondary/50 p-6 rounded-lg animate-fade-in animate-delay-200">
              <h3 className="text-xl font-bold mb-4">למה לבחור בנו?</h3>
              <ul className="space-y-4">
                {[
                  'מקצוענות ללא פשרות – כל דף נבדק ידנית, נבנה בקוד נקי ונטען במהירות.',
                  'האתרים שלנו מתארחים בשרתי ענן מתקדמים, עם אבטחה גבוהה וזמינות מרבית, כדי להבטיח לך ביצועים מהירים ושקט נפשי.',
                  'יחס אישי – אצלנו אתה לא עוד מספר. נלווה אותך עד שהדף שלך באוויר – ונשאר זמינים גם אחרי.'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className="text-primary mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center mt-8 animate-fade-in animate-delay-300">
              <h3 className="text-2xl font-bold mb-4">החזון שלנו</h3>
              <p className="text-gray-300 leading-relaxed">
                לאפשר לכל עסק בישראל, בלי תלות בגודל או תקציב, ליהנות מדף נחיתה ברמה הגבוהה ביותר –
                <br />
                כזה שלא רק נראה טוב, אלא מביא תוצאות אמיתיות.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;