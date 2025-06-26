import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface EmotionDonutChartProps {
  data: {
    name: string;
    value: number;
  }[];
  emotionColors: Record<string, string>;
}

export default function EmotionDonutChart ( { data, emotionColors}: EmotionDonutChartProps) {
  const [outerRadius, setOuterRadius] = useState(100);
  const [innerRadius, setInnerRadius] = useState(60);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;
    const mobile = width < 768;
      setIsMobile(mobile);

    if (width < 768) {
      setOuterRadius(60);  // smaller outer
      setInnerRadius(35);  // scale down inner to maintain ring thickness
    } else {
      setOuterRadius(100); // default for desktop
      setInnerRadius(60);
    }
  };

  handleResize(); // run on mount
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <div className="w-full flex flex-col items-center">
    <h3 className="text-lg md:text-xl text-transparent  md:text-white font-semibold mb-1">
      Video&apos;s Emotional Distribution
    </h3>
    <div className="w-full h-[25vh] pb-20 md:pb-0">
    <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              nameKey="name"
              label={isMobile ? false : ({ name, value }) => `${name}: ${value.toFixed(1)}%`}

            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={emotionColors[entry.name] || "#ccc"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}%`}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#5d1283" }}
              itemStyle={{ color: "#5d1283" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};