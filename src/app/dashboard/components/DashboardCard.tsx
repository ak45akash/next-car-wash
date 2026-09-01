import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  positive?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  change,
  positive
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="p-2 rounded-full bg-gray-50">{icon}</span>
      </div>
      <div className="flex flex-col">
        <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
        {change && (
          <p className={`text-sm ${positive ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-gray-500'}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard; 