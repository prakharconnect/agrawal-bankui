import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SpendingChart = ({ transactions }) => {
  // 🎯 अब हम 3 कैटेगिरी दिखाएंगे
  const data = [
    { name: 'Bills', value: 0, color: '#F59E0B' },      // Amber
    { name: 'Transfers', value: 0, color: '#0B1120' },  // Navy
    { name: 'Deposits', value: 0, color: '#10B981' },   // Green (🎯 Naya add kiya)
  ];

  transactions.forEach(t => {
    const amt = Math.abs(t.amount);
    
    if (t.amount < 0) {
      // खर्चे (Outflow)
      if (t.description.toLowerCase().includes('bill')) {
        data[0].value += amt;
      } else {
        data[1].value += amt;
      }
    } else {
      // जमा (Inflow - 🎯 Yahan jayega tumhara 500 ka deposit)
      data[2].value += amt;
    }
  });

  const hasData = data.some(d => d.value > 0);
  if (!hasData) return <div className="text-[10px] text-slate-400 italic text-center py-10">No activity yet</div>;

  return (
    <div className="h-[180px] w-full relative"> 
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.filter(d => d.value > 0)}
            innerRadius={45}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}
            formatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconSize={8}
            wrapperStyle={{ fontSize: '9px', paddingTop: '10px', fontWeight: 'bold' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;