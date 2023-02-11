import React from 'react';
import {
  BarChart as BarChartRecharts,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const BarChart = ({ data }) => {
  return (
    <BarChartRecharts
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="episodeId" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="num" fill="#8884d8" />
    </BarChartRecharts>
  );
};

export default BarChart;
