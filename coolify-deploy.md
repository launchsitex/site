# הוראות פריסה ב-Coolify

## 1. הכנת הפרויקט

### הרצת סקריפט אתחול מסד הנתונים
לפני הפריסה, יש להריץ את הסקריפט לאתחול מסד הנתונים:

```bash
npm run db:init
```

זה ייצור את כל הטבלאות הנדרשות במסד הנתונים PostgreSQL.

## 2. הגדרת משתני סביבה ב-Coolify

בפאנל הניהול של Coolify, הגדר את משתני הסביבה הבאים:

```env
VITE_DATABASE_URL=postgres://quickjob:Pinokio590@@asgqcks08k8cosssk0kcwvk4:5432/postgres
VITE_DB_HOST=asgqcks08k8cosssk0kcwvk4
VITE_DB_PORT=5432
VITE_DB_NAME=postgres
VITE_DB_USER=quickjob
VITE_DB_PASSWORD=Pinokio590@@
VITE_APP_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/api
VITE_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
VITE_WHATSAPP_NUMBER=972000000000
VITE_CONTACT_EMAIL=launchsitex@gmail.com
```

## 3. הגדרת הפרויקט ב-Coolify

1. **סוג הפרויקט**: Static Site / Docker
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Port**: 80 (עבור Nginx)

## 4. פרטי התחברות למנהל

לאחר הפריסה הראשונה:
- **אימייל**: admin@launchsite.com
- **סיסמה**: admin123

⚠️ **חשוב**: שנה את הסיסמה מיד לאחר הכניסה הראשונה!

## 5. בדיקת התקנה

1. גש לאתר הראשי ובדוק שהוא נטען כראוי
2. נסה לשלוח טופס יצירת קשר
3. התחבר לפאנל הניהול ב `/admin/login`
4. בדוק שהנתונים נשמרים במסד הנתונים

## 6. תחזוקה שוטפת

- **גיבויים**: הגדר גיבויים אוטומטיים למסד הנתונים
- **עדכונים**: עדכן את הקוד דרך Git ו-Coolify
- **ניטור**: עקוב אחר לוגים ובעיות דרך פאנל Coolify

## 7. פתרון בעיות נפוצות

### בעיית חיבור למסד נתונים
```bash
# בדוק חיבור למסד הנתונים
psql postgres://quickjob:Pinokio590@@asgqcks08k8cosssk0kcwvk4:5432/postgres
```

### בעיית הרשאות
וודא שמשתני הסביבה מוגדרים נכון ב-Coolify.

### בעיית Build
בדוק שכל התלויות מותקנות:
```bash
npm install
npm run build
```