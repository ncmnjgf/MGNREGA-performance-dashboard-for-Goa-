import React from 'react';
import { LocationAwareDistrictSelector } from './LocationAwareDistrictSelector';

/**
 * DistrictSelector component - Basic alias to LocationAwareDistrictSelector
 * This component provides a simple interface for district selection
 */
export const DistrictSelector = ({
  districts = [],
  selectedDistrict = null,
  onDistrictChange,
  loading = false,
  error = null,
  className = '',
  placeholder = 'Select District',
  showAllOption = true,
  disabled = false,
  ...props
}) => {
  return (
    <LocationAwareDistrictSelector
      districts={districts}
      selectedDistrict={selectedDistrict}
      onDistrictChange={onDistrictChange}
      loading={loading}
      error={error}
      className={className}
      placeholder={placeholder}
      showAllOption={showAllOption}
      disabled={disabled}
      // Disable auto-detection features for basic selector
      enableAutoDetection={false}
      enableLocationServices={false}
      showLocationStatus={false}
      {...props}
    />
  );
};

/**
 * Simple district selector dropdown without enhanced features
 */
export const SimpleDistrictSelector = ({
  districts = [],
  selectedDistrict = null,
  onDistrictChange,
  loading = false,
  error = null,
  className = '',
  placeholder = 'Select District',
  showAllOption = true,
  disabled = false,
}) => {
  const handleChange = (event) => {
    const value = event.target.value;
    const district = districts.find(d => d.code === value) || null;
    onDistrictChange?.(district);
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 animate-pulse"
          disabled
        >
          <option>Loading districts...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <select
          className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700"
          disabled
        >
          <option>Error loading districts</option>
        </select>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedDistrict?.code || ''}
        onChange={handleChange}
        disabled={disabled || districts.length === 0}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {showAllOption && (
          <option value="">{placeholder}</option>
        )}
        {districts.map((district) => (
          <option key={district.code} value={district.code}>
            {district.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DistrictSelector;
