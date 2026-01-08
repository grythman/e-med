import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const PopularCoursesChart = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Мэдээлэл байхгүй байна
      </div>
    );
  }

  const chartData = courses.map((course) => ({
    name: course.title?.substring(0, 20) || 'Тодорхойгүй',
    enrollments: course.enrollmentCount || 0,
  }));

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 11 }}
          width={150}
        />
        <Tooltip 
          formatter={(value) => `${value} бүртгэл`}
          labelStyle={{ color: '#374151' }}
        />
        <Legend />
        <Bar dataKey="enrollments" name="Бүртгэл" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PopularCoursesChart;

