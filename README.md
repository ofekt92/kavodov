# משכנתא PRO 🏠

אפליקציית React עם שני עמודים: דף בית מלא ומחשבוני משכנתא מקצועיים.

## 📑 עמודים

### 🏠 דף בית
- Hero עם מחשבון מהיר
- חוקרי לקוחות (3,200+, 12 שנים, 97% שביעות רצון)
- 6 שירותים — דירה ראשונה, מיחזור, בנייה עצמית, השקעה, ועוד
- "למה משכנתאPRO?" — 4 יתרונות + תצוגת ריביות בנקים
- תהליך עבודה ב-4 שלבים
- 3 המלצות לקוחות
- טופס ליצירת קשר עם הודעת הצלחה (Toast)

### 🧮 מחשבונים (`#/calculators`)
| כרטיסייה | תיאור |
|---|---|
| 🏠 תשלום חודשי | חישוב החזר חודשי לפי סכום, ריבית ותקופה |
| 🔄 כדאיות מיחזור | האם כדאי למחזר? חיסכון ונקודת איזון |
| 💰 כושר השתכרות | כמה משכנתא ניתן לקחת לפי ההכנסה |
| 📊 לוח סילוקין | פירוט חודשי/שנתי של קרן וריבית |
| 🧮 תמהיל מסלולים | בניית שילוב של עד 3 מסלולי ריבית |
| ⚖️ השוואת בנקים | השוואת עד 4 הצעות מבנקים שונים |

## 🗂️ מבנה הפרויקט

```
mortgage-react/
├── index.html              # נקודת הכניסה ל-Vite
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # render root
    ├── App.jsx             # נתב פשוט בין שני העמודים
    ├── App.css             # עיצוב מלא לשני העמודים
    └── pages/
        ├── Home.jsx        # דף בית
        └── Calculators.jsx # 6 מחשבוני משכנתא
```

## 🔀 ניווט בין דפים

הניווט מבוסס על אירוע מותאם:

```js
window.dispatchEvent(new CustomEvent("app:navigate", {
  detail: { page: "home" | "calculators", anchor: "contact" }
}));
```

`App.jsx` מאזין לאירוע, מעדכן את הדף וגוללת לעוגן הרצוי.

## 🚀 התקנה והפעלה

```bash
npm install
npm run dev        # פיתוח — http://localhost:5173
npm run build      # בנייה לייצור (dist/)
npm run preview    # תצוגה מקדימה של ה-build
```

## 🌐 פריסה ל-GitHub Pages

```bash
npm run build
# העלה את תיקיית dist/ ל-GitHub Pages
```

או עם החבילה `gh-pages`:
```bash
npm install --save-dev gh-pages
# הוסף ל-package.json:
#   "homepage": "https://<USER>.github.io/<REPO>"
#   "deploy":   "gh-pages -d dist"
npm run deploy
```

## 🛠️ טכנולוגיות

- **React 18** — קומפוננטות פונקציונליות + Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- **Vite 5** — bundler מהיר לפיתוח וייצור
- **CSS Variables** — ערכת עיצוב מאוחדת (gold/navy/cream)
- **Heebo** — גופן עברי מגוגל פונטס
- **0 תלויות UI חיצוניות** — לא Material UI, לא Tailwind, לא React Router

## 📝 רישיון

MIT
