import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'ליאור',
      role: 'ברים ומסעדות',
      content: 'בעלים של "Friends Bar" עמוד הנחיתה שעיצבת עבורנו פשוט מושלם! העיצוב מדויק, נקי ומייצר פניות באופן קבוע. השירות היה מקצועי ומהיר – ממליץ בחום!',
      rating: 5
    },
    {
      name: 'אבי לוי',
      role: 'קבלן שיפוצים',
      content: 'תוך שבוע מרגע שפניתי, כבר היה לי דף נחיתה מקצועי שמביא המון לקוחות חדשים. ההשקעה השתלמה!',
      rating: 5
    },
    {
      name: 'מיכל ברק',
      role: 'מאמנת אישית',
      content: 'העיצוב המודרני והמקצועי של הדף עזר לי למתג את העסק ברמה גבוהה. התמיכה והשירות פשוט מעולים.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-12 px-4 relative">
      <div className="absolute inset-0 angular-bg opacity-10 z-0"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-secondary-light p-8 md:p-12 rounded-xl shadow-2xl border border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">לקוחות ממליצים</h2>
            <p className="text-gray-300">
              מה לקוחותינו אומרים על השירות והתוצאות
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-secondary/50 p-6 rounded-lg border border-gray-700 hover:border-primary transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-primary text-sm">{testimonial.role}</p>
                  </div>
                  <Quote className="text-primary opacity-50" size={24} />
                </div>

                <p className="text-gray-300 mb-4">{testimonial.content}</p>

                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-primary fill-primary"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;