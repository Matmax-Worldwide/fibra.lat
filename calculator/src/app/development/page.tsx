import React from 'react';
import { Metadata } from 'next';
import MultiFormatCalculator from '../components/development/MultiFormatCalculator';

export const metadata: Metadata = {
  title: 'Development Calculator | Fibra Investment Calculator',
  description: 'Model mixed-use real estate developments with hotel rooms, serviced apartments, and Airbnb units to optimize your investment strategy.',
};

export default function DevelopmentCalculatorPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12 max-w-screen-xl mx-auto">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Development Calculator
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          Model different mixes of hotel rooms, serviced apartments, and Airbnb units to find the optimal 
          format distribution for your development project. Analyze financial metrics and optimize 
          your real estate investment strategy.
        </p>
      </div>
      
      <MultiFormatCalculator />
    </div>
  );
} 