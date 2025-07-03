// src/components/dashboard/StatsCard.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorMap = {
  blue: ['text-blue-600', 'bg-blue-50'],
  green: ['text-green-600', 'bg-green-50'],
  purple: ['text-purple-600', 'bg-purple-50'],
  orange: ['text-orange-600', 'bg-orange-50'],
} as const;

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  const [iconColor, iconBg] = colorMap[color];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>

            {change && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    change.trend === 'up'
                      ? 'text-green-600'
                      : change.trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {change.trend === 'up'
                    ? '↗'
                    : change.trend === 'down'
                    ? '↘'
                    : '→'}{' '}
                  {change.value}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs last month
                </span>
              </div>
            )}
          </div>

          <div className={`p-3 rounded-full ${iconBg}`}>
            <Icon size={24} className={iconColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
