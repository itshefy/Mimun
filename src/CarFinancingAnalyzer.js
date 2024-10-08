import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from "jspdf";
import DatePicker, { registerLocale } from 'react-datepicker';
import he from 'date-fns/locale/he';
import "react-datepicker/dist/react-datepicker.css";
import './CarFinancingAnalyzer.css';

registerLocale('he', he);

// Constants and Data
const occupations = [
  'מהנדס תוכנה', 'מפתח Full Stack', 'מנהל מוצר', 'מעצב UX/UI', 'מנתח נתונים',
  'מנהל פרויקטים IT', 'ארכיטקט מערכות', 'מומחה אבטחת מידע', 'מפתח אפליקציות',
  'מהנדס DevOps', 'מנהל רשתות', 'מפתח בינה מלאכותית', 'מפתח Blockchain',
  'נציג שירות לקוחות', 'מנהל שירות לקוחות', 'יועץ מכירות', 'מנהל קשרי לקוחות',
  'נציג תמיכה טכנית', 'מנהל חשבונות לקוח', 'מומחה חווית לקוח',
  'רופא', 'אחות', 'רוקח', 'פיזיותרפיסט', 'פסיכולוג', 'רופא שיניים', 'דיאטן',
  'מרפא בעיסוק', 'וטרינר', 'מנתח', 'רדיולוג', 'אופטומטריסט',
  'עורך דין', 'שופט', 'פרקליט', 'נוטריון', 'יועץ משפטי', 'מתמחה במשפטים',
  'מורה', 'מרצה באוניברסיטה', 'גננת', 'מנהל בית ספר', 'יועץ חינוכי',
  'מאמן כושר', 'פיזיולוג ספורט', 'מדריך יוגה', 'תזונאי ספורט', 'שחקן מקצועי',
  'שף', 'קונדיטור', 'סו שף', 'מנהל מסעדה', 'סומלייה', 'ברמן',
  'מהנדס חשמל', 'מהנדס מכונות', 'מהנדס אזרחי', 'מהנדס כימיה', 'מהנדס תעשייה וניהול',
  'אדריכל', 'מעצב פנים', 'מתכנן ערים', 'מעצב נוף', 'מהנדס בניין',
  'עיתונאי', 'צלם', 'עורך וידאו', 'מפיק', 'כתב', 'קריין',
  'טייס', 'דייל', 'מהנדס תעופה', 'בקר טיסה', 'מכונאי מטוסים',
  'מנהל בנק', 'יועץ השקעות', 'אנליסט פיננסי', 'חתם ביטוח', 'סוכן נדל"ן',
  'מדען', 'חוקר', 'ביולוג', 'כימאי', 'פיזיקאי', 'מתמטיקאי',
  'אמן', 'מוזיקאי', 'שחקן', 'רקדן', 'סופר', 'צייר',
  'מנכ"ל', 'סמנכ"ל', 'מנהל משאבי אנוש', 'מנהל שיווק', 'מנהל כספים',
  'יזם', 'משקיע', 'מייסד סטארטאפ', 'אנג\'ל משקיע', 'מנטור עסקי'
];

const carTypes = ['משפחתי', 'יוקרה', 'ספורט', 'שטח', 'מיני', 'חשמלי', 'היברידי', 'מסחרי', 'קבריולט', 'ואן'];

const personalityTraits = {
  'מהנדס תוכנה': ['אנליטי', 'יצירתי', 'פותר בעיות', 'לוגי', 'מדויק'],
  'מפתח Full Stack': ['רב-תחומי', 'גמיש', 'לומד מהר', 'טכנולוגי', 'יצירתי'],
  'מנהל מוצר': ['אסטרטגי', 'תקשורתי', 'מנהיג', 'חדשני', 'אנליטי'],
  'מעצב UX/UI': ['יצירתי', 'אמפתי', 'פרפקציוניסט', 'חדשני', 'תקשורתי'],
  'מנתח נתונים': ['אנליטי', 'סקרן', 'מדייק', 'ביקורתי', 'מתקשר'],
  'מנהל פרויקטים IT': ['מאורגן', 'מנהיג', 'פותר בעיות', 'תקשורתי', 'גמיש'],
  'ארכיטקט מערכות': ['חשיבה מערכתית', 'חדשני', 'אסטרטגי', 'פותר בעיות', 'תקשורתי'],
  'מומחה אבטחת מידע': ['קפדן', 'אנליטי', 'עירני', 'אתי', 'מעודכן'],
  'מפתח אפליקציות': ['יצירתי', 'ממוקד משתמש', 'טכנולוגי', 'פותר בעיות', 'חדשני'],
  'מהנדס DevOps': ['אוטומציה', 'יעילות', 'פותר בעיות', 'תקשורתי', 'גמיש'],
  'מנהל רשתות': ['טכני', 'פותר בעיות', 'מאורגן', 'אחראי', 'תקשורתי'],
  'מפתח בינה מלאכותית': ['חדשני', 'אנליטי', 'סקרן', 'מתמטי', 'יצירתי'],
  'מפתח Blockchain': ['חדשני', 'אבטחתי', 'אנליטי', 'פותר בעיות', 'מעודכן'],
  'נציג שירות לקוחות': ['סבלני', 'אמפתי', 'תקשורתי', 'פותר בעיות', 'חיובי'],
  'מנהל שירות לקוחות': ['מנהיג', 'אמפתי', 'אסטרטגי', 'תקשורתי', 'פותר בעיות'],
  'יועץ מכירות': ['משכנע', 'תקשורתי', 'יוזם', 'אמפתי', 'מוטיבציוני'],
  'מנהל קשרי לקוחות': ['דיפלומטי', 'תקשורתי', 'אסטרטגי', 'אמפתי', 'מנהל יחסים'],
  'נציג תמיכה טכנית': ['סבלני', 'טכני', 'פותר בעיות', 'תקשורתי', 'רגוע'],
  'מנהל חשבונות לקוח': ['מדויק', 'מאורגן', 'תקשורתי', 'אחראי', 'אנליטי'],
  'מומחה חווית לקוח': ['אמפתי', 'חדשני', 'אנליטי', 'תקשורתי', 'יצירתי'],
  'רופא': ['אמפתי', 'מקצועי', 'רגוע', 'מדויק', 'תקשורתי'],
  'אחות': ['אמפתי', 'סבלני', 'מסור', 'תקשורתי', 'רב-משימתי'],
  'רוקח': ['מדויק', 'ידען', 'תקשורתי', 'אחראי', 'שירותי'],
  'פיזיותרפיסט': ['סבלני', 'מוטיבציוני', 'אמפתי', 'מקצועי', 'תקשורתי'],
  'פסיכולוג': ['אמפתי', 'מקשיב', 'אנליטי', 'סבלני', 'אובייקטיבי'],
  'רופא שיניים': ['מדויק', 'סבלני', 'תקשורתי', 'מרגיע', 'מקצועי'],
  'דיאטן': ['מוטיבציוני', 'ידען', 'אמפתי', 'תקשורתי', 'סבלני'],
  'מרפא בעיסוק': ['יצירתי', 'סבלני', 'אמפתי', 'מקצועי', 'מוטיבציוני'],
  'וטרינר': ['אוהב חיות', 'סבלני', 'מקצועי', 'רגוע', 'תקשורתי'],
  'מנתח': ['מדויק', 'רגוע תחת לחץ', 'מקצועי', 'תקשורתי', 'אחראי'],
  'רדיולוג': ['אנליטי', 'מדויק', 'טכנולוגי', 'תקשורתי', 'מקצועי'],
  'אופטומטריסט': ['מדויק', 'סבלני', 'תקשורתי', 'טכני', 'שירותי'],
  'עורך דין': ['אנליטי', 'תקשורתי', 'אתי', 'פותר בעיות', 'משכנע'],
  'שופט': ['אובייקטיבי', 'אנליטי', 'אתי', 'סבלני', 'החלטי'],
  'פרקליט': ['משכנע', 'אנליטי', 'תקשורתי', 'אסטרטגי', 'תחרותי'],
  'נוטריון': ['מדויק', 'אמין', 'אתי', 'תקשורתי', 'מקצועי'],
  'יועץ משפטי': ['אנליטי', 'אסטרטגי', 'תקשורתי', 'אתי', 'דיסקרטי'],
  'מתמחה במשפטים': ['שאפתן', 'חרוץ', 'לומד מהר', 'אנליטי', 'תקשורתי'],
  'מורה': ['סבלני', 'מעורר השראה', 'תקשורתי', 'יצירתי', 'אמפתי'],
  'מרצה באוניברסיטה': ['אנליטי', 'תקשורתי', 'ידען', 'מחקרי', 'מעורר השראה'],
  'גננת': ['סבלני', 'יצירתי', 'אמפתי', 'אנרגטי', 'מטפח'],
  'מנהל בית ספר': ['מנהיג', 'אסטרטגי', 'תקשורתי', 'פותר בעיות', 'מעורר השראה'],
  'יועץ חינוכי': ['אמפתי', 'מקשיב', 'תומך', 'אנליטי', 'תקשורתי'],
  'מאמן כושר': ['מוטיבציוני', 'אנרגטי', 'סבלני', 'תקשורתי', 'מקצועי'],
  'פיזיולוג ספורט': ['אנליטי', 'מקצועי', 'תקשורתי', 'מחקרי', 'מוטיבציוני'],
  'מדריך יוגה': ['רגוע', 'סבלני', 'מעורר השראה', 'תקשורתי', 'אמפתי'],
  'תזונאי ספורט': ['ידען', 'מוטיבציוני', 'אנליטי', 'תקשורתי', 'יצירתי'],
  'שחקן מקצועי': ['תחרותי', 'משמעת עצמית', 'מוטיבציוני', 'עבודת צוות', 'פיזי'],
  'שף': ['יצירתי', 'מדויק', 'עמיד בלחץ', 'מנהיג', 'חושי'],
  'קונדיטור': ['יצירתי', 'מדויק', 'סבלני', 'פרפקציוניסט', 'אסתטי'],
  'סו שף': ['מנהיג', 'יעיל', 'יצירתי', 'עמיד בלחץ', 'עבודת צוות'],
  'מנהל מסעדה': ['מנהיג', 'פותר בעיות', 'תקשורתי', 'יעיל', 'שירותי'],
  'סומלייה': ['חושי', 'ידען', 'תקשורתי', 'שירותי', 'סבלני'],
  'ברמן': ['חברותי', 'יעיל', 'יצירתי', 'רב-משימתי', 'עמיד בלחץ'],
  'מהנדס חשמל': ['אנליטי', 'טכני', 'פותר בעיות', 'יצירתי', 'מדויק'],
  'מהנדס מכונות': ['אנליטי', 'טכני', 'יצירתי', 'פותר בעיות', 'מדויק'],
  'מהנדס אזרחי': ['אנליטי', 'מדויק', 'פרקטי', 'אחראי', 'יצירתי'],
  'מהנדס כימיה': ['אנליטי', 'מדויק', 'סקרן', 'מחקרי', 'בטיחותי'],
  'מהנדס תעשייה וניהול': ['אנליטי', 'יעיל', 'מנהיג', 'פותר בעיות', 'אסטרטגי'],
  'אדריכל': ['יצירתי', 'חזוני', 'טכני', 'אסתטי', 'פרקטי'],
  'מעצב פנים': ['יצירתי', 'אסתטי', 'תקשורתי', 'פרקטי', 'קשוב ללקוח'],
  'מתכנן ערים': ['אסטרטגי', 'חזוני', 'אנליטי', 'סביבתי', 'תקשורתי'],
  'מעצב נוף': ['יצירתי', 'סביבתי', 'טכני', 'אסתטי', 'פרקטי'],
  'מהנדס בניין': ['טכני', 'מדויק', 'אחראי', 'פותר בעיות', 'בטיחותי'],
  'עיתונאי': ['סקרן', 'תקשורתי', 'אנליטי', 'אובייקטיבי', 'יצירתי'],
  'צלם': ['יצירתי', 'טכני', 'סבלני', 'קשוב לפרטים', 'אסתטי'],
  'עורך וידאו': ['יצירתי', 'טכני', 'סבלני', 'קשוב לפרטים', 'חזוני'],
  'מפיק': ['מנהיג', 'יצירתי', 'פותר בעיות', 'תקשורתי', 'אסטרטגי'],
  'כתב': ['סקרן', 'תקשורתי', 'אנליטי', 'יצירתי', 'עמיד בלחץ'],
  'קריין': ['קולי', 'תקשורתי', 'מקצועי', 'רגוע', 'מדויק'],
  'טייס': ['רגוע תחת לחץ', 'מדויק', 'אחראי', 'טכני', 'החלטי'],
  'דייל': ['שירותי', 'סבלני', 'תקשורתי', 'רב-תרבותי', 'רגוע תחת לחץ'],
  'מהנדס תעופה': ['אנליטי', 'טכני', 'חדשני', 'מדויק', 'בטיחותי'],
  'בקר טיסה': ['רגוע תחת לחץ', 'מדויק', 'תקשורתי', 'אחראי', 'ריכוז גבוה'],
  'מכונאי מטוסים': ['טכני', 'מדויק', 'אחראי', 'פותר בעיות', 'בטיחותי'],
  'מנהל בנק': ['אחראי', 'אנליטי', 'תקשורתי', 'אתי', 'מנהיג'],
  'יועץ השקעות': ['אנליטי', 'תקשורתי', 'אתי', 'עדכני', 'אסטרטגי'],
  'אנליסט פיננסי': ['אנליטי', 'מדויק', 'עדכני', 'אסטרטגי', 'תקשורתי'],
  'חתם ביטוח': ['אנליטי', 'מדויק', 'אתי', 'תקשורתי', 'פותר בעיות'],
  'סוכן נדל"ן': ['תקשורתי', 'משכנע', 'יוזם', 'סבלני', 'אסטרטגי'],
  'מדען': ['סקרן', 'אנליטי', 'מדויק', 'מחקרי', 'ביקורתי'],
  'חוקר': ['סקרן', 'אנליטי', 'מתודי', 'סבלני', 'ביקורתי'],
  'ביולוג': ['סקרן', 'מדויק', 'אנליטי', 'סביבתי', 'מחקרי'],
  'כימאי': ['אנליטי', 'מדויק', 'סקרן', 'בטיחותי', 'מחקרי'],
  'פיזיקאי': ['אנליטי', 'מתמטי', 'סקרן', 'תיאורטי', 'מחקרי'],
  'מתמטיקאי': ['אנליטי', 'לוגי', 'מדויק', 'מופשט', 'פותר בעיות'],
  'אמן': ['יצירתי', 'רגיש', 'אקספרסיבי', 'חזוני', 'אינדיבידואליסט'],
  'מוזיקאי': ['יצירתי', 'רגיש', 'מוזיקלי', 'מקצועי', 'תקשורתי'],
  'שחקן': ['אקספרסיבי', 'רגיש', 'גמיש', 'תקשורתי', 'יצירתי'],
  'רקדן': ['אתלטי', 'אקספרסיבי', 'יצירתי', 'משמעת עצמית', 'פיזי'],
  'סופר': ['יצירתי', 'אנליטי', 'סבלני', 'מתבודד', 'רגיש'],
  'צייר': ['יצירתי', 'חזוני', 'סבלני', 'קשוב לפרטים', 'אסתטי'],
  'מנכ"ל': ['מנהיג', 'אסטרטגי', 'החלטי', 'תקשורתי', 'חזוני'],
  'סמנכ"ל': ['מנהיג', 'אסטרטגי', 'תקשורתי', 'יעיל', 'תומך'],
  'מנהל משאבי אנוש': ['אמפתי', 'תקשורתי', 'אסטרטגי', 'פותר בעיות', 'דיפלומטי'],
  'מנהל שיווק': ['יצירתי', 'אסטרטגי', 'תקשורתי', 'אנליטי', 'חדשני'],
  'מנהל כספים': ['אנליטי', 'מדויק', 'אסטרטגי', 'אתי', 'החלטי'],
  'יזם': ['חדשני', 'נוטל סיכונים', 'אסטרטגי', 'גמיש', 'עמיד בלחץ'],
  'משקיע': ['אנליטי', 'אסטרטגי', 'נוטל סיכונים', 'סבלני', 'החלטי'],
  'מייסד סטארטאפ': ['חדשני', 'יזמי', 'עמיד בלחץ', 'גמיש', 'חזוני'],
  'אנג\'ל משקיע': ['אסטרטגי', 'מנטור', 'נוטל סיכונים', 'חזוני', 'מנוסה'],
  'מנטור עסקי': ['מנוסה', 'תקשורתי', 'אסטרטגי', 'אמפתי', 'מעורר השראה']
};

const carDatabase = {
  'משפחתי': {
    'חדש': [
      { name: 'סקודה אוקטביה', features: ['מרווחת', 'חסכונית', 'אמינה', 'בטיחותית', 'תא מטען גדול'], description: 'הסקודה אוקטביה היא בחירה מצוינת למשפחות. היא מציעה שילוב מושלם של מרחב, נוחות וחסכוניות. עם תא מטען ענק ומערכות בטיחות מתקדמות, היא מתאימה לכל צורכי המשפחה.' },
      { name: 'יונדאי i35', features: ['עיצוב מודרני', 'טכנולוגיה מתקדמת', 'נוחות נסיעה', 'חסכונית בדלק', 'אחריות ארוכה'], description: 'יונדאי i35 מביאה עיצוב עדכני וטכנולוגיה חדישה לקטגוריית הרכבים המשפחתיים. היא מצטיינת בנוחות נסיעה ובחסכוניות בדלק, ומגיעה עם אחריות יצרן ארוכה במיוחד.' },
      { name: 'קיה סיד', features: ['איכות בנייה גבוהה', 'מערכות בטיחות מתקדמות', 'נוחות נהיגה', 'עיצוב אירופאי', 'תמורה טובה למחיר'], description: 'הקיה סיד מציעה איכות אירופאית במחיר תחרותי. היא בולטת באיכות הבנייה הגבוהה שלה, במערכות הבטיחות המתקדמות ובנוחות הנהיגה. עיצובה האירופאי מוסיף יוקרה לחבילה כולה.' },
      { name: 'טויוטה קורולה', features: ['אמינות גבוהה', 'ערך שוק גבוה', 'חסכונית בדלק', 'נוחות נסיעה', 'טכנולוגיה יפנית מתקדמת'], description: 'הטויוטה קורולה היא סמל לאמינות וערך שוק גבוה. היא מציעה נסיעה נוחה, חסכונית בדלק ומצוידת בטכנולוגיה יפנית מתקדמת. זוהי בחירה בטוחה למשפחות המחפשות רכב אמין לטווח ארוך.' },
      { name: 'מאזדה 3', features: ['עיצוב ספורטיבי', 'חווית נהיגה מהנה', 'איכות גימור גבוהה', 'מערכות בטיחות מתקדמות', 'צריכת דלק נמוכה'], description: 'מאזדה 3 מביאה רוח ספורטיבית לקטגוריית הרכבים המשפחתיים. היא מציעה חווית נהיגה מהנה, איכות גימור גבוהה ומערכות בטיחות מתקדמות. העיצוב הספורטיבי שלה מושך תשומת לב, בעוד צריכת הדלק הנמוכה חוסכת בהוצאות.' }
    ],
    'משומש': [
      { name: 'פורד פוקוס', features: ['אמינות', 'נוחות נהיגה', 'חלקי חילוף זולים', 'מרווחת', 'חסכונית בדלק'], description: 'הפורד פוקוס היא בחירה מצוינת כרכב משפחתי משומש. היא ידועה באמינותה, נוחות הנהיגה שלה והמרווח הפנימי. חלקי החילוף הזולים והחסכוניות בדלק הופכים אותה לכלכלית לאחזקה.' },
      { name: 'הונדה סיוויק', features: ['אמינות גבוהה', 'ביצועים טובים', 'איכות בנייה', 'ערךשוק גבוה', 'חסכונית'], description: 'הונדה סיוויק היא מכונית אמינה עם ביצועים מרשימים. איכות הבנייה הגבוהה שלה מבטיחה עמידות לאורך זמן, וערך השוק הגבוה שלה הופך אותה להשקעה טובה. בנוסף, היא חסכונית בדלק, מה שמוריד את עלויות התפעול.' },
      { name: 'פיג\'ו 308', features: ['נוחות צרפתית', 'עיצוב אלגנטי', 'תא מטען גדול', 'צריכת דלק נמוכה', 'מערכות בטיחות'], description: 'פיג\'ו 308 מביאה את הנוחות והאלגנטיות הצרפתית לקטגוריית הרכבים המשפחתיים. היא מצטיינת בעיצוב מרשים, תא מטען גדול במיוחד וצריכת דלק נמוכה. מערכות הבטיחות המתקדמות מוסיפות שקט נפשי לנסיעות המשפחתיות.' },
      { name: 'סיאט לאון', features: ['מנועים חזקים', 'עיצוב ספורטיבי', 'טכנולוגיה גרמנית', 'חסכונית', 'נוחה לנהיגה'], description: 'סיאט לאון מציעה את היתרונות של טכנולוגיה גרמנית במחיר תחרותי. היא מצטיינת במנועים חזקים ועיצוב ספורטיבי, תוך שמירה על חסכוניות בדלק. הנוחות בנהיגה הופכת אותה לבחירה מצוינת לנסיעות ארוכות.' },
      { name: 'אופל אסטרה', features: ['אמינות גרמנית', 'נוחות נסיעה', 'מרווחת', 'חסכונית בדלק', 'קלה לתחזוקה'], description: 'האופל אסטרה מביאה את האיכות הגרמנית לקטגוריית המחיר הבינוני. היא ידועה באמינותה, נוחות הנסיעה והמרווח הפנימי. החסכוניות בדלק והתחזוקה הקלה הופכות אותה לבחירה חכמה לטווח הארוך.' }
    ]
  },
  'יוקרה': {
    'חדש': [
      { name: 'מרצדס E-Class', features: ['יוקרה ונוחות', 'טכנולוגיה מתקדמת', 'ביצועים מרשימים', 'בטיחות ברמה גבוהה', 'סטטוס'], description: 'מרצדס E-Class היא התגלמות היוקרה והנוחות. היא מצוידת בטכנולוגיה המתקדמת ביותר, מציעה ביצועים מרשימים ובטיחות ברמה הגבוהה ביותר. זהו רכב שמעניק סטטוס ותחושת פרימיום לכל נסיעה.' },
      { name: 'BMW סדרה 5', features: ['חווית נהיגה ספורטיבית', 'טכנולוגיה חדשנית', 'עיצוב יוקרתי', 'מנועים חזקים', 'נוחות מפנקת'], description: 'BMW סדרה 5 מציעה את השילוב המושלם בין ספורטיביות ליוקרה. היא מצטיינת בחווית נהיגה דינמית, טכנולוגיה חדשנית ועיצוב יוקרתי. המנועים החזקים והנוחות המפנקת הופכים כל נסיעה לחוויה.' },
      { name: 'אאודי A6', features: ['עיצוב מודרני', 'טכנולוגיה מתקדמת', 'איכות בנייה גבוהה', 'נוחות נסיעה', 'ביצועים מרשימים'], description: 'אאודי A6 מביאה עיצוב מודרני וטכנולוגיה מתקדמת לקטגוריית היוקרה. היא בולטת באיכות הבנייה הגבוהה, נוחות הנסיעה וביצועים מרשימים. זהו רכב שמשלב אלגנטיות עם יכולות מרשימות.' },
      { name: 'לקסוס ES', features: ['אמינות יפנית', 'נוחות יוצאת דופן', 'שקט פנימי', 'חסכוני יחסית', 'ערך שוק גבוה'], description: 'לקסוס ES מביאה את האמינות היפנית לעולם היוקרה. היא מצטיינת בנוחות יוצאת דופן ושקט פנימי מרשים. למרות היותה רכב יוקרה, היא יחסית חסכונית בדלק ושומרת על ערך שוק גבוה לאורך זמן.' },
      { name: 'וולוו S90', features: ['בטיחות ברמה הגבוהה ביותר', 'עיצוב סקנדינבי ייחודי', 'איכות פנים גבוהה', 'טכנולוגיה חדשנית', 'נוחות נסיעה'], description: 'וולוו S90 מציגה את הסטנדרט הגבוה ביותר של בטיחות ועיצוב סקנדינבי ייחודי. איכות הפנים הגבוהה והטכנולוגיה החדשנית מעניקות חוויית נהיגה יוצאת דופן. הנוחות בנסיעה הופכת כל מסע לתענוג.' }
    ],
    'משומש': [
      { name: 'ג\'גואר XF', features: ['יוקרה בריטית', 'ביצועים ספורטיביים', 'עיצוב ייחודי', 'נוחות נסיעה', 'טכנולוגיה מתקדמת'], description: 'ג\'גואר XF מביאה את היוקרה הבריטית לכביש. היא משלבת ביצועים ספורטיביים עם עיצוב ייחודי ומרשים. הנוחות בנסיעה והטכנולוגיה המתקדמת הופכים אותה לבחירה מצוינת כרכב יוקרה משומש.' },
      { name: 'אינפיניטי Q50', features: ['עיצוב יפני ייחודי', 'ביצועים חזקים', 'טכנולוגיה מתקדמת', 'נוחות נסיעה', 'נדירות יחסית בכביש'], description: 'אינפיניטי Q50 מציעה עיצוב יפני ייחודי וביצועים חזקים. היא מצוידת בטכנולוגיה מתקדמת ומציעה נוחות נסיעה גבוהה. הנדירות היחסית שלה בכביש מבטיחה בולטות ויוקרה.' },
      { name: 'קאדילק CTS', features: ['יוקרה אמריקאית', 'מנועים חזקים', 'טכנולוגיה מתקדמת', 'נוחות נסיעה', 'עיצוב בולט'], description: 'קאדילק CTS מייצגת את היוקרה האמריקאית במיטבה. היא מצטיינת במנועים חזקים, טכנולוגיה מתקדמת ונוחות נסיעה גבוהה. העיצוב הבולט שלה מבטיח שתמשוך תשומת לב בכל מקום.' },
      { name: 'פורשה פאנאמרה', features: ['ביצועים ספורטיביים', 'יוקרה ברמה גבוהה', 'טכנולוגיה מתקדמת', 'עיצוב ייחודי', 'ארבע דלתות ומרווח'], description: 'פורשה פאנאמרה מציעה את החבילה המושלמת של ביצועים ספורטיביים ויוקרה ברמה גבוהה. היא מצוידת בטכנולוגיה מתקדמת ומציגה עיצוב ייחודי. עם ארבע דלתות ומרווח פנימי נדיב, היא מתאימה גם לשימוש יומיומי.' },
      { name: 'מזראטי גיבלי', features: ['מנוע פרארי', 'עיצוב איטלקי מרהיב', 'סטטוס גבוה', 'ביצועים מרשימים', 'נדירות'], description: 'מזראטי גיבלי מביאה את הקסם האיטלקי לקטגוריית היוקרה. עם מנוע מבית פרארי ועיצוב איטלקי מרהיב, היא מעניקה סטטוס גבוה לבעליה. הביצועים המרשימים והנדירות שלה בכביש הופכים אותה לבחירה ייחודית.' }
    ]
  },
  // ... (המשך מסד הנתונים של הרכבים לשאר הקטגוריות)
};

// Helper Functions
const getPersonalityTraits = (occupation) => {
  return personalityTraits[occupation] || ['גמיש', 'מסתגל', 'יעיל', 'מקצועי', 'אחראי'];
};

const getRecommendedCars = (carType, isNew, personalityTraits) => {
  const condition = isNew ? 'חדש' : 'משומש';
  let cars = carDatabase[carType][condition];
  
  // Sort cars based on how well they match the personality traits
  cars.sort((a, b) => {
    const aScore = a.features.filter(feature => personalityTraits.includes(feature)).length;
    const bScore = b.features.filter(feature => personalityTraits.includes(feature)).length;
    return bScore - aScore;
  });

  return cars;
};

const generatePersonalizedOpening = (firstName, age, occupation) => {
  const openings = [
    `שלום ${firstName}, נעים להכיר! אני מבין שאתה בן ${age}. בוא נמצא יחד את הרכב המושלם שיתאים לסגנון החיים הייחודי שלך.`,
    `היי ${firstName}! תודה שפנית אלינו. בגיל ${age}, אני בטוח שיש לך דרישות מיוחדות מהרכב שלך. בוא נגלה יחד איזה רכב יענה על כל הצרכים שלך.`,
    `ברוך הבא, ${firstName}! מרתק לשמוע על הרקע שלך. בגיל ${age}, אני מניח שאתה מחפש רכב שישלב בין נוחות, ביצועים ופרקטיות. נכון?`,
    `${firstName}, איזה כיף שהגעת אלינו! בגיל ${age}, אני בטוח שיש לך ניסיון חיים מעניין. אשמח לשמוע יותר על הציפיות שלך מהרכב החדש.`,
    `היי ${firstName}, תודה שבחרת בנו! אני מתרגש לעזור לך למצוא את הרכב המושלם. בגיל ${age}, אני מניח שאתה מחפש משהו שבאמת יתאים לסגנון החיים הדינמי שלך.`
  ];

  return openings[Math.floor(Math.random() * openings.length)];
};

const generatePersonalizedCarDescription = (car, personalityTraits) => {
  const descriptions = [
    `ה${car.name} ידוע ב${car.features[0]} וב${car.features[1]} שלו. זה יכול להתאים מצוין למי שמעריך ${personalityTraits[0]} ו${personalityTraits[1]}.`,
    `עבור מי שמחפש ${car.features[2]} ו${car.features[3]}, ה${car.name} יכול להיות בחירה מעולה. זה במיוחד נכון אם ${personalityTraits[2]} חשוב לך.`,
    `ה${car.name} משלב ${car.features[0]} עם ${car.features[4]}. זו יכולה להיות התאמה נהדרת למי שמאופיין ב${personalityTraits[3]} ו${personalityTraits[4]}.`,
    `אם אתה מחפש רכב שמציע ${car.features[1]} ו${car.features[3]}, ה${car.name} יכול להיות בדיוק מה שאתה צריך. זה במיוחד מתאים למי שמעריך ${personalityTraits[0]} ו${personalityTraits[2]}.`,
    `ה${car.name} ידוע בזכות ה${car.features[2]} וה${car.features[4]} שלו. אלו תכונות שיכולות להתאים מאוד למי שמאופיין ב${personalityTraits[1]} ו${personalityTraits[3]}.`
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const generateFinancingBenefits = (firstName, personalityTraits) => {
  let benefits = `
  ${firstName}, הנה כמה אפשרויות מימון שיכולות להתאים לך:

  1. פריסת תשלומים גמישה: אנחנו מציעים פריסה של עד 100 תשלומים. `;
  
  if (personalityTraits.includes('אנליטי') || personalityTraits.includes('מדויק')) {
    benefits += `זה יאפשר לך לתכנן את התקציב שלך בצורה מדויקת ויעילה, תוך התחשבות בתזרים המזומנים שלך לטווח ארוך.`;
  } else if (personalityTraits.includes('יצירתי') || personalityTraits.includes('גמיש')) {
    benefits += `זה נותן לך את החופש להתאים את התשלומים לסגנון החיים הדינמי שלך, עם אפשרות לשינויים לאורך הדרך.`;
  } else {
    benefits += `זה מאפשר לך ליהנות מהרכב תוך שמירה על תזרים מזומנים נוח, בהתאם לצרכים הספציפיים שלך.`;
  }

  benefits += `

  2. תקופת חסד בתחילת ההלוואה: אתה יכול לדחות את התשלום הראשון בעד 3 חודשים. `;
  
  if (personalityTraits.includes('שאפתן') || personalityTraits.includes('יזם')) {
    benefits += `זה יכול לתת לך זמן להשקיע בפרויקטים אחרים או בעסק שלך, ולהגדיל את ההכנסות לפני שמתחילים התשלומים.`;
  } else if (personalityTraits.includes('מעשי') || personalityTraits.includes('זהיר')) {
    benefits += `זה מאפשר לך להתארגן כלכלית ולתכנן את התקציב שלך בצורה מושכלת, תוך התחשבות בהוצאות הנלוות לרכישת רכב.`;
  } else {
    benefits += `זה נותן לך זמן להתרגל לרכב החדש ולהתארגן מבחינה כלכלית, בלי לחץ מיידי של תשלומים.`;
  }

  benefits += `

  3. אפשרות לפירעון מוקדם: אתה יכול לפרוע את ההלוואה בכל שלב. `;
  
  if (personalityTraits.includes('אנליטי') || personalityTraits.includes('אסטרטגי')) {
    benefits += `זה מאפשר לך לנצל הזדמנויות פיננסיות כשהן מגיעות ולחסוך בריבית, תוך אופטימיזציה של המצב הפיננסי שלך.`;
  } else if (personalityTraits.includes('גמיש') || personalityTraits.includes('ספונטני')) {
    benefits += `זה נותן לך את החופש לשנות את התוכניות שלך בהתאם להתפתחויות בחיים, בלי להיות כבול לתוכנית קבועה.`;
  } else {
    benefits += `זה מעניק לך שקט נפשי, כי אתה יודע שיש לך אפשרות לסיים את ההלוואה מתי שתרצה, בהתאם למצבך הכלכלי.`;
  }

  benefits += `

  4. ליווי אישי: הצוות שלנו ילווה אותך לאורך כל התהליך, מהבחירה ועד לאחר הרכישה. `;
  
  if (personalityTraits.includes('אמפתי') || personalityTraits.includes('חברותי')) {
    benefits += `אנחנו מאמינים ביצירת קשר אישי ובהבנת הצרכים הייחודיים של כל לקוח, ונשמח לבנות איתך מערכת יחסים ארוכת טווח.`;
  } else if (personalityTraits.includes('עצמאי') || personalityTraits.includes('ביקורתי')) {
    benefits += `אנחנו כאן לספק לך את כל המידע שתצטרך כדי לקבל החלטה מושכלת, תוך כיבוד העצמאות שלך בתהליך קבלת ההחלטות.`;
  } else {
    benefits += `זה מבטיח שתקבל את התמיכה והמידע הנחוצים בכל שלב בדרך, מההתלבטות הראשונית ועד לטיפולים השוטפים ברכב.`;
  }

  benefits += `

  5. תוכנית Trade-in: אם יש לך רכב ישן, אנחנו יכולים להציע לך עסקת החלפה אטרקטיבית. `;
  
  if (personalityTraits.includes('יעיל') || personalityTraits.includes('מעשי')) {
    benefits += `זה יכול לפשט את כל התהליך ולחסוך לך זמן וטרחה, תוך מקסום הערך של הרכב הנוכחי שלך.`;
  } else if (personalityTraits.includes('חדשני') || personalityTraits.includes('סקרן')) {
    benefits += `זו דרך מצוינת לשדרג את הרכב שלך לדגם חדש יותר עם טכנולוגיה מתקדמת, תוך ניצול הערך שנשאר ברכב הישן.`;
  } else {
    benefits += `זו אפשרות נהדרת להקל על המעבר לרכב החדש שלך, תוך הפחתת העלויות הכוללות של העסקה.`;
  }

  benefits += `

  איך כל זה נשמע לך? האם יש אפשרות מימון ספציפית שמעניינת אותך במיוחד או שאתה רוצה לשמוע עוד פרטים לגביה?`;

  return benefits;
};

const generatePersonalizedClosing = (firstName, personalityTraits) => {
  const closings = [
    `לאור מה שדיברנו, אני חושב שיש לנו כאן כמה אפשרויות מעולות עבורך. מה דעתך שניפגש ונדבר על זה יותר לעומק? אני בטוח שנוכל למצוא את הרכב המושלם שיתאים לאישיות הייחודית שלך.`,
    `תודה שהקדשת מזמנך. אני מרגיש שיש לנו כאן התאמה טובה. בהתחשב בתכונות שלך, אשמח אם נוכל לקבוע פגישה ולהמשיך את השיחה פנים מול פנים. יש לנו עוד הרבה אפשרויות מרתקות לדון בהן.`,
    `נראה שיש לנו כמה אפשרויות מעניינות לבחון. עם הגישה הייחודית שלך, אני בטוח שתעריך את מה שיש לנו להציע. אולי כדאי שנקבע זמן לפגישה בסוכנות? ככה תוכל לראות ולהרגיש את הרכבים בעצמך.`,
    `אני מאמין שמצאנו כמה אפשרויות שיכולות להתאים לך בול. בהתחשב באופי שלך, אני חושב שתהנה לראות את הרכבים מקרוב. מה דעתך לקפוץ אלינו לסוכנות ולהמשיך את השיחה שם?`,
    `אחרי השיחה הזו, אני מרגיש שאנחנו בכיוון הנכון. עם התכונות הייחודיות שלך, אני בטוח שתעריך את תהליך הבחירה המעמיק שלנו. בוא נקבע פגישה בסוכנות, שם נוכל לדבר יותר לעומק ולבחון את האפשרויות מקרוב.`
  ];

  return closings[Math.floor(Math.random() * closings.length)];
};

const generateScript = (firstName, lastName, age, occupation, carType, isNew) => {
  const personalityTraits = getPersonalityTraits(occupation);
  const recommendedCars = getRecommendedCars(carType, isNew, personalityTraits);
  const carCondition = isNew ? 'חדש' : 'משומש באיכות גבוהה';

  const opening = generatePersonalizedOpening(firstName, age, occupation);
  const mainCar = recommendedCars[0];
  const otherCars = recommendedCars.slice(1, 5);

  let script = `
  ${opening}

  בהתחשב במה שסיפרת לי והצרכים שלך, אני חושב שה${mainCar.name} ${carCondition} יכול להיות התאמה מעולה עבורך.
  ${generatePersonalizedCarDescription(mainCar, personalityTraits)}

  ${mainCar.description}

  ${generateFinancingBenefits(firstName, personalityTraits)}

  ${generatePersonalizedClosing(firstName, personalityTraits)}

  אם זה נשמע לך טוב, אני יכול לתאם לך פגישה עם אחד המומחים שלנו עוד היום. יש לנו זמן פנוי ב-14:00 או ב-16:30. מה יותר נוח לך?

  אני כאן לכל שאלה או התלבטות. המטרה שלי היא לעזור לך למצוא את הרכב המושלם, בתנאים שמתאימים בדיוק לך.
  `;

  return script;
};

const CarFinancingConversationAnalyzer = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [carType, setCarType] = useState('');
  const [isNew, setIsNew] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [expandedCar, setExpandedCar] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const occupationInputRef = useRef(null);

  useEffect(() => {
    if (birthdate) {
      const [day, month, year] = birthdate.split('/');
      if (day && month && year) {
        const birth = new Date(year, month - 1, day);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          calculatedAge--;
        }
        setAge(calculatedAge.toString());
      }
    }
  }, [birthdate]);

  const handleBirthdateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setBirthdate(value);
  };

  const handleOccupationChange = (e) => {
    const value = e.target.value;
    setOccupation(value);
    
    if (value.length > 0) {
      const matchingOccupations = occupations.filter(occ => 
        occ.includes(value) && occ !== value
      );
      
      if (matchingOccupations.length > 0) {
        occupationInputRef.current.setAttribute('list', 'occupationList');
      } else {
        occupationInputRef.current.removeAttribute('list');
      }
    } else {
      occupationInputRef.current.removeAttribute('list');
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!firstName.trim()) errors.firstName = 'שם פרטי הוא שדה חובה';
    if (!lastName.trim()) errors.lastName = 'שם משפחה הוא שדה חובה';
    if (!occupation.trim()) errors.occupation = 'מקצוע הוא שדה חובה';
    if (!carType) errors.carType = 'סוג רכב הוא שדה חובה';

    if (birthdate) {
      const calculatedAge = parseInt(age);
      if (calculatedAge < 18 || calculatedAge > 80) {
        errors.birthdate = 'גיל חייב להיות בין 18 ל-80';
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const analyzeAndCreateScript = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulating an asynchronous operation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const script = generateScript(firstName, lastName, parseInt(age) || 30, occupation, carType, isNew);
    
    const personalityTraits = getPersonalityTraits(occupation);
    const recommendedCars = getRecommendedCars(carType, isNew, personalityTraits);
    
    setAnalysis({ 
      conversationScript: script,
      mainCar: recommendedCars[0],
      otherCars: recommendedCars.slice(1, 5)
    });

    setIsLoading(false);};
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setBirthdate(null);
    setAge('');
    setOccupation('');
    setCarType('');
    setIsNew(true);
    setAnalysis(null);
    setExpandedCar(null);
    setErrors({});
  };

  const saveToPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    doc.addFont("assets/fonts/Arial.ttf", "Arial", "normal");
    doc.setFont("Arial");
    doc.setFontSize(12);
    doc.setR2L(true);
    
    const splitText = doc.splitTextToSize(analysis.conversationScript, 180);
    doc.text(splitText, 190, 10, { align: 'right' });
    
    doc.save("car_financing_script.pdf");
  };

  const toggleCarDetails = (carName) => {
    setExpandedCar(expandedCar === carName ? null : carName);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      analyzeAndCreateScript();
    }
  };

 return (
    <div className="analyzer-container">
      <h1>מנתח שיחת מימון ומכירת רכב מתקדם</h1>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="שם פרטי" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)}
          onKeyPress={handleKeyPress}
          className={errors.firstName ? 'error' : ''}
        />
        {errors.firstName && <span className="error-message">{errors.firstName}</span>}

        <input 
          type="text" 
          placeholder="שם משפחה" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)}
          onKeyPress={handleKeyPress}
          className={errors.lastName ? 'error' : ''}
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}

        <input
          type="text"
          placeholder="תאריך לידה (DD/MM/YYYY)"
          value={birthdate}
          onChange={handleBirthdateChange}
          onKeyPress={handleKeyPress}
          className={errors.birthdate ? 'error' : ''}
        />
        {errors.birthdate && <span className="error-message">{errors.birthdate}</span>}

        <input 
          type="text" 
          placeholder="מקצוע" 
          value={occupation} 
          onChange={handleOccupationChange}
          onKeyPress={handleKeyPress}
          ref={occupationInputRef}
          className={errors.occupation ? 'error' : ''}
        />
        {errors.occupation && <span className="error-message">{errors.occupation}</span>}
        <datalist id="occupationList">
          {occupations.filter(occ => occ.includes(occupation) && occ !== occupation).map(occ => (
            <option key={occ} value={occ} />
          ))}
        </datalist>

        <select 
          value={carType} 
          onChange={(e) => setCarType(e.target.value)}
          onKeyPress={handleKeyPress}
          className={errors.carType ? 'error' : ''}
        >
          <option value="">בחר סוג רכב</option>
          {carTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        {errors.carType && <span className="error-message">{errors.carType}</span>}

        <div className="radio-group">
          <label>
            <input 
              type="radio" 
              value="new" 
              checked={isNew} 
              onChange={() => setIsNew(true)} 
            />
            רכב חדש
          </label>
          <label>
            <input 
              type="radio" 
              value="used" 
              checked={!isNew} 
              onChange={() => setIsNew(false)} 
            />
            רכב משומש
          </label>
        </div>
      </div>
      <button onClick={analyzeAndCreateScript} disabled={isLoading}>
        {isLoading ? 'מעבד...' : 'צור תסריט שיחה מתקדם'}
      </button>
      {analysis && (
        <div className="analysis-result">
          <h3>תסריט שיחה מפורט:</h3>
          <pre>{analysis.conversationScript}</pre>
          <h3>רכבים מומלצים:</h3>
          <div className="car-recommendations">
            <div className="main-car">
              <h4>הרכב המומלץ ביותר:</h4>
              <p>{analysis.mainCar.name}</p>
              <ul>
                {analysis.mainCar.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <p>{analysis.mainCar.description}</p>
            </div>
            <div className="other-cars">
              <h4>אפשרויות נוספות:</h4>
              {analysis.otherCars.map((car, index) => (
                <div key={car.name} className="car-option">
                  <p onClick={() => toggleCarDetails(car.name)} style={{cursor: 'pointer'}}>
                    {car.name} {expandedCar === car.name ? '▼' : '►'}
                  </p>
                  {expandedCar === car.name && (
                    <div>
                      <ul>
                        {car.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                      <p>{car.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={saveToPDF}>שמור כ-PDF</button>
          <button onClick={resetForm}>אפס טופס</button>
        </div>
      )}
    </div>
  );
};

export default CarFinancingConversationAnalyzer;