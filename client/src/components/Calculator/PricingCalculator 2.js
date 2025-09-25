import React from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

const PricingCalculator = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-3 mb-8">
        <CalculatorIcon className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Calculator</h1>
          <p className="text-gray-600">Dynamic pricing based on actual costs</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
        <p className="text-gray-600">Pricing calculator component coming soon...</p>
      </div>
    </div>
  );
};

export default PricingCalculator;
