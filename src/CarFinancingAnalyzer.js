import React, { useState } from 'react';
import './CarFinancingAnalyzer.css';

const occupations = [
  'עורך דין', 'רופא', 'מהנדס', 'מורה', 'איש מכירות', 'אמן', 'מנהל פרויקטים',
  'יועץ פיננסי', 'פסיכולוג', 'יזם', 'שף', 'ספורטאי', 'מתכנת', 'מעצב גרפי', 'חשבונאי',
  'אדריכל', 'עיתונאי', 'טייס', 'שוטר', 'מוזיקאי'
];

const carTypes = ['ספורט', 'פנאי', 'שטח', 'פרייבט', 'מיני', 'ג\'יפ', 'משפחתי', 'יוקרה'];

const occupationStyles = {
  'עורך דין': { 
    personality: 'אנליטי',
    approach: 'פורמלי ומדויק',
    carRecommendation: 'יוקרה',
    nlpApproach: 'הצגת עובדות ונתונים מדויקים',
    preferredAddress: 'עו"ד',
    keyPoints: ['סטטוס', 'אמינות', 'בטיחות', 'טכנולוגיה מתקדמת'],
    sellingStrategy: 'הדגש את היוקרה והסטטוס שהרכב מביא, תוך מתן נתונים מדויקים על ביצועים ובטיחות.'
  },
  'רופא': { 
    personality: 'אמפתי',
    approach: 'מקצועי ואכפתי',
    carRecommendation: 'פנאי',
    nlpApproach: 'שימוש במטאפורות רפואיות',
    preferredAddress: 'דוקטור',
    keyPoints: ['בטיחות', 'נוחות', 'אמינות', 'טכנולוגיה רפואית מתקדמת'],
    sellingStrategy: 'התמקד בבטיחות ובנוחות, השווה מערכות הרכב למערכות רפואיות מתקדמות.'
  },
  'מהנדס': { 
    personality: 'אנליטי',
    approach: 'טכני ומדויק',
    carRecommendation: 'ספורט',
    nlpApproach: 'התמקדות בפרטים טכניים ויעילות',
    preferredAddress: 'מהנדס',
    keyPoints: ['חדשנות טכנולוגית', 'יעילות', 'ביצועים', 'תכנון מתקדם'],
    sellingStrategy: 'הצג נתונים טכניים מפורטים, הדגש את החדשנות ההנדסית ברכב.'
  },
  'מורה': {
    personality: 'אמפתי',
    approach: 'סבלני ומעודד',
    carRecommendation: 'משפחתי',
    nlpApproach: 'שימוש במטאפורות חינוכיות',
    preferredAddress: 'מורה',
    keyPoints: ['בטיחות משפחתית', 'מרחב', 'חסכוניות', 'נוחות'],
    sellingStrategy: 'הדגש את התאמת הרכב לצרכי משפחה ולהובלת ציוד לבית הספר, התמקד בבטיחות ובנוחות.'
  },
  'איש מכירות': {
    personality: 'נמרץ',
    approach: 'תוסס ומשכנע',
    carRecommendation: 'פרייבט',
    nlpApproach: 'שימוש בשפה של הצלחה ומכירות',
    preferredAddress: 'איש המכירות המצליח',
    keyPoints: ['תדמית', 'נוחות בנסיעות ארוכות', 'חיסכון בדלק', 'טכנולוגיה חכמה'],
    sellingStrategy: 'הדגש כיצד הרכב יכול לשפר את תדמית המכירות ולהגדיל את ההצלחה בעסקים.'
  },
  'אמן': {
    personality: 'יצירתי',
    approach: 'פתוח ומעורר השראה',
    carRecommendation: 'מיני',
    nlpApproach: 'שימוש בדימויים ומטאפורות אמנותיות',
    preferredAddress: 'אמן',
    keyPoints: ['עיצוב ייחודי', 'צבעים מיוחדים', 'התאמה אישית', 'חדשנות'],
    sellingStrategy: 'הצג את הרכב כיצירת אמנות, הדגש אפשרויות התאמה אישית ועיצוב ייחודי.'
  },
  'מנהל פרויקטים': {
    personality: 'אנליטי',
    approach: 'מאורגן ויעיל',
    carRecommendation: 'פנאי',
    nlpApproach: 'שימוש במונחים של ניהול וארגון',
    preferredAddress: 'מנהל',
    keyPoints: ['יעילות', 'ארגון מרחב', 'טכנולוגיה חכמה', 'חיסכון בזמן'],
    sellingStrategy: 'הדגש כיצד הרכב יכול לסייע בניהול זמן יעיל ובארגון משימות יומיומיות.'
  },
  'יועץ פיננסי': {
    personality: 'אנליטי',
    approach: 'מקצועי ומדויק',
    carRecommendation: 'יוקרה',
    nlpApproach: 'שימוש במונחים פיננסיים והשקעתיים',
    preferredAddress: 'יועץ',
    keyPoints: ['ערך לטווח ארוך', 'יעילות כלכלית', 'השקעה חכמה', 'סטטוס'],
    sellingStrategy: 'הצג את הרכב כהשקעה חכמה, נתח את העלות מול התועלת ואת ערך השמירה לאורך זמן.'
  },
  'פסיכולוג': {
    personality: 'אמפתי',
    approach: 'מקשיב ותומך',
    carRecommendation: 'פרייבט',
    nlpApproach: 'שימוש במונחים רגשיים ופסיכולוגיים',
    preferredAddress: 'דוקטור',
    keyPoints: ['נוחות נפשית', 'הפחתת לחץ', 'אווירה רגועה', 'בטיחות'],
    sellingStrategy: 'הדגש את היכולת של הרכב ליצור סביבה רגועה ונוחה, התמקד בתכונות המפחיתות לחץ.'
  },
  'יזם': {
    personality: 'נמרץ',
    approach: 'חדשני ונועז',
    carRecommendation: 'ספורט',
    nlpApproach: 'שימוש במונחים של חדשנות והצלחה',
    preferredAddress: 'יזם',
    keyPoints: ['חדשנות', 'טכנולוגיה מתקדמת', 'ביצועים גבוהים', 'תדמית'],
    sellingStrategy: 'הצג את הרכב כסמל לחדשנות והצלחה, הדגש תכונות פורצות דרך וטכנולוגיות חדשניות.'
  },
  'שף': {
    personality: 'יצירתי',
    approach: 'תשוקתי ומדויק',
    carRecommendation: 'פנאי',
    nlpApproach: 'שימוש במטאפורות קולינריות',
    preferredAddress: 'שף',
    keyPoints: ['מרחב אחסון', 'נוחות', 'עיצוב פנים איכותי', 'יעילות'],
    sellingStrategy: 'השווה את הרכב למטבח גורמה, הדגש את המרחב לציוד ואת היכולת להגיע בנוחות לאירועים ולשווקים.'
  },
  'ספורטאי': {
    personality: 'נמרץ',
    approach: 'אנרגטי ותחרותי',
    carRecommendation: 'ספורט',
    nlpApproach: 'שימוש במונחים ספורטיביים ותחרותיים',
    preferredAddress: 'אלוף',
    keyPoints: ['ביצועים גבוהים', 'זריזות', 'עיצוב אירודינמי', 'טכנולוגיה מתקדמת'],
    sellingStrategy: 'הצג את הרכב כמכונת ביצועים, הדגש את היכולות הספורטיביות ואת ההתאמה לאורח חיים אתלטי.'
  },
  'מתכנת': {
    personality: 'אנליטי',
    approach: 'לוגי ומדויק',
    carRecommendation: 'פרייבט',
    nlpApproach: 'שימוש במונחים טכנולוגיים ולוגיים',
    preferredAddress: 'מפתח',
    keyPoints: ['טכנולוגיה חכמה', 'קישוריות', 'יעילות', 'חדשנות'],
    sellingStrategy: 'התמקד במערכות הטכנולוגיות המתקדמות של הרכב, הדגש את הקישוריות ואת היכולות החכמות.'
  },
  'מעצב גרפי': {
    personality: 'יצירתי',
    approach: 'ויזואלי ואסתטי',
    carRecommendation: 'מיני',
    nlpApproach: 'שימוש בדימויים ומונחים ויזואליים',
    preferredAddress: 'מעצב',
    keyPoints: ['עיצוב ייחודי', 'צבעים מרהיבים', 'קווים נקיים', 'התאמה אישית'],
    sellingStrategy: 'הצג את הרכב כיצירת אמנות ויזואלית, הדגש את העיצוב הייחודי ואת אפשרויות ההתאמה האישית.'
  },
  'חשבונאי': {
    personality: 'אנליטי',
    approach: 'מדויק וזהיר',
    carRecommendation: 'פרייבט',
    nlpApproach: 'שימוש במונחים פיננסיים וחשבונאיים',
    preferredAddress: 'רואה חשבון',
    keyPoints: ['יעילות כלכלית', 'חיסכון בדלק', 'עלות תחזוקה נמוכה', 'ערך שמירה גבוה'],
    sellingStrategy: 'הצג ניתוח מפורט של עלויות ותועלות, הדגש את היעילות הכלכלית ואת החיסכון לטווח ארוך.'
  },
  'אדריכל': {
    personality: 'יצירתי',
    approach: 'חזוני ומדויק',
    carRecommendation: 'יוקרה',
    nlpApproach: 'שימוש במונחים ארכיטקטוניים ועיצוביים',
    preferredAddress: 'אדריכל',
    keyPoints: ['עיצוב מרשים', 'חללים מתוכננים היטב', 'חומרים איכותיים', 'חדשנות'],
    sellingStrategy: 'הצג את הרכב כיצירת מופת ארכיטקטונית, התמקד בתכנון החללים ובאיכות החומרים.'
  },
  'עיתונאי': {
    personality: 'נמרץ',
    approach: 'סקרן ומתעניין',
    carRecommendation: 'פנאי',
    nlpApproach: 'שימוש בסיפורים ואנקדוטות',
    preferredAddress: 'עיתונאי',
    keyPoints: ['גמישות', 'נוחות בנסיעות ארוכות', 'טכנולוגיה מתקדמת', 'חיסכון בדלק'],
    sellingStrategy: 'ספר סיפור על הרכב, הדגש את יכולתו לתמוך בעבודה העיתונאית ובנסיעות תכופות.'
  },
  'טייס': {
    personality: 'אנליטי',
    approach: 'מדויק ואחראי',
    carRecommendation: 'יוקרה',
    nlpApproach: 'שימוש במונחים אווירונאוטיים',
    preferredAddress: 'קפטן',
    keyPoints: ['טכנולוגיה מתקדמת', 'בטיחות', 'נוחות', 'ביצועים גבוהים'],
sellingStrategy: 'השווה את מערכות הרכב למערכות בתא הטייס, הדגש את הבטיחות והטכנולוגיה המתקדמת.'
  },
  'שוטר': {
    personality: 'נמרץ',
    approach: 'סמכותי ואחראי',
    carRecommendation: 'שטח',
    nlpApproach: 'שימוש במונחים של אכיפת חוק ובטיחות',
    preferredAddress: 'קצין',
    keyPoints: ['אמינות', 'ביצועים בכל תנאי שטח', 'בטיחות מתקדמת', 'נוחות'],
    sellingStrategy: 'הדגש את היכולת של הרכב לעמוד בדרישות התפקיד, התמקד באמינות ובביצועים בתנאי שטח.'
  },
  'מוזיקאי': {
    personality: 'יצירתי',
    approach: 'רגיש ואמנותי',
    carRecommendation: 'מיני',
    nlpApproach: 'שימוש במטאפורות מוזיקליות',
    preferredAddress: 'אמן',
    keyPoints: ['מערכת שמע איכותית', 'עיצוב ייחודי', 'נוחות בהובלת ציוד', 'חסכוניות'],
    sellingStrategy: 'השווה את הרכב לכלי נגינה מושלם, הדגש את מערכת השמע ואת הנוחות בהובלת ציוד מוזיקלי.'
  }
};

const topSellingCars2024 = {
  'ספורט': ['טויוטה סופרה', 'פורד מוסטנג', 'מאזדה MX-5'],
  'פנאי': ['קיה ספורטאז\'', 'יונדאי טוסון', 'סקודה קארוק'],
  'שטח': ['טויוטה לנד קרוזר', 'ג\'יפ רנגלר', 'פורד ברונקו'],
  'פרייבט': ['סקודה אוקטביה', 'טויוטה קורולה', 'יונדאי i30'],
  'מיני': ['קיה פיקנטו', 'יונדאי i10', 'סוזוקי סוויפט'],
  'ג\'יפ': ['טויוטה RAV4', 'קיה סורנטו', 'יונדאי סנטה פה'],
  'משפחתי': ['קיה קארנס', 'פולקסווגן טוראן', 'סיאט אלהמברה'],
  'יוקרה': ['מרצדס E-Class', 'BMW סדרה 5', 'אאודי A6']
};

const CarFinancingConversationAnalyzer = () => {
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [carType, setCarType] = useState('');
  const [childrenUnder18, setChildrenUnder18] = useState('');
  const [salary, setSalary] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [drivingExperience, setDrivingExperience] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const getPersonalizedOpening = (style, occupation) => {
    switch (style.personality) {
      case 'אנליטי':
        return `${style.preferredAddress}, בוא נבחן את הנתונים. כ${occupation} מצליח, אתה בוודאי מעריך מידע מדויק ומפורט. האם תסכים איתי שבחירת רכב היא החלטה שדורשת ניתוח מעמיק?`;
      case 'אמפתי':
        return `${style.preferredAddress}, איך אתה מרגיש היום? כ${occupation}, אני בטוח שאתה מבין את החשיבות של תחושה נוחה ובטוחה. האם תסכים איתי שהרכב שלך צריך לתת לך תחושה כזו?`;
      case 'נמרץ':
        return `היי ${style.preferredAddress}! מוכן להתרגש? כ${occupation} דינמי, אתה בוודאי מחפש רכב שיתאים לקצב החיים המהיר שלך. האם אתה מסכים שהרכב שלך צריך להיות מרגש כמו החיים שלך?`;
      case 'יצירתי':
        return `${style.preferredAddress}, בוא נחשוב מחוץ לקופסה! כ${occupation} יצירתי, אתה בוודאי מחפש רכב שיבטא את הייחודיות שלך. האם תסכים איתי שהרכב שלך צריך להיות יצירת אמנות על גלגלים?`;
      default:
        return `שלום ${style.preferredAddress}, נעים להכיר! כ${occupation}, אני בטוח שאתה מחפש רכב שיענה על הצרכים הייחודיים שלך. האם תסכים איתי שחשוב למצוא את ההתאמה המושלמת?`;
    }
  };

  const getPersonalizedCarPresentation = (style, recommendedCars, carType) => {
    const carFeatures = {
      'ספורט': 'ביצועים מרשימים, עיצוב אווירודינמי, וטכנולוגיה מתקדמת',
      'פנאי': 'נוחות מרבית, מרחב פנימי גדול, וצריכת דלק יעילה',
      'שטח': 'יכולות off-road מרשימות, עמידות גבוהה, ומערכות בטיחות מתקדמות',
      'פרייבט': 'אמינות גבוהה, נוחות נהיגה, וחסכוניות בצריכת דלק',
      'מיני': 'קלות תמרון בעיר, חניה קלה, וחסכוניות מרבית',
      'ג\'יפ': 'מרחב פנימי גדול, יכולות שטח, ותחושת ביטחון בנהיגה',
      'משפחתי': 'מרחב גדול לכל המשפחה, בטיחות מתקדמת, ונוחות מקסימלית',
      'יוקרה': 'פאר ויוקרה, טכנולוגיה חדשנית, וביצועים יוצאי דופן'
    };

    return `
      בהתחשב בצרכים הייחודיים שלך כ${style.preferredAddress}, הייתי ממליץ על רכב ${carType}. 
      הנה שלושה מודלים מובילים שאני חושב שיתאימו לך במיוחד:

      1. ${recommendedCars[0]}
      2. ${recommendedCars[1]}
      3. ${recommendedCars[2]}

      כל אחד מהרכבים האלה מציע ${carFeatures[carType]}. 
      ${style.keyPoints.map(point => `ה${recommendedCars[0]} מצטיין במיוחד ב${point}, שאני יודע שחשוב לך כ${style.preferredAddress}.`).join(' ')}

      האם אתה מסכים איתי שאלו תכונות שיכולות לשפר משמעותית את החוויה שלך כ${style.preferredAddress}?
    `;
  };

  const getFinancingOptions = (salary, creditScore, occupation, style) => {
    const maxMonthlyPayment = salary * 0.15;
    const baseInterestRate = 6;
    const creditScoreAdjustment = (creditScore - 650) / 100;
    const adjustedInterestRate = Math.max(3, baseInterestRate - creditScoreAdjustment).toFixed(2);

    return `
      ${style.preferredAddress}, בהתחשב במשכורת שלך ובדירוג האשראי שלך, אני יכול להציע לך מסלול מימון אטרקטיבי במיוחד.

      - תשלום חודשי מקסימלי: ${maxMonthlyPayment.toFixed(2)} ש"ח
      - ריבית שנתית: ${adjustedInterestRate}%
      - תקופת מימון: עד 84 חודשים

      האם תסכים איתי ש${style.preferredAddress} מצליח כמוך ראוי לתנאי מימון מועדפים כאלה?

      ${style.nlpApproach === 'שימוש במונחים פיננסיים והשקעתיים' ? 
        `חשוב לציין שרכישת רכב כזה היא לא רק הוצאה, אלא גם השקעה בנוחות, יעילות, ותדמית מקצועית.` :
        `מסלול זה מאפשר לך ליהנות מרכב חדש ואיכותי תוך שמירה על תזרים מזומנים יציב.`}
    `;
  };

  const getPersonalizedClosing = (style) => {
    switch (style.personality) {
      case 'אנליטי':
        return `${style.preferredAddress}, לאור כל הנתונים שהצגנו, האם אתה מסכים שהגיוני לקבוע פגישה היום כדי לבחון את האפשרויות מקרוב?`;
      case 'אמפתי':
        return `${style.preferredAddress}, אני מרגיש שמצאנו כאן התאמה מצוינת לצרכים שלך. האם תסכים איתי שכדאי לחוות את הרכב הזה באופן אישי עוד היום?`;
      case 'נמרץ':
        return `${style.preferredAddress}, אני יודע שאתה אדם של פעולה. האם אתה מסכים שהצעד הבא הוא לקפוץ לסוכנות עוד היום ולהרגיש את ההתרגשות בעצמך?`;
      case 'יצירתי':
        return `${style.preferredAddress}, דמיין את עצמך נוהג ברכב הזה כבר מחר. נשמע מרגש, נכון? אז למה לא להפוך את זה למציאות עוד היום?`;
      default:
        return `${style.preferredAddress}, לאור כל מה שדיברנו, האם אתה מסכים שהגיוני לקבוע פגישה היום כדי להתקדם לשלב הבא?`;
    }
  };

  const analyzeAndCreateScript = () => {
    if (!occupation || !carType || !age || !salary || !creditScore || !drivingExperience) {
      alert('נא למלא את כל השדות');
      return;
    }

    const style = occupationStyles[occupation];
    const ageGroup = age < 35 ? 'צעיר' : age < 55 ? 'בוגר' : 'מבוגר';
    const numChildren = parseInt(childrenUnder18) || 0;
    const recommendedSeats = numChildren + 2 <= 5 ? 5 : 7;
    const recommendedCars = topSellingCars2024[carType];

    const conversationScript = `
      ${getPersonalizedOpening(style, occupation)}

      ${getPersonalizedCarPresentation(style, recommendedCars, carType)}

      ${numChildren > 0 ? 
        `כ${occupation} עם ${numChildren} ילדים, אתה בוודאי מבין את החשיבות של מרחב ובטיחות. האם תסכים איתי שרכב עם ${recommendedSeats} מושבים כמו ה${recommendedCars[0]} יהיה אידיאלי למשפחה שלך?` :
        `כ${occupation} ${ageGroup}, אתה זקוק לרכב שמשלב ${style.keyPoints.join(', ')}. האם אתה מסכים שה${recommendedCars[0]} מציע את השילוב המושלם הזה?`
      }

      ${getFinancingOptions(salary, creditScore, occupation, style)}

      בהתחשב בניסיון הנהיגה שלך של ${drivingExperience} שנים, אני בטוח שתעריך את ${style.keyPoints[0]} וה${style.keyPoints[1]} של ה${recommendedCars[0]}. האם אתה מסכים שאלו תכונות חשובות עבורך?

      ${style.sellingStrategy}

      ${getPersonalizedClosing(style)}

      אני יכול לתאם לך פגישה עם אחד הנציגים הטובים ביותר שלנו עוד היום. האם 14:00 מתאים לך?
    `;

    setAnalysis({ style: style.approach, conversationScript });
  };

  return (
    <div className="analyzer-container">
      <h1>מנתח שיחת מימון ומכירת רכב מתקדם</h1>
      <div className="input-group">
        <input 
          type="number" 
          placeholder="גיל" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
        />
        <select 
          value={occupation} 
          onChange={(e) => setOccupation(e.target.value)}
        >
          <option value="">בחר מקצוע</option>
          {occupations.map(occ => <option key={occ} value={occ}>{occ}</option>)}
        </select>
        <select 
          value={carType} 
          onChange={(e) => setCarType(e.target.value)}
        >
          <option value="">בחר סוג רכב</option>
          {carTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <input 
          type="number" 
          placeholder="מספר ילדים מתחת לגיל 18" 
          value={childrenUnder18} 
          onChange={(e) => setChildrenUnder18(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="משכורת חודשית" 
          value={salary} 
          onChange={(e) => setSalary(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="דירוג אשראי" 
          value={creditScore} 
          onChange={(e) => setCreditScore(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="שנות ניסיון בנהיגה" 
          value={drivingExperience} 
          onChange={(e) => setDrivingExperience(e.target.value)} 
        />
      </div>
      <button onClick={analyzeAndCreateScript}>צור תסריט שיחה מתקדם</button>
      {analysis && (
        <div className="analysis-result">
          <h3>סגנון שיחה מומלץ:</h3>
          <p>{analysis.style}</p>
          <h3>תסריט שיחה מפורט:</h3>
          <pre>{analysis.conversationScript}</pre>
        </div>
      )}
    </div>
  );
};


export default CarFinancingConversationAnalyzer;

