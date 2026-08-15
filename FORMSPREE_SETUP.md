# הגדרת טופס יצירת קשר 📧

הטופס באתר שולח פניות אל **shlomo@mashpro.co.il** באמצעות [Formspree](https://formspree.io).

## למה Formspree?

- ✅ חינמי עד 50 הודעות לחודש (מספיק להתחלה)
- ✅ אין צורך ב-backend או שרת
- ✅ הגנת spam מובנית
- ✅ לוח בקרה לכל הפניות
- ✅ Reply-To אוטומטי לאימייל של הפונה (לחיצה אחת על "השב" באאוטלוק/ג'ימייל)

---

## ⚙️ הגדרה ראשונית (5 דקות)

### שלב 1 — הרשמה ל-Formspree

1. כנס ל-[formspree.io](https://formspree.io)
2. **Get Started Free** → הירשם עם `shlomo@mashpro.co.il`
3. אשר את האימייל שמגיע (חשוב — בלי זה הטופס לא יעבוד)

### שלב 2 — יצירת הטופס

1. בלוח הבקרה לחץ **+ New Form**
2. מלא:
   - **Form name**: `MashPro Contact Form`
   - **Send to**: `shlomo@mashpro.co.il`
3. לחץ **Create Form**
4. תקבל **Form ID** כמו: `xayzgwbp` (8 תווים אקראיים)
5. ה-endpoint המלא יהיה: `https://formspree.io/f/xayzgwbp`

### שלב 3 — חיבור לקוד

ערוך את הקובץ `src/pages/Home.jsx`, חפש את השורה:

```js
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
```

החלף `YOUR_FORM_ID` ב-ID שקיבלת:

```js
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xayzgwbp";
```

שמור, עשה commit ו-push לגיטהאב:

```bash
git add .
git commit -m "feat: חיבור טופס יצירת קשר ל-Formspree"
git push
```

Cloudflare Pages יבנה ויפרסם אוטומטית תוך כדקה.

### שלב 4 — בדיקה

1. כנס ל-`mashpro.co.il` (או ל-`mashpro.pages.dev` בינתיים)
2. גלול למטה לטופס "השאר פרטים לייעוץ חינם"
3. מלא ושלח
4. בדוק את `shlomo@mashpro.co.il` — אמור להגיע מייל תוך כמה שניות

> 📌 **בפעם הראשונה** — Formspree ישלח לך מייל אישור עם כפתור "Allow this form to be submitted" — חייב ללחוץ אחרת הטופס יציג שגיאה.

---

## 📨 איך נראית פנייה במייל?

```
מאת:  Formspree <no-reply@formspree.io>
אל:   shlomo@mashpro.co.il
נושא: פנייה חדשה מהאתר — ישראל ישראלי
Reply-To: israel@example.com   ← אימייל הפונה

────────────────────────────────────────
firstName:   ישראל
lastName:    ישראלי
phone:       050-1234567
email:       israel@example.com
service:     מיחזור משכנתא
amount:      1,200,000
notes:       מעוניין במידע נוסף...
```

לחיצה אחת על **השב** באאוטלוק/ג'ימייל תכתוב ישירות לפונה.

---

## 🔧 הגדרות מומלצות ב-Formspree

לוח הבקרה של הטופס → **Settings**:

### Notifications
- ✅ **Email notifications**: ON
- ✅ **Notify me at**: `shlomo@mashpro.co.il`
- אופציונלי: הוסף עוד מיילים (יועצים נוספים)

### Spam protection
- ✅ **Akismet** (מובנה, חינם)
- ✅ **reCAPTCHA** (אם מקבלים הרבה spam — מוסיף "I'm not a robot")

### Auto-response (תגובה אוטומטית לפונה)
- **Subject**: `קיבלנו את הפנייה שלך - משכנתאPRO`
- **Body**:
  ```
  שלום,
  קיבלנו את פנייתך. יועץ מקצועי יחזור אליך תוך שעה בשעות העבודה.
  
  שעות פעילות:
  א'-ה' 08:00-19:00
  ו' 08:00-13:00
  
  בברכה,
  צוות מashpro
  ```

---

## 💰 מתי לשדרג?

תוכנית חינמית של Formspree מספיקה בדרך כלל לאתר התחלתי:

| תוכנית | פניות/חודש | מחיר |
|---|---|---|
| **Free** | 50 | ₪0 |
| Basic | 100 | $10/חודש |
| Professional | 1,000 | $25/חודש |

מעבר ל-50 פניות בחודש — שווה לשדרג ל-Basic.

---

## ⚠️ פתרון תקלות נפוצות

### "הטופס נשלח אבל לא מגיע מייל"
- בדוק spam ב-Gmail/Outlook
- ודא שלחצת על "Allow this form" במייל האישור הראשוני של Formspree
- בדוק ב-Formspree dashboard → Submissions שהפנייה נרשמה

### "Error 422" בקונסול
- ה-Form ID לא נכון
- בדוק שהחלפת את `YOUR_FORM_ID` ב-ID האמיתי

### "Error 429" בקונסול
- חרגת מ-50 פניות החודש
- שדרג תוכנית או חכה לחודש הבא
