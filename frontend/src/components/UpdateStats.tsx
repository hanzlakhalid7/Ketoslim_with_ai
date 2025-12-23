import { useState, useContext, ChangeEvent, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParameterContext } from './ParameterContext';
import GenderField from './form-fields/GenderField';
import RangeField from './form-fields/RangeField';
import NumberField from './form-fields/NumberField';
import CameraModal from './home-form/CameraModal';
import HealthScanSection from './home-form/HealthScanSection';

function UpdateStats() {
    const { setFormData, mode, formData } = useContext(ParameterContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    // Camera State
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Initialize Form State with Context or Defaults
    // Using explicit fallbacks to 0 or ''
    const [genderValue, setGenderValue] = useState(formData.gender || '');
    const [fatScaleValue, setFatScaleValue] = useState(formData.fatScale || 0);
    const [heightValue, setHeightValue] = useState(formData.height || 0);
    const [weightValue, setWeightValue] = useState(formData.weight || 0);
    const [ageValue, setAgeValue] = useState(formData.age || 0);
    const [bmiValue, setBmiValue] = useState(formData.bmi || 0);
    const [calorieValue, setCalorieValue] = useState(formData.calorie || 0);
    const [waterValue, setWaterValue] = useState(formData.water || 0);
    const [weightLossValue, setWeightLossValue] = useState(formData.weightLoss || 0);
    const [daysValue, setDaysValue] = useState(formData.days || 0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(formData.image || null);
    const [imageBase64, setImageBase64] = useState<string | null>(formData.image || null);

    const [isCompleted, setIsCompleted] = useState(false);
    const [errorMessageCalories, setErrorMessageCalories] = useState('');
    const [errorMessageWeight, seterrorMessageWeight] = useState('');
    const [errorMessageDays, seterrorMessageDays] = useState('');

    const min = 0;
    const max = 100;
    const bmiMax = 70;

    const validateForm = useCallback(() => {
        const fatScale = Number(fatScaleValue);
        const bmi = Number(bmiValue);
        const height = Number(heightValue);
        const weight = Number(weightValue);
        const age = Number(ageValue);
        const calorie = Number(calorieValue);
        const water = Number(waterValue);
        const weightLoss = Number(weightLossValue);
        const days = Number(daysValue);

        return (
            genderValue !== '' &&
            fatScale >= min &&
            fatScale <= max &&
            height >= min &&
            weight >= min &&
            age >= min &&
            bmi >= min &&
            bmi <= bmiMax &&
            calorie >= 1 &&
            water >= 1 &&
            weightLoss >= 0.1 &&
            days >= 1
        );
    }, [genderValue, fatScaleValue, bmiValue, heightValue, weightValue, ageValue, calorieValue, waterValue, weightLossValue, daysValue]);

    useEffect(() => {
        setIsCompleted(validateForm());
    }, [validateForm]);


    const processFile = async (file: File) => {
        setIsLoading(true);

        try {
            // Convert file to base64 string
            const base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    resolve(result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            setImageBase64(base64String);

            // 1. Get User Details from Image
            const userDetailResponse = await fetch("http://localhost:8000/getUserDetail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64String }),
            });

            if (!userDetailResponse.ok) {
                throw new Error(`Failed to get user details! status: ${userDetailResponse.status}`);
            }

            const userData = await userDetailResponse.json();

            // Populate Form State with AI Data
            if (userData.gender) setGenderValue(userData.gender);
            if (userData.fatScale) setFatScaleValue(userData.fatScale);
            if (userData.height) setHeightValue(userData.height);
            if (userData.weight) setWeightValue(userData.weight);
            if (userData.age) setAgeValue(userData.age);
            if (userData.bmi) setBmiValue(userData.bmi);
            if (userData.calorie) setCalorieValue(userData.calorie);
            if (userData.water) setWaterValue(userData.water);
            if (userData.weightLoss) setWeightLossValue(userData.weightLoss);
            if (userData.days) setDaysValue(userData.days);
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        processFile(file);
    };

    const handleCameraCapture = (file: File, url: string) => {
        setPreviewUrl(url);
        processFile(file);
    };


    async function handler(e: React.FormEvent) {
        e.preventDefault();

        const payload = {
            gender: genderValue,
            fatScale: Number(fatScaleValue),
            height: Number(heightValue),
            weight: Number(weightValue),
            age: Number(ageValue),
            bmi: Number(bmiValue),
            calorie: Number(calorieValue),
            water: Number(waterValue),
            weightLoss: Number(weightLossValue),
            days: Number(daysValue),
            image: imageBase64 || undefined,
        };

        setFormData(payload);

        // Save to backend form if needed, but primary goal is generation
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Save Form Data for persistence
                await fetch("http://localhost:3000/Form/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });
            } catch (e) {
                console.error("Background form save failed", e);
            }
        }

        // Navigate to Dashboard to trigger generation with this payload
        navigate('/dashboard', {
            state: {
                generatePlan: true,
                formData: payload
            }
        });
    }


    return (
        <div className="w-full max-w-xl mx-auto">
            <div className={`flex flex-col shadow mt-4 p-8 w-full rounded-2xl items-center ${!mode ? 'bg-white text-black' : 'dMB text-white'}`}>

                <h2 className="text-2xl font-bold mb-6 text-center">Update Health Stats & Generate Plan</h2>

                <HealthScanSection
                    previewUrl={previewUrl}
                    isLoading={isLoading}
                    onClear={() => { setPreviewUrl(null); setImageBase64(null); }}
                    onFileSelect={handleImageUpload}
                    onCameraClick={() => setIsCameraOpen(true)}
                    mode={mode}
                />

                {isCameraOpen && (
                    <CameraModal
                        onClose={() => setIsCameraOpen(false)}
                        onCapture={handleCameraCapture}
                        mode={mode}
                    />
                )}


                <div className="w-full border-t border-gray-200 mb-8 relative">
                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-sm font-medium ${!mode ? 'bg-white text-gray-500' : 'dMB text-gray-400'}`}>OR EDIT MANUALLY</span>
                </div>

                {/* Manual Form Section */}
                <form onSubmit={handler} className="w-full text-left">
                    <GenderField value={genderValue} onChange={setGenderValue} />
                    <RangeField label="Body Fat %" min={min} max={max} value={fatScaleValue} onChange={(val) => setFatScaleValue(Number(val))} />
                    <RangeField label="BMI" min={min} max={bmiMax} value={bmiValue} onChange={(val) => setBmiValue(Number(val))} />
                    <NumberField label="Height (centimeters)" value={heightValue} onChange={(val) => setHeightValue(Number(val))} />
                    <NumberField label="Weight (kilograms)" value={weightValue} onChange={(val) => setWeightValue(Number(val))} />
                    <NumberField label="Age" value={ageValue} onChange={(val) => setAgeValue(Number(val))} />
                    <NumberField label="Daily Calorie Target" min={1} value={calorieValue} onChange={(v) => { if (Number(v) < 0) { setErrorMessageCalories('Value cannot be negative.'); setCalorieValue(0); } else { setCalorieValue(Number(v)); setErrorMessageCalories(''); } }} error={errorMessageCalories} placeholder="e.g. 2000" />

                    <div className="mb-4">
                        <div className="mb-1">
                            <label className="text-sm font-medium">Cups of Water Per Day</label>
                            <span className="ml-1 text-red-600">*</span>
                        </div>
                        <select className={`w-full inputBorder px-3 py-2 ${!mode ? 'bg-white text-black' : 'dMB text-white'}`} value={waterValue} onChange={(e) => setWaterValue(Number(e.target.value))}>
                            <option value="">Select cups</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="4">4</option>
                            <option value="6">6</option>
                        </select>
                    </div>

                    <NumberField label="Weekly Weight Loss Goal (lbs)" min={0.1} step={0.1} value={weightLossValue} onChange={(v) => { if (Number(v) < 0) { seterrorMessageWeight('Value cannot be negative.'); setWeightLossValue(0); } else { setWeightLossValue(Number(v)); seterrorMessageWeight(''); } }} error={errorMessageWeight} placeholder="e.g. 1.5" />
                    <NumberField label="Days to See Results" min={1} value={daysValue} onChange={(v) => { if (Number(v) < 0) { seterrorMessageDays('Value cannot be negative.'); setDaysValue(0); } else { setDaysValue(Number(v)); seterrorMessageDays(''); } }} error={errorMessageDays} placeholder="e.g. 30" />

                    <button type="submit" disabled={!isCompleted} className={`w-full rounded-xl mt-4 py-3 text-lg font-semibold mb-6 rangeColor border-rangeColor ${isCompleted ? 'opacity-100 cursor-pointer' : ' opacity-50 cursor-not-allowed'}`}>
                        Generate New Meal Plan
                    </button>

                    {!isCompleted && <div className="text-xs mt-2 text-center descriptionColor">Please fill out all required fields.</div>}
                </form>

            </div>
        </div>
    );
}

export default UpdateStats;
