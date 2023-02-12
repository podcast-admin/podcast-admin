import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  BarChart as BarChartRecharts,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const BarChart = ({ data }) => {
  const theme = useTheme();

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
      <CartesianGrid strokeDasharray="3 1" vertical={false} />
      <XAxis dataKey="episodeId" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="num" fill={theme.palette.primary.main} />
    </BarChartRecharts>
  );
};

export default BarChart;
