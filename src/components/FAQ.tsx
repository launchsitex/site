import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqItems: FAQItem[] = [
    {
      question: 'כמה זמן לוקח לבנות דף נחיתה?',
      answer: 'הזמן משתנה לפי החבילה שבחרת. ברוב המקרים, דף הנחיתה יהיה מוכן תוך 5–7 ימי עסקים מרגע שהלקוח העביר לנו את כל החומרים הדרושים (תמונות, טקסטים, לוגו וכו\').'
    },
    {
      question: 'האם אני יכול לערוך לבד את הדף שלי?',
      answer: 'לא. הדף נבנה בצורה סגורה כדי להבטיח מהירות, יציבות ועיצוב עקבי. אבל – במסלול Premium Landing החודשי תקבל עד 5 עדכונים בחודש ללא עלות, כך שתוכל לבקש מאיתנו לשנות טקסטים, תמונות או קישורים בכל עת.'
    },
    {
      question: 'האם יש דומיין אישי לדף?',
      answer: 'כן, בחבילת Premium Landing אתה מקבל דומיין אישי .co.il לשנה הראשונה ללא תשלום נוסף. הדומיין שלך ייראה כך לדוגמה: www.yourname.co.il'
    },
    {
      question: 'האם הדף מותאם לניידים?',
      answer: 'בוודאי. כל הדפים שלנו נבנים בצורה רספונסיבית מלאה – התאמה מושלמת לכל גודל מסך: נייד, טאבלט, מחשב שולחני. העיצוב מותאם לגוגל ומעניק חוויית משתמש אופטימלית.'
    },
    {
      question: 'האם אתם עושים גם קידום ממומן?',
      answer: 'לא. אנחנו מתמחים אך ורק בעיצוב, בנייה ואחסון של דפי נחיתה, כדי שתוכל לקבל תוצר ממוקד ומדויק. אם תרצה – נוכל לחבר אותך לאנשי פרסום מומלצים.'
    },
    {
      question: 'מה קורה אם אני מפסיק לשלם במסלול החודשי?',
      answer: 'במקרה של אי-תשלום חודשי, תעמוד לרשותך תקופה של 2-3 ימים להסדרת החיוב. אי הסדרת התשלום תגרור הסרה קבועה של עמוד הנחיתה מהאוויר.'
    }
  ];
  
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-12 px-4 relative">
      <div className="absolute inset-0 angular-bg opacity-10 z-0"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-secondary-light p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-center">שאלות נפוצות</h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full text-right p-4 flex items-center justify-between bg-secondary-light hover:bg-secondary transition-colors duration-300"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium text-lg">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="p-4 text-gray-300 leading-relaxed border-t border-gray-700">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;