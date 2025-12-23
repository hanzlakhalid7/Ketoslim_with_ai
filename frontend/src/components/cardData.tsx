import { useContext } from 'react';
import { ParameterContext } from './ParameterContext';

function cardData(): any[] {
  const { formData } = useContext(ParameterContext);
  const { resultArray } = useContext(ParameterContext);
  const getCallout = (index: number) => {
    const item = resultArray[index];
    if (item && typeof item === 'object' && 'callouts' in item) {
      return item.callouts;
    }
    return item;
  };

  const getImage = (index: number, defaultPath: string) => {
    const item = resultArray[index];
    if (item && typeof item === 'object' && 'image' in item && item.image) {
      // If the DB has the image name, use it. 
      // We assume the DB stores just 'card1_img1.png', so we prepend '/images/'
      // Check if it already has /images/ or http to avoid double prefixing
      if (item.image.startsWith('http') || item.image.startsWith('/')) return item.image;
      return `/images/${item.image}`;
    }
    return defaultPath;
  };

  const getField = (index: number, field: string, fallback: any) => {
    const item = resultArray[index];
    if (item && typeof item === 'object' && field in item) {
      return item[field];
    }
    return fallback;
  };

  return [
    {
      icon: getField(0, 'icon', '⚖️'),
      title: getField(0, 'title', (
        <>
          Your Body Fat
          <br />
          <span>
            Percentage Is <span>{formData.fatScale}%</span>
          </span>
        </>
      )),
      subtitle: getField(0, 'subtitle', 'Here’s Why That Matters'),
      image: getImage(0, '/images/card1_img1.png'),
      description: getField(0, 'description', `Your body fat percentage gives a clearer picture than BMI alone. It tells us how much of your body is lean mass (muscle, organs, bone) vs stored fat.
      
      Too much stored fat doesn’t just affect how you look — it impacts your energy, hormone balance, and ability to burn fat efficiently.`),
      callouts: getCallout(0),
    },

    {
      icon: getField(1, 'icon', '📊'),
      title: getField(1, 'title', <>{`Your BMI is ${formData.bmi}`}</>),
      subtitle: getField(1, 'subtitle', 'What That Means'),
      image: getImage(1, '/images/card2_img2.png'),
      description: getField(1, 'description', `BMI (Body Mass Index) is a quick way to estimate how your weight might affect your health based on your height and weight. When your BMI is too high, your body may store more fat than it uses. That can slow your metabolism, drain your energy, and make fat loss harder even if you’re putting in effort.`),
      callouts: getCallout(1),
    },

    {
      icon: getField(2, 'icon', '🔥'),
      title: getField(2, 'title', (
        <>
          You Should Be Eating Around
          <br />
          <span>{formData.calorie} Calories</span>
        </>
      )),
      subtitle: getField(2, 'subtitle', 'But Not All Calories Are Equal'),
      image: getImage(2, '/images/card3_img3.png'),
      description: getField(2, 'description', `Your body burns calories just to stay alive — that’s your BMR. Add in movement, and you burn even more. Eat less than you burn? You lose weight. Eat more? You store it. Simple math, but the type of calories still makes or breaks your results. Most people eat low-quality calories that spike cravings, crash energy, and cause fat to stick — even if they’re technically under their daily limit.`),
      callouts: getCallout(2),
    },

    {
      icon: getField(3, 'icon', '💧'),
      title: getField(3, 'title', (
        <>
          Your Body Needs{' '}
          <span>
            {formData.water} Cups of <br /> Water Daily
          </span>
        </>
      )),
      subtitle: getField(3, 'subtitle', 'Here’s Why That Matters'),
      image: getImage(3, '/images/card4_img4.png'),
      description: getField(3, 'description', `Hydration is a fat-burning multiplier. Without enough water, your body holds onto toxins, slows digestion, and burns fat less efficiently. Even mild dehydration can feel like fatigue, hunger, or sugar cravings. You’re not lazy — you’re likely under-hydrated.`),
      callouts: getCallout(3),
    },

    {
      icon: getField(4, 'icon', '📉'),
      title: getField(4, 'title', (
        <>
          You Could Be Losing
          <br />
          <span className="text-red-600"> {formData.weightLoss} lbs / week </span>
        </>
      )),
      subtitle: getField(4, 'subtitle', 'With the Right Fuel Source'),
      image: getImage(4, '/images/card5_img5.png'),
      description: getField(4, 'description', `This is your potential, what your body could lose if it’s in fat-burning mode. But that depends on getting your metabolism working with you, not against you. Low energy, stubborn cravings, and slow progress usually mean your body is still burning sugar instead of fat — and that keeps weight loss stuck.`),
      callouts: getCallout(4),
    },
    {
      icon: getField(5, 'icon', '⏳'),
      title: getField(5, 'title', (
        <>
          You Could See Results
          <br />
          <span>
            in as Little as <span>{formData.days}</span> Days
          </span>
        </>
      )),
      subtitle: getField(5, 'subtitle', 'Here’s Why That Matters'),
      image: getImage(5, '/images/card6_img6.png'),
      description: getField(5, 'description', `Visible change doesn’t take forever — when your metabolism shifts, your body can start dropping bloat, water weight, and fat surprisingly fast. It’s not about how long you try — it’s about whether your body’s actually set up to change. The wrong plan wastes months.`),
      callouts: getCallout(5),
    },
  ];
}
export default cardData;