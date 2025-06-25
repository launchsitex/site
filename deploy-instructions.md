# 🚀 הוראות פריסה מלאות ל-Coolify

## 🔧 פתרון בעיית Docker

השגיאה `No such container: foo44ggwcg44ckcg8wggog88` מתרחשת כי:
1. Container זה לא קיים יותר
2. יש בעיה בהגדרות Docker

### פתרון מהיר:
```bash
# נקה את כל ה-containers הישנים
docker system prune -f

# בדוק שאין containers רצים
docker ps -a

# אם יש containers תקועים, עצור אותם
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

## 📋 צעדים לפריסה ב-Coolify

### 1. הכנת הפרויקט
```bash
# וודא שהכל עובד מקומית
npm install
npm run build

# אתחל את מסד הנתונים
npm run db:init
```

### 2. העלאה ל-Git Repository
```bash
git add .
git commit -m "Ready for Coolify deployment"
git push origin main
```

### 3. הגדרת Coolify

#### א. יצירת פרויקט חדש
- לך ל-Coolify Dashboard
- לחץ על "New Resource"
- בחר "Application"
- חבר את ה-Git Repository

#### ב. הגדרות Build
```
Build Command: npm run build
Output Directory: dist
Port: 80
```

#### ג. משתני סביבה
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

### 4. אתחול מסד הנתונים

לאחר הפריסה הראשונה, הרץ:
```bash
npm run db:init
```

זה ייצור את כל הטבלאות הנדרשות.

### 5. בדיקת התקנה

1. **בדוק שהאתר נטען:** גש לכתובת הדומיין
2. **בדוק טופס יצירת קשר:** שלח טופס ובדוק שהוא נשמר
3. **התחבר לפאנל מנהל:** `/admin/login`
   - אימייל: `admin@launchsite.com`
   - סיסמה: `admin123`
4. **שנה סיסמה:** מיד לאחר הכניסה הראשונה!

## 🔍 פתרון בעיות נפוצות

### בעיית Build
```bash
# נקה cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### בעיית חיבור למסד נתונים
```bash
# בדוק חיבור ישיר
psql postgres://quickjob:Pinokio590@@asgqcks08k8cosssk0kcwvk4:5432/postgres
```

### בעיית הרשאות
- וודא שכל משתני הסביבה מוגדרים נכון ב-Coolify
- בדוק שהסיסמה נכונה (שים לב לתווים מיוחדים)

### בעיית Docker
```bash
# אם יש בעיות Docker, נקה הכל
docker system prune -a -f
docker volume prune -f
```

## 📊 מעקב ובקרה

### לוגים
- עקוב אחר לוגים ב-Coolify Dashboard
- בדוק שאין שגיאות JavaScript בקונסול הדפדפן

### ביצועים
- בדוק זמני טעינה
- וודא שכל התמונות נטענות
- בדוק שהאתר עובד על נייד

### אבטחה
- שנה את סיסמת המנהל מיד!
- עדכן את `VITE_JWT_SECRET` לערך ייחודי
- הגדר HTTPS ב-Coolify

## 🎯 סיכום

המערכת מוכנה לפריסה! עקוב אחר השלבים בסדר הנכון:

1. ✅ נקה Docker containers ישנים
2. ✅ בנה את הפרויקט מקומית
3. ✅ העלה ל-Git
4. ✅ הגדר ב-Coolify
5. ✅ אתחל מסד נתונים
6. ✅ בדוק שהכל עובד
7. ✅ שנה סיסמאות

בהצלחה! 🚀