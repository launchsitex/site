# LaunchSite - מערכת בניית דפי נחיתה

מערכת מקצועית לבניית דפי נחיתה עם פאנל ניהול מתקדם, מותאמת לפריסה על VPS.

## 🚀 תכונות עיקריות

- **דף נחיתה מקצועי** - עיצוב מודרני ורספונסיבי
- **פאנל ניהול מתקדם** - ניהול פניות, עסקאות וניתוח נתונים
- **מסד נתונים PostgreSQL** - אחסון מאובטח ויעיל
- **מערכת CMS** - ניהול תוכן דינמי
- **ניתוח תנועה** - מעקב ביקורים וסטטיסטיקות
- **ניהול עסקאות** - מעקב אחר לקוחות ומכירות

## 📋 דרישות מערכת

- Node.js 18+
- PostgreSQL 12+
- Docker (אופציונלי)

## 🛠️ התקנה מקומית

1. **שכפול הפרויקט:**
```bash
git clone <repository-url>
cd launchsite
```

2. **התקנת תלויות:**
```bash
npm install
```

3. **הגדרת משתני סביבה:**
```bash
cp .env.example .env
# ערוך את קובץ .env עם פרטי מסד הנתונים שלך
```

4. **אתחול מסד הנתונים:**
```bash
npm run db:init
```

5. **הרצת המערכת:**
```bash
npm run dev
```

## 🐳 פריסה עם Docker

1. **בניית התמונה:**
```bash
docker build -t launchsite .
```

2. **הרצה עם Docker Compose:**
```bash
docker-compose up -d
```

## ☁️ פריסה ב-Coolify

1. **הגדרת משתני סביבה ב-Coolify:**
```env
VITE_DATABASE_URL=postgres://quickjob:Pinokio590@@asgqcks08k8cosssk0kcwvk4:5432/postgres
VITE_DB_HOST=asgqcks08k8cosssk0kcwvk4
VITE_DB_PORT=5432
VITE_DB_NAME=postgres
VITE_DB_USER=quickjob
VITE_DB_PASSWORD=Pinokio590@@
```

2. **הגדרות Build:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Port: 80

3. **אתחול מסד הנתונים:**
```bash
npm run db:init
```

## 🔐 פרטי התחברות למנהל

- **אימייל:** admin@launchsite.com
- **סיסמה:** admin123
- ⚠️ **שנה את הסיסמה מיד לאחר הכניסה הראשונה!**

## 📊 מבנה מסד הנתונים

- `contact_forms` - פניות לקוחות
- `page_visits` - מעקב ביקורים
- `deals` - ניהול עסקאות
- `admin_users` - משתמשי מנהל
- `site_content` - ניהול תוכן
- `site_media` - קבצי מדיה
- `site_sections` - סקשנים
- `site_navigation` - תפריט ניווט
- `site_settings` - הגדרות כלליות

## 🔧 פקודות שימושיות

```bash
# פיתוח מקומי
npm run dev

# בניית הפרויקט
npm run build

# אתחול מסד הנתונים
npm run db:init

# בדיקת קוד
npm run lint
```

## 📞 תמיכה

לתמיכה טכנית או שאלות, צור קשר:
- אימייל: launchsitex@gmail.com
- וואטסאפ: 050-6532827

## 📄 רישיון

כל הזכויות שמורות © 2025 LaunchSite