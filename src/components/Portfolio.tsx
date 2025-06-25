import React from 'react';
import { ExternalLink, Users, PieChart, FileSpreadsheet, BarChart } from 'lucide-react';

interface PortfolioItem {
  title: string;
  description: string;
  imageUrl: string;
  demoUrl: string;
  category: string;
  altText: string;
}

const Portfolio: React.FC = () => {
  const portfolioItems: PortfolioItem[] = [
    {
      title: 'Friends Bar',
      description: 'דף נחיתה מודרני לבר חברים, אנחנו מזמינים אתכם להצטרף אלינו לחוויה בלתי נשכחת בבר חברים. המקום שלנו נוצר עם הרעיון הפשוט שבר צריך להרגיש כמו בית, מקום שבו כולם מרגישים בנוח.',
      imageUrl: 'https://ekrfnmlfzaymvjoademj.supabase.co/storage/v1/object/sign/launchsite/friends%20bar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2I1ZThhZDZhLTdmODEtNDJhYS04MzQ2LTBjZTk5Zjc5ZjEwMCJ9.eyJ1cmwiOiJsYXVuY2hzaXRlL2ZyaWVuZHMgYmFyLnBuZyIsImlhdCI6MTc0NjIxODY3NSwiZXhwIjoxODQwODI2Njc1fQ.zqipTtVBrJhbLmcphHgYmV_kdxjf_twGkTkUT9ubDi0',
      demoUrl: 'https://voluble-dasik-e153aa.netlify.app',
      category: 'בר מסעדה',
      altText: 'דף נחיתה של Friends Bar - בר חברים מודרני'
    },
    {
      title: 'עורך דין',
      description: 'מעניקים ללקוחותינו ייעוץ וייצוג משפטי ברמה הגבוהה ביותר, תוך התאמה אישית לצרכים הייחודיים של כל לקוח',
      imageUrl: 'https://ekrfnmlfzaymvjoademj.supabase.co/storage/v1/object/sign/launchsite/dogma%20law.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2I1ZThhZDZhLTdmODEtNDJhYS04MzQ2LTBjZTk5Zjc5ZjEwMCJ9.eyJ1cmwiOiJsYXVuY2hzaXRlL2RvZ21hIGxhdy5wbmciLCJpYXQiOjE3NDcyNTQ0MTMsImV4cCI6MTc3ODc5MDQxM30.9Sw4RBEumkpJVmql4yJ4l6TPfpY44dH66iQpwoLtkxE',
      demoUrl: 'https://lucky-elf-4fb88f.netlify.app',
      category: 'עריכת דין',
      altText: 'דף נחיתה למשרד עורכי דין מקצועי'
    },
    {
      title: 'סטודיו ליוגה',
      description: 'דף נחיתה מודרני סטודיו ליוגה, בואי למצוא את הרגע שלך לעצמך. סטודיו ליוגה ולמודעות עצמית בלב העיר – עם מדריכות מוסמכות, חוגים בקבוצות קטנות, ואנרגיה מחבקת בכל שיעור.',
      imageUrl: 'https://i.ibb.co/nVTQPx8/2025-04-30-232406.png',
      demoUrl: 'https://flourishing-pika-2d66db.netlify.app',
      category: 'יוגה',
      altText: 'דף נחיתה לסטודיו יוגה מודרני'
    },
    {
      title: 'יוסי שיפוצים',
      description: 'אינסטלציה, גבס, ריצוף, צבע ועוד – עם ניסיון, דיוק ועמידה בזמנים.',
      imageUrl: 'https://i.postimg.cc/mgp5cxpJ/2025-05-01-204337.png',
      demoUrl: 'https://cheery-zabaione-056de3.netlify.app',
      category: 'שיפוצים',
      altText: 'דף נחיתה לשירותי שיפוצים מקצועיים'
    },
    {
      title: 'אימוני כושר',
      description: 'אימון אישי מותאם בדיוק לצרכים שלך, עם תוצאות מוכחות ותמיכה מלאה לאורך כל הדרך',
      imageUrl: 'https://i.postimg.cc/MWrzvmHD/2025-05-02-124244.jpg',
      demoUrl: 'https://voluble-bublanina-2cd473.netlify.app',
      category: 'כושר',
      altText: 'דף נחיתה למאמן כושר אישי'
    },
    {
      title: 'ZUVANI Restaurant',
      description: 'דף נחיתה מודרני למסעדה תל אביבית עם תפריט מושך, עיצוב אורבני',
      imageUrl: 'https://ekrfnmlfzaymvjoademj.supabase.co/storage/v1/object/sign/launchsite/rest-dogma.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2I1ZThhZDZhLTdmODEtNDJhYS04MzQ2LTBjZTk5Zjc5ZjEwMCJ9.eyJ1cmwiOiJsYXVuY2hzaXRlL3Jlc3QtZG9nbWEucG5nIiwiaWF0IjoxNzQ4MDMyMjk0LCJleHAiOjE4NDI2NDAyOTR9.sDWLHJCJkAn46w65gA-9aED0LapDu7EJxVug6yRzjkc',
      demoUrl: 'https://dancing-starburst-55a692.netlify.app',
      category: 'מסעדות',
      altText: 'דף נחיתה למסעדה'
    }
  ];

  return (
    <section id="portfolio" className="py-12 px-4 relative">
      <div className="absolute inset-0 angular-bg opacity-10 z-0"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Landing Pages Examples Section */}
        <div className="bg-secondary-light p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800 mb-12">
          <h2 className="text-3xl font-bold mb-4 text-center">דפי נחיתה לדוגמה</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-center mb-8">
            הנה מבחר מדפי הנחיתה שבנינו. כל דף מותאם במיוחד לתחום העיסוק,
            לקהל היעד ולמטרות העסקיות של הלקוח.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                className="bg-secondary rounded-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:border-primary group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.altText}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-secondary text-sm font-bold px-3 py-1 rounded-full">
                    {item.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-secondary font-bold py-2 px-4 rounded-md transition-all duration-300 group-hover:scale-105"
                  >
                    <span>צפה בדוגמה</span>
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Panel Section */}
        <div className="bg-secondary-light/50 p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-4 text-center">פאנל ניהול מתקדם</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-center mb-8">
            כל לקוח מקבל גישה לפאנל ניהול מתקדם המאפשר מעקב אחר ביצועי דף הנחיתה וניהול הפניות בצורה יעילה.
          </p>

          <div className="bg-secondary/50 rounded-lg overflow-hidden border border-gray-700 p-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://ekrfnmlfzaymvjoademj.supabase.co/storage/v1/object/sign/launchsite/Pniot.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2I1ZThhZDZhLTdmODEtNDJhYS04MzQ2LTBjZTk5Zjc5ZjEwMCJ9.eyJ1cmwiOiJsYXVuY2hzaXRlL1BuaW90LnBuZyIsImlhdCI6MTc0ODI4MzIxMywiZXhwIjoxODc0NDI3MjEzfQ.qyYP-rLVHkyiCPpBK_NZvsT5Xd5GwHkeb2ze_p5kAJg"
                  alt="פאנל ניהול מתקדם"
                  className="rounded-lg shadow-2xl border border-gray-700"
                  loading="lazy"
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <BarChart className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">ניתוח תנועה מתקדם</h3>
                    <p className="text-gray-300">
                      צפה בנתוני הכניסות לדף הנחיתה שלך בזמן אמת, כולל גרפים, מקורות תנועה וסטטיסטיקות מפורטות.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Users className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">ניהול פניות חכם</h3>
                    <p className="text-gray-300">
                      נהל את כל הפניות במקום אחד – צפייה, סינון, שינוי סטטוס וסימון פניות שטופלו. ממשק ידידותי ונוח לשימוש.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <PieChart className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">סטטיסטיקות חבילות</h3>
                    <p className="text-gray-300">
                      קבל תמונה ברורה של התפלגות הפניות לפי סוגי חבילות וסטטוס הטיפול בהן.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <FileSpreadsheet className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">ייצוא נתונים</h3>
                    <p className="text-gray-300">
                      ייצא את כל הנתונים לקובץ אקסל בלחיצת כפתור – פניות, סטטיסטיקות וניתוחי תנועה.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;