import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RevenueChart = ({ data }) => {
  if (!data || !data.months || !data.revenue) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Мэдээлэл байхгүй байна
      </div>
    );
  }

  const chartData = data.months.map((month, index) => ({
    month,
    revenue: data.revenue[index] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip 
          formatter={(value) => `${value.toLocaleString()} ₮`}
          labelStyle={{ color: '#374151' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Орлого"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;

