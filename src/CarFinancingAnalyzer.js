import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import './CarFinancingAnalyzer.css';

const occupations = [
  'עורך דין', 'רופא', 'מהנדס', 'מורה', 'איש מכירות', 'אמן', 'מנהל פרויקטים',
  'יועץ פיננסי', 'פסיכולוג', 'יזם', 'שף', 'ספורטאי', 'מתכנת', 'מעצב גרפי', 'חשבונאי',
  'אדריכל', 'עיתונאי', 'טייס', 'שוטר', 'מוזיקאי'
];

const carTypes = ['משפחתי', 'יוקרה', 'ספורט', 'שטח', 'מיני', 'חשמלי'];

const personalityColors = {
  'עורך דין': 'כחול', 'רופא': 'ירוק', 'מהנדס': 'כחול', 'מורה': 'ירוק',
  'איש מכירות': 'אדום', 'אמן': 'צהוב', 'מנהל פרויקטים': 'אדום', 'יועץ פיננסי': 'כחול',
  'פסיכולוג': 'ירוק', 'יזם': 'אדום', 'שף': 'צהוב', 'ספורטאי': 'אדום',
  'מתכנת': 'כחול', 'מעצב גרפי': 'צהוב', 'חשבונאי': 'כחול', 'אדריכל': 'צהוב',
  'עיתונאי': 'אדום', 'טייס': 'כחול', 'שוטר': 'ירוק', 'מוזיקאי': 'צהוב'
};

const carDatabase = {
  'משפחתי': {
    'חדש': ['סקודה אוקטביה', 'יונדאי i35', 'קיה סיד'],
    'משומש': ['מאזדה 3', 'טויוטה קורולה', 'הונדה סיוויק']
  },
  'יוקרה': {
    'חדש': ['מרצדס E-Class', 'BMW סדרה 5', 'אאודי A6'],
    'משומש': ['לקסוס IS', 'וולוו S60', 'ג\'גואר XE']
  },
  'ספורט': {
    'חדש': ['טויוטה סופרה', 'פורשה קאיין', 'אאודי TT'],
    'משומש': ['מאזדה MX-5', 'סובארו BRZ', 'פורד מוסטנג']
  },
  'שטח': {
    'חדש': ['טויוטה לנד קרוזר', 'ג\'יפ רנגלר', 'סוזוקי ג\'ימני'],
    'משומש': ['מיצובישי פאג\'רו', 'ניסאן פטרול', 'איסוזו D-Max']
  },
  'מיני': {
    'חדש': ['קיה פיקנטו', 'יונדאי i10', 'סוזוקי סוויפט'],
    'משומש': ['פיאט 500', 'טויוטה יאריס', 'סיטרואן C1']
  },
  'חשמלי': {
    'חדש': ['טסלה מודל 3', 'יונדאי איוניק 5', 'קיה EV6'],
    'משומש': ['ניסאן ליף', 'רנו זואי', 'BMW i3']
  }
};

const getZodiacSign = (birthdate) => {
  const date = new Date(birthdate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'טלה';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'שור';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'תאומים';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'סרטן';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'אריה';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'בתולה';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'מאזניים';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'עקרב';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'קשת';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'גדי';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'דלי';
  return 'דגים';
};

const getNumerologyValue = (name) => {
  const letterValues = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
  };
  
  let total = 0;
  for (let char of name) {
    total += letterValues[char] || 0;
  }
  
  while (total > 9) {
    total = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  
  return total;
};

const getPersonalityTraits = (color, zodiacSign, numerologyValue) => {
  let traits = [];
  
  switch (color) {
    case 'אדום':
      traits.push('אנרגטי', 'שאפתן', 'תחרותי');
      break;
    case 'צהוב':
      traits.push('יצירתי', 'אופטימי', 'חברותי');
      break;
    case 'ירוק':
      traits.push('אמפתי', 'מסור', 'אחראי');
      break;
    case 'כחול':
      traits.push('אנליטי', 'מדויק', 'אסטרטגי');
      break;
  }
  
  switch (zodiacSign) {
    case 'טלה':
    case 'אריה':
    case 'קשת':
      traits.push('מנהיג', 'נועז');
      break;
    case 'שור':
    case 'בתולה':
    case 'גדי':
      traits.push('יציב', 'מעשי');
      break;
    case 'תאומים':
    case 'מאזניים':
    case 'דלי':
      traits.push('חדשני', 'גמיש');
      break;
    case 'סרטן':
    case 'עקרב':
    case 'דגים':
      traits.push('רגיש', 'אינטואיטיבי');
      break;
  }
  
  switch (numerologyValue) {
    case 1:
    case 9:
      traits.push('עצמאי', 'יצירתי');
      break;
    case 2:
    case 6:
      traits.push('שיתופי', 'הרמוני');
      break;
    case 3:
    case 5:
      traits.push('תקשורתי', 'הרפתקני');
      break;
    case 4:
    case 8:
      traits.push('יציב', 'ארגוני');
      break;
    case 7:
      traits.push('אנליטי', 'פילוסופי');
      break;
  }
  
  return [...new Set(traits)];
};

const getRecommendedCars = (carType, isNew, age) => {
  const condition = isNew ? 'חדש' : 'משומש';
  return carDatabase[carType][condition];
};

const generateScript = (firstName, lastName, birthdate, age, occupation, carType, isNew, personalityColor, zodiacSign, numerologyValue) => {
  const personalityTraits = getPersonalityTraits(personalityColor, zodiacSign, numerologyValue);
  const recommendedCars = getRecommendedCars(carType, isNew, age);
  const ageGroup = age < 35 ? 'צעיר' : age < 55 ? 'בוגר' : 'מבוגר';
  const carCondition = isNew ? 'חדש' : 'משומש באיכות גבוהה';

  const getPersonalizedOpening = () => {
    if (personalityTraits.includes('אנרגטי') || personalityTraits.includes('שאפתן')) {
      return `היי ${firstName}, אני מתאר לעצמי שבתור ${occupation} ${ageGroup} ודינמי, אתה מחפש רכב שישקף את האנרגיה והשאיפות שלך. נכון?`;
    } else if (personalityTraits.includes('יצירתי') || personalityTraits.includes('חדשני')) {
      return `${firstName}, כ${occupation} יצירתי, אני בטוח שאתה מחפש רכב שיבטא את הייחודיות שלך. מה היית רוצה שהרכב שלך ישדר?`;
    } else if (personalityTraits.includes('אמפתי') || personalityTraits.includes('מסור')) {
      return `שלום ${firstName}, בתור ${occupation} שדואג לאחרים, אני מניח שבטיחות ונוחות הם ערכים חשובים עבורך ברכב. האם אני צודק?`;
    } else {
      return `שלום ${firstName}, בתור ${occupation} ${ageGroup}, מה הדברים החשובים ביותר עבורך כשאתה מחפש רכב ${carCondition}?`;
    }
  };

  const getPersonalizedCarDescription = (car) => {
    if (personalityTraits.includes('אנרגטי') || personalityTraits.includes('תחרותי')) {
      return `ה${car} ידוע בביצועים המרשימים שלו ובתחושת הנהיגה הדינמית. זה בדיוק מה ש${occupation} כמוך צריך כדי להישאר בתנועה ולהגיע ליעדים שלו.`;
    } else if (personalityTraits.includes('יציב') || personalityTraits.includes('מעשי')) {
      return `ה${car} מציע אמינות יוצאת דופן וערך גבוה לאורך זמן. זה מתאים מאוד ל${occupation} שמחפש השקעה חכמה ויציבה.`;
    } else if (personalityTraits.includes('חדשני') || personalityTraits.includes('גמיש')) {
      return `ה${car} מצויד בטכנולוגיות החדשניות ביותר ומציע חוויית נהיגה מתקדמת. זה יכול להתאים מאוד ל${occupation} שתמיד מחפש את החידושים האחרונים.`;
    } else {
      return `ה${car} משלב נוחות, בטיחות וסטייל בחבילה אחת מרשימה. זה יכול להיות פתרון מצוין עבור ${occupation} ${ageGroup} כמוך.`;
    }
  };

  const getFinancingBenefits = () => {
    let benefits = `
    ${firstName}, בתור ${occupation}, אני בטוח שאתה מבין את החשיבות של תכנון פיננסי חכם. הנה כמה אפשרויות מימון שיכולות להתאים לך:

    1. פריסה גמישה: אנחנו מציעים פריסה של עד 100 תשלומים. `;
    
    if (personalityTraits.includes('אנליטי') || personalityTraits.includes('מדויק')) {
      benefits += `זה יכול לאפשר לך לתכנן את התקציב שלך בצורה מדויקת ויעילה.`;
    } else if (personalityTraits.includes('יצירתי') || personalityTraits.includes('גמיש')) {
      benefits += `זה נותן לך את החופש להתאים את התשלומים לסגנון החיים הדינמי שלך.`;
    } else {
      benefits += `זה מאפשר לך ליהנות מהרכב תוך שמירה על תזרים מזומנים נוח.`;
    }

    benefits += `

    2. אפשרות לדחיית תשלומים: אתה יכול לדחות את שלושת התשלומים הראשונים. `;
    
if (personalityTraits.includes('שאפתן') || personalityTraits.includes('יזם')) {
      benefits += `זה יכול לתת לך את הזמן להשקיע בעסק שלך ולהגדיל את ההכנסות לפני שמתחילים התשלומים.`;
    } else if (personalityTraits.includes('מעשי') || personalityTraits.includes('זהיר')) {
      benefits += `זה מאפשר לך להתארגן כלכלית ולתכנן את התקציב שלך בצורה מושכלת.`;
    } else {
      benefits += `זה נותן לך זמן להתרגל לרכב החדש ולהתארגן מבחינה כלכלית.`;
    }

    benefits += `

    3. אפשרות לפירעון מוקדם: אתה יכול לפרוע את ההלוואה בכל שלב. `;
    
    if (personalityTraits.includes('אנליטי') || personalityTraits.includes('אסטרטגי')) {
      benefits += `זה מאפשר לך לנצל הזדמנויות פיננסיות כשהן מגיעות ולחסוך בריבית.`;
    } else if (personalityTraits.includes('גמיש') || personalityTraits.includes('ספונטני')) {
      benefits += `זה נותן לך את החופש לשנות את התוכניות שלך בהתאם להתפתחויות בחיים.`;
    } else {
      benefits += `זה מעניק לך שקט נפשי, כי אתה יודע שיש לך אפשרות לסיים את ההלוואה מתי שתרצה.`;
    }

    benefits += `

    4. ליווי אישי: הצוות שלנו ילווה אותך לאורך כל התהליך. `;
    
    if (personalityTraits.includes('אמפתי') || personalityTraits.includes('חברותי')) {
      benefits += `אנחנו מאמינים ביצירת קשר אישי ובהבנת הצרכים הייחודיים של כל לקוח.`;
    } else if (personalityTraits.includes('עצמאי') || personalityTraits.includes('ביקורתי')) {
      benefits += `אנחנו כאן לספק לך את כל המידע שתצטרך כדי לקבל החלטה מושכלת.`;
    } else {
      benefits += `זה מבטיח שתקבל את התמיכה והמידע הנחוצים בכל שלב בדרך.`;
    }

    benefits += `

    5. אפשרות Trade-in: אם יש לך רכב ישן, אנחנו יכולים להציע לך עסקת החלפה. `;
    
    if (personalityTraits.includes('יעיל') || personalityTraits.includes('מעשי')) {
      benefits += `זה יכול לפשט את כל התהליך ולחסוך לך זמן וטרחה.`;
    } else if (personalityTraits.includes('חדשני') || personalityTraits.includes('סקרן')) {
      benefits += `זו דרך מצוינת לשדרג את הרכב שלך לדגם חדש יותר עם טכנולוגיה מתקדמת.`;
    } else {
      benefits += `זו אפשרות נהדרת להקל על המעבר לרכב החדש שלך.`;
    }

    benefits += `

    ${firstName}, איך כל זה נשמע לך? האם יש אפשרות מימון ספציפית שמעניינת אותך במיוחד?`;

    return benefits;
  };

  const getPersonalizedClosing = () => {
    if (personalityTraits.includes('שאפתן') || personalityTraits.includes('תחרותי')) {
      return `${firstName}, כ${occupation} מצליח, אתה יודע שהזדמנויות טובות לא מחכות לאף אחד. מה דעתך שניפגש היום ונתחיל להניע את התהליך? זה יכול להיות הצעד הראשון לקראת השגת הרכב שתמיד רצית.`;
    } else if (personalityTraits.includes('אנליטי') || personalityTraits.includes('מדויק')) {
      return `${firstName}, אני יודע שכ${occupation} אתה מעריך מידע מדויק ומקיף. בוא ניפגש היום, ואני אציג בפניך את כל הנתונים והמספרים שתצטרך כדי לקבל החלטה מושכלת. נוכל לעבור על כל הפרטים ביחד.`;
    } else if (personalityTraits.includes('רגיש') || personalityTraits.includes('אינטואיטיבי')) {
      return `${firstName}, אני מרגיש שיש כאן התאמה טובה בשבילך. כ${occupation}, אתה יודע להקשיב לאינטואיציה שלך. למה שלא תבוא היום לסוכנות, תיגע, תרגיש ותחווה את הרכב באופן אישי? אני בטוח שתרגיש את ההתאמה.`;
    } else {
      return `${firstName}, הצעד הבא הוא שלך. כ${occupation} ${ageGroup}, אתה יודע מה הכי טוב עבורך. מה דעתך לקפוץ אלינו היום? זו הזדמנות מצוינת לראות את הרכבים מקרוב ולהתחיל להגשים את החלום שלך. אנחנו כאן כדי לעזור לך למצוא את הרכב המושלם.`;
    }
  };

  return `
  ${getPersonalizedOpening()}

  ${firstName}, בהתחשב בניסיון שלך כ${occupation} ${ageGroup} ובסגנון החיים שלך, אני חושב שה${recommendedCars[0]} ${carCondition} יכול להיות התאמה מעולה עבורך.
  ${getPersonalizedCarDescription(recommendedCars[0])}

  כמובן, יש לנו גם את ה${recommendedCars[1]} וה${recommendedCars[2]} שהם אפשרויות נהדרות. 
  ${getPersonalizedCarDescription(recommendedCars[1])}
  ${getPersonalizedCarDescription(recommendedCars[2])}

  כל אחד מהרכבים האלה יכול להתאים לסגנון החיים הייחודי שלך כ${occupation}:

  1. ה${recommendedCars[0]} מצטיין ב${personalityTraits[0]} ו${personalityTraits[1]}. זה יכול להתאים מאוד לאופי ה${personalityTraits[2]} שלך.
  2. ה${recommendedCars[1]} ידוע ב${personalityTraits[3]} שלו. זה יכול לתמוך ב${occupation} ${ageGroup} כמוך בדרכים מפתיעות.
  3. ה${recommendedCars[2]} מציע פתרונות ${personalityTraits[4]}. זה יכול להתאים מאוד לצרכים הייחודיים שלך כ${occupation}.

  ${getFinancingBenefits()}

  ${getPersonalizedClosing()}

  אם זה נשמע לך טוב, אני יכול לתאם לך פגישה עם אחד המומחים שלנו עוד היום. יש לנו זמן פנוי ב-14:00 או ב-16:30. מה יותר נוח לך, ${firstName}?

  אני כאן לכל שאלה או התלבטות. המטרה שלי היא לעזור לך למצוא את הרכב המושלם, בתנאים שמתאימים בדיוק לך כ${occupation} ${ageGroup}.
  `;
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

  useEffect(() => {
    if (birthdate) {
      const today = new Date();
      const birth = new Date(birthdate);
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge.toString());
    }
  }, [birthdate]);

  const analyzeAndCreateScript = () => {
    if (parseInt(age) < 18 || parseInt(age) > 80) {
      alert('גיל חייב להיות בין 18 ל-80');
      return;
    }

    const zodiacSign = getZodiacSign(birthdate);
    const numerologyValue = getNumerologyValue(firstName + lastName);
    const personalityColor = personalityColors[occupation];
    
    const script = generateScript(firstName, lastName, birthdate, parseInt(age), occupation, carType, isNew, personalityColor, zodiacSign, numerologyValue);
    
    setAnalysis({ style: personalityColor, conversationScript: script });
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setBirthdate('');
    setAge('');
    setOccupation('');
    setCarType('');
    setIsNew(true);
    setAnalysis(null);
  };

  const saveToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setLanguage("he");
    doc.setR2L(true);
    
    const lines = doc.splitTextToSize(analysis.conversationScript, 180);
    doc.text(lines, 200, 10, { align: 'right' });
    
    doc.save("car_financing_script.pdf");
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
        />
        <input 
          type="text" 
          placeholder="שם משפחה" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
        />
        <input 
          type="date" 
          placeholder="תאריך לידה" 
          value={birthdate} 
          onChange={(e) => setBirthdate(e.target.value)} 
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
      <button onClick={analyzeAndCreateScript}>צור תסריט שיחה מתקדם</button>
      {analysis && (
        <div className="analysis-result">
          <h3>סגנון שיחה מומלץ:</h3>
          <p>{analysis.style}</p>
          <h3>תסריט שיחה מפורט:</h3>
          <pre>{analysis.conversationScript}</pre>
          <button onClick={saveToPDF}>שמור כ-PDF</button>
          <button onClick={resetForm}>אפס טופס</button>
        </div>
      )}
    </div>
  );
};

export default CarFinancingConversationAnalyzer;