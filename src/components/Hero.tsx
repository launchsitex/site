import React from 'react';
import { Rocket, Send, Smartphone } from 'lucide-react';

interface HeroProps {
  scrollToContact: () => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToContact }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-secondary via-secondary to-[#1a1a1a]">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)'
        }}
      />
      
      {/* Animated background dots */}
      <div className="absolute inset-0 z-0">
        <div className="stars-container">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>

      {/* Desktop Animation */}
      <div className="hero-animation">
        <div className="floating-element element-form"></div>
        <div className="floating-element element-button"></div>
        <div className="floating-element element-screen"></div>
        <div className="floating-element element-icon icon-1">
          <Rocket size={24} />
        </div>
        <div className="floating-element element-icon icon-2">
          <Send size={24} />
        </div>
        <div className="floating-element element-icon icon-3">
          <Smartphone size={24} />
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6 animate-fade-in">
            <div className="bg-primary/20 p-3 rounded-full">
              <Rocket className="text-primary" size={32} />
            </div>
            <h4 className="text-primary font-medium text-4xl">LaunchSite</h4>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in animate-delay-100 leading-tight">
            בונים עבורך דף נחיתה
            <br />
            <span className="text-primary">מעוצב ומוכן להמריא</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 animate-fade-in animate-delay-200 max-w-2xl">
            אנחנו מתמחים בבניית דפי נחיתה מקצועיים שמושכים לקוחות, מניעים פעולות ומגדילים המרות. 
            עיצוב מודרני, טכנולוגיה מתקדמת, וליווי אישי לכל אורך הדרך.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-300">
            <button 
              onClick={scrollToContact}
              className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-secondary text-lg font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
            >
              <span>השאר פרטים ונחזור אליך</span>
              <Send size={20} className="transition-transform group-hover:translate-x-1" />
            </button>

            <a 
              href="#portfolio"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-lg font-bold py-4 px-8 rounded-xl transition-all duration-300"
            >
              <span>צפה בעבודות שלנו</span>
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in animate-delay-400">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Rocket className="text-primary" size={20} />
                </div>
                <h3 className="font-bold">מהירות ביצוע</h3>
              </div>
              <p className="text-gray-400">דף נחיתה מוכן תוך 5-7 ימי עסקים</p>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Smartphone className="text-primary" size={20} />
                </div>
                <h3 className="font-bold">התאמה לנייד</h3>
              </div>
              <p className="text-gray-400">עיצוב רספונסיבי לכל המכשירים</p>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Send className="text-primary" size={20} />
                </div>
                <h3 className="font-bold">תמיכה 24/7</h3>
              </div>
              <p className="text-gray-400">ליווי מקצועי לכל אורך הדרך</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;