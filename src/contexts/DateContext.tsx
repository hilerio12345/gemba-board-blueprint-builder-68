
import React, { createContext, useState, useContext, useEffect } from "react";

interface DateContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  formattedDate: string;
  dateKey: string;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Format date for display
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Create a string key for storing data by date (YYYY-MM-DD)
  const dateKey = currentDate.toISOString().split('T')[0];

  return (
    <DateContext.Provider value={{ currentDate, setCurrentDate, formattedDate, dateKey }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error("useDateContext must be used within a DateProvider");
  }
  return context;
};
