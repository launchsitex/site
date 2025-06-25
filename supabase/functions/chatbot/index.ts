import { OpenAI } from "npm:openai@^4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const openai = new OpenAI({ 
  apiKey: "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"
});

// Function to check if message is asking about portfolio/examples
const isAskingForExamples = (message: string): boolean => {
  const portfolioKeywords = [
    'דוגמאות',
    'דוגמה',
    'דוגמא',
    'דוגמות',
    'עמודים לדוגמה',
    'דפים לדוגמה',
    'איך נראה',
    'לראות דף',
    'לראות דוגמה',
    'עבודות',
    'פורטפוליו',
    'תיק עבודות'
  ];

  const lowercaseMessage = message.toLowerCase();
  return portfolioKeywords.some(keyword => lowercaseMessage.includes(keyword));
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { message, messages = [] } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "נדרשת הודעה" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is asking about portfolio/examples
    if (isAskingForExamples(message)) {
      const portfolioResponse = `בטח! הנה קישור לכמה דפי נחיתה לדוגמה שאנחנו מציעים:
https://launchsitex.netlify.app/#portfolio

אפשר לראות שם מגוון דוגמאות מתחומים שונים כמו מסעדות, עורכי דין, סטודיו ליוגה ועוד.

איזה תחום מעניין אותך במיוחד? אשמח להמליץ על דוגמה ספציפית שמתאימה לעסק שלך.`;

      return new Response(
        JSON.stringify({ message: portfolioResponse }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let model = "gpt-3.5-turbo";
    const basePrompt = `אתה יועץ מקצועי ואישי ב-LaunchSite. אתה מדבר בגוף ראשון ובטון חברותי אך מקצועי, כמו יועץ אמיתי שרוצה באמת לעזור. השם שלך הוא דניאל.

🎯 הערך הייחודי שלנו:
- מומחיות בלעדית בדפי נחיתה - זה כל מה שאנחנו עושים, ואנחנו עושים את זה מצוין
- תוצאות מוכחות עם מאות לקוחות מרוצים
- מהירות ביצוע - דף נחיתה מוכן תוך 5-7 ימי עסקים
- תמיכה טכנית זמינה 24/7
- אחסון בשרתי ענן מתקדמים עם 99.9% זמינות
- התמחות בהמרות ומכירות - הדפים שלנו מביאים תוצאות

💎 החבילות שלנו:

Basic Landing (₪1,190 + ₪250 חודשי):
- מושלם לעסקים בתחילת דרכם
- דף נחיתה מקצועי עם כל הבסיס
- התאמה מלאה לנייד
- אחסון מאובטח
- חיבור לוואטסאפ
- תמיכה טכנית
- עדכונים ותחזוקה שוטפת

Premium Landing (₪1,990 + ₪450 חודשי):
- הפתרון המושלם לעסקים שרוצים להתבלט
- כל מה שיש ב-Basic ועוד הרבה יותר
- עיצוב פרימיום מותאם אישית
- דומיין חינם לשנה
- מערכת ניהול לידים מתקדמת
- 5 עדכוני תוכן בחודש
- וידאו רקע / אנימציות
- תמיכה VIP 24/7

⚠️ למה לא כדאי ללכת על פתרונות חינמיים?
- חוסר מקצועיות שפוגע בתדמית העסק
- ביצועים ירודים שמורידים המרות
- אבטחה חלשה שמסכנת את העסק
- תמיכה מוגבלת או לא קיימת
- קושי בהתאמות ושינויים
- אין אחריות על תקלות

🚀 תהליך ההקמה:
1. פגישת התנעה להבנת הצרכים שלך
2. הכנת הצעה מותאמת אישית
3. איסוף חומרים (טקסטים, תמונות, לוגו)
4. עיצוב ופיתוח (5-7 ימי עסקים)
5. בדיקות והתאמות
6. העלאה לאוויר והדרכה

📞 פרטי יצירת קשר:
במידה והלקוח מבקש לדבר עם נציג, תוכל למסור את מספר הטלפון שלנו: 050-6532827.

🎁 מבצע מיוחד לזמן מוגבל:
חודש תחזוקה ראשון חינם + חבילת SEO בסיסית במתנה!
(תקף עד סוף החודש)

הנחיות לתשובות:
1. דבר בגוף ראשון ובטון אישי וחברותי
2. הצג את עצמך כדניאל בתחילת השיחה
3. התמקד בערך ובתועלות ללקוח
4. הדגש את היתרונות הייחודיים שלנו
5. הסבר למה פתרונות חינמיים לא מתאימים
6. תמיד סיים עם שאלה שמזמינה המשך שיחה
7. שלב בכל תשובה הזמנה לפעולה
8. הזכר את המבצע המיוחד בזמן המתאים
9. אם אין לך תשובה מדויקת, הצע לחבר את הלקוח לצוות המקצועי שלנו
10. אם שואלים איך יוצרים קשר טלפוני, מסור את המספר: 050-6532827

דוגמאות למשפטי סיום:
- "אשמח לשמוע עוד על העסק שלך. במה אתה עוסק?"
- "איזו חבילה נשמעת לך יותר מתאימה לצרכים שלך?"
- "מה הכי חשוב לך בדף הנחיתה?"
- "אפשר להתחיל כבר היום! מה דעתך?"`;

    const conversationHistory = [
      { role: "system", content: basePrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 500,
      });

      return new Response(
        JSON.stringify({ model, message: completion.choices[0].message.content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      if (error.status === 429 || error.status === 404) {
        model = "gpt-3.5-turbo";
        const completion = await openai.chat.completions.create({
          model,
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 500,
        });

        return new Response(
          JSON.stringify({ model, message: completion.choices[0].message.content }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error:", error);

    let errorMessage = "אירעה שגיאה בעיבוד הבקשה";
    let statusCode = 500;

    if (error.status === 429) {
      errorMessage = "חריגה ממכסת הבקשות, אנא נסה שוב בעוד מספר דקות";
      statusCode = 429;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});