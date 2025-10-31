import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { apiClient } from '../utils/api';

// Low-literacy optimized components
const BigCard = ({ icon, title, value, unit, description, trend, onClick, loading }) => {
  const { translate } = useLanguage();
  
  return (
    <div 
      className={`
        bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 
        cursor-pointer hover:scale-105 border-2 border-gray-100
        ${loading ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}: ${value} ${unit}`}
    >
      {/* Large Icon */}
      <div className="text-center mb-6">
        <div className="text-8xl mb-4" role="img" aria-label={title}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Big Number */}
      <div className="text-center mb-4">
        {loading ? (
          <div className="bg-gray-200 h-16 w-32 mx-auto rounded-lg animate-pulse"></div>
        ) : (
          <>
            <div className="text-5xl font-black text-primary-600 mb-2">
              {value}
            </div>
            <div className="text-xl text-gray-600 font-semibold">
              {unit}
            </div>
          </>
        )}
      </div>
      
      {/* Trend Indicator */}
      {trend && (
        <div className={`
          text-center text-lg font-semibold px-4 py-2 rounded-full mx-auto w-fit
          ${trend.type === 'positive' ? 'bg-green-100 text-green-700' : 
            trend.type === 'negative' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100 text-gray-700'}
        `}>
          {trend.type === 'positive' ? '📈' : trend.type === 'negative' ? '📉' : '📊'} {trend.text}
        </div>
      )}
    </div>
  );
};

const LanguageSelector = () => {
  const { currentLanguage, availableLanguages, changeLanguage, translate } = useLanguage();
  
  return (
    <div className="relative">
      <label className="block text-lg font-semibold text-gray-700 mb-3">
        {translate('language')}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.values(availableLanguages).map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`
              p-4 rounded-2xl border-2 text-center transition-all duration-200
              hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4
              ${currentLanguage === lang.code 
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md' 
                : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300'
              }
            `}
            aria-pressed={currentLanguage === lang.code}
          >
            <div className="text-3xl mb-2">{lang.flag}</div>
            <div className="font-semibold text-lg">{lang.nativeName}</div>
            <div className="text-sm text-gray-500">{lang.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const DistrictSelector = ({ selectedDistrict, onDistrictChange, districts, loading }) => {
  const { translate } = useLanguage();
  
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {translate('selectDistrict')}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {loading ? (
          <>
            <div className="bg-gray-200 h-32 rounded-2xl animate-pulse"></div>
            <div className="bg-gray-200 h-32 rounded-2xl animate-pulse"></div>
          </>
        ) : (
          districts.map((district) => (
            <button
              key={district.code}
              onClick={() => onDistrictChange(district)}
              className={`
                p-6 rounded-2xl border-3 text-center transition-all duration-300
                hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4
                ${selectedDistrict?.code === district.code
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:shadow-md'
                }
              `}
              aria-pressed={selectedDistrict?.code === district.code}
            >
              <div className="text-4xl mb-3">
                {district.code === 'north-goa' ? '🏔️' : '🏖️'}
              </div>
              <div className="text-2xl font-bold">
                {translate(district.code === 'north-goa' ? 'northGoa' : 'southGoa')}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const SimpleChart = ({ data, title }) => {
  const { translate } = useLanguage();
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h3>
        <div className="text-center text-gray-500 text-xl">
          {translate('noData')}
        </div>
      </div>
    );
  }
  
  // Get last 6 months of data
  const recentData = data.slice(-6);
  const maxValue = Math.max(...recentData.map(d => d.person_days));
  
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">{title}</h3>
      
      <div className="space-y-6">
        {recentData.map((item, index) => {
          const height = (item.person_days / maxValue) * 100;
          const month = translate(`monthsShort.${item.month}`);
          
          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-20 text-lg font-semibold text-gray-600">
                {month}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${height}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700">
                    {(item.person_days / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatusBar = ({ lastUpdate, isOnline, isLoading }) => {
  const { translate } = useLanguage();
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-4 h-4 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}
          `}></div>
          <span className="text-lg font-semibold">
            {isOnline ? translate('connected') : translate('offline')}
          </span>
        </div>
        
        {lastUpdate && (
          <div className="text-gray-600 text-lg">
            {translate('lastUpdated')}: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-primary-600">
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-semibold">{translate('loading')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const ImprovedDashboard = () => {
  const { translate, formatNumber, formatCurrency } = useLanguage();
  
  // State management
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const districts = [
    { code: 'north-goa', name: 'North Goa' },
    { code: 'south-goa', name: 'South Goa' }
  ];
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Fetch district data
  const fetchDistrictData = useCallback(async (districtName) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getDistrictData(districtName);
      
      if (response.success) {
        setDistrictData(response.data);
        setLastUpdate(new Date().toISOString());
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching district data:', err);
      setError(err.message);
      // Set some fallback data for demo
      setDistrictData([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Auto-select North Goa on first load
  useEffect(() => {
    if (!selectedDistrict) {
      const defaultDistrict = districts[0];
      setSelectedDistrict(defaultDistrict);
      fetchDistrictData(defaultDistrict.name);
    }
  }, [selectedDistrict, fetchDistrictData]);
  
  // Handle district change
  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    fetchDistrictData(district.name);
  };
  
  // Process data for metrics
  const processedMetrics = React.useMemo(() => {
    if (!districtData || districtData.length === 0) {
      return {
        totalPersonDays: 0,
        totalHouseholds: 0,
        totalFundsSpent: 0,
        avgWage: 0,
        avgCompletion: 0
      };
    }
    
    const totals = districtData.reduce((acc, record) => {
      acc.personDays += parseInt(record.person_days || 0);
      acc.households += parseInt(record.households || 0);
      acc.fundsSpent += parseFloat(record.funds_spent || 0);
      acc.completion += parseFloat(record.completion_percentage || 0);
      acc.records += 1;
      return acc;
    }, { personDays: 0, households: 0, fundsSpent: 0, completion: 0, records: 0 });
    
    return {
      totalPersonDays: totals.personDays,
      totalHouseholds: totals.households,
      totalFundsSpent: totals.fundsSpent,
      avgWage: totals.personDays > 0 ? Math.round(totals.fundsSpent / totals.personDays) : 0,
      avgCompletion: totals.records > 0 ? Math.round(totals.completion / totals.records) : 0
    };
  }, [districtData]);
  
  // Generate trend data (mock for demo)
  const generateTrend = () => ({
    type: 'positive',
    text: '+12%'
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-4xl lg:text-6xl font-black text-gray-800 mb-4">
            {translate('appTitle')}
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-semibold">
            {translate('appSubtitle')}
          </p>
        </header>
        
        {/* Status Bar */}
        <StatusBar 
          lastUpdate={lastUpdate}
          isOnline={isOnline}
          isLoading={loading}
        />
        
        {/* Language Selector */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
          <LanguageSelector />
        </div>
        
        {/* District Selection */}
        <DistrictSelector
          selectedDistrict={selectedDistrict}
          onDistrictChange={handleDistrictChange}
          districts={districts}
          loading={loading}
        />
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">
              {translate('errorTitle')}
            </h3>
            <p className="text-lg text-red-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => selectedDistrict && fetchDistrictData(selectedDistrict.name)}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              {translate('retry')}
            </button>
          </div>
        )}
        
        {/* Main Metrics */}
        {selectedDistrict && (
          <>
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8">
              📊 {translate(selectedDistrict.code === 'north-goa' ? 'northGoa' : 'southGoa')}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              <BigCard
                icon="💼"
                title={translate('workDone')}
                value={formatNumber(processedMetrics.totalPersonDays)}
                unit={translate('workDoneUnit')}
                description={translate('workDoneDesc')}
                trend={generateTrend()}
                loading={loading}
                onClick={() => console.log('Work details clicked')}
              />
              
              <BigCard
                icon="👨‍👩‍👧‍👦"
                title={translate('familiesHelped')}
                value={formatNumber(processedMetrics.totalHouseholds)}
                unit={translate('familiesHelpedUnit')}
                description={translate('familiesHelpedDesc')}
                trend={generateTrend()}
                loading={loading}
                onClick={() => console.log('Families details clicked')}
              />
              
              <BigCard
                icon="💰"
                title={translate('moneySpent')}
                value={formatCurrency(processedMetrics.totalFundsSpent).replace('₹', '')}
                unit="₹"
                description={translate('moneySpentDesc')}
                trend={generateTrend()}
                loading={loading}
                onClick={() => console.log('Money details clicked')}
              />
              
              <BigCard
                icon="💵"
                title={translate('avgWage')}
                value={processedMetrics.avgWage}
                unit={translate('avgWageUnit')}
                description={translate('avgWageDesc')}
                loading={loading}
                onClick={() => console.log('Wage details clicked')}
              />
              
              <BigCard
                icon="✅"
                title={translate('completion')}
                value={processedMetrics.avgCompletion}
                unit={translate('completionUnit')}
                description={translate('completionDesc')}
                loading={loading}
                onClick={() => console.log('Completion details clicked')}
              />
            </div>
            
            {/* Chart Section */}
            <div className="mt-12">
              <SimpleChart 
                data={districtData}
                title={translate('monthlyTrend')}
              />
            </div>
            
            {/* Insights */}
            <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-3xl p-8 border-2 border-primary-100">
              <h3 className="text-2xl font-bold text-primary-800 mb-6 text-center">
                {translate('insights')}
              </h3>
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-xl text-primary-700 font-semibold">
                  {translate('goodProgress')}
                </p>
              </div>
            </div>
          </>
        )}
        
        {/* Footer */}
        <footer className="text-center py-8 text-gray-600">
          <p className="text-lg">
            🇮🇳 Government of India | Ministry of Rural Development
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ImprovedDashboard;