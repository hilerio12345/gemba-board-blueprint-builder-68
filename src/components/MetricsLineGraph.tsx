
import { useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MetricsLineGraphProps {
  category: string;
  data: { day: string; value: number }[];
  color: string;
}

const MetricsLineGraph = ({ category, data, color }: MetricsLineGraphProps) => {
  return (
    <div className="h-48 mb-4">
      <h3 className="text-sm font-medium mb-2">{category} Trend</h3>
      <ChartContainer
        config={{
          line: { color },
          tooltip: {},
        }}
        className="h-40"
      >
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <ChartTooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                labelFormatter={(value) => `Day: ${value}`}
              />
            )}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Value"
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default MetricsLineGraph;
