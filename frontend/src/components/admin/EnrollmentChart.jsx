import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const EnrollmentChart = ({ data }) => {
  if (!data || !data.months || !data.enrollments) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Мэдээлэл байхгүй байна
      </div>
    );
  }

  const chartData = data.months.map((month, index) => ({
    month,
    enrollments: data.enrollments[index] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value) => `${value} бүртгэл`}
          labelStyle={{ color: '#374151' }}
        />
        <Legend />
        <Bar 
          dataKey="enrollments" 
          fill="#10b981" 
          name="Бүртгэл"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnrollmentChart;

