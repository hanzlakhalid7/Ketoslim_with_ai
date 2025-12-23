import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import Card from './components/Card';
import Sales from './components/Sales';
import { ParameterContext, FormData } from './components/ParameterContext';
import MealPlans from './components/sales/MealPlans';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function AppRoutes() {
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('mode') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [resultArray, setResultArray] = useState<any[]>([]);
  return (
    <ParameterContext.Provider value={{ formData, setFormData, mode, setMode, resultArray, setResultArray }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/form" element={<Home />} />
        <Route path="/Result" element={<Card />} />
        <Route path="/Sales" element={<Sales />} />
        <Route path="/meal-plans" element={<MealPlans />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </ParameterContext.Provider >
  );
}
export default AppRoutes;
