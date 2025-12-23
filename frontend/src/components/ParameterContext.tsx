import { createContext, Dispatch, SetStateAction } from 'react';

export interface FormData {
    gender: string;
    fatScale: number;
    height: number;
    weight: number;
    age: number;
    bmi: number;
    calorie: number;
    water: number;
    weightLoss: number;
    days: number;
    image?: string;
}

export interface ParameterContextType {
    mode: boolean;
    setMode: Dispatch<SetStateAction<boolean>>;
    formData: Partial<FormData>;
    setFormData: Dispatch<SetStateAction<Partial<FormData>>>;
    resultArray: any[];
    setResultArray: Dispatch<SetStateAction<any[]>>;
}

export const ParameterContext = createContext<ParameterContextType>({
    mode: false,
    setMode: () => { },
    formData: {},
    setFormData: () => { },
    resultArray: [],
    setResultArray: () => { },
});
