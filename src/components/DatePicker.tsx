
import * as React from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  viewMode?: 'daily' | 'weekly' | 'monthly';
}

const DatePicker = ({ date, onDateChange, viewMode = 'daily' }: DatePickerProps) => {
  const formatDate = (date: Date) => {
    if (viewMode === 'monthly') {
      return format(date, "MMMM yyyy");
    }
    if (viewMode === 'weekly') {
      const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(date, { weekStartsOn: 1 });
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    return format(date, "MMMM d, yyyy");
  };
  
  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    if (viewMode === 'monthly') {
      // When in monthly mode, select the first day of the month
      const monthStart = startOfMonth(newDate);
      onDateChange(monthStart);
    } else if (viewMode === 'weekly') {
      // When in weekly mode, select the entire week
      const weekStart = startOfWeek(newDate, { weekStartsOn: 1 });
      onDateChange(weekStart);
    } else {
      // In daily mode, just select the day
      onDateChange(newDate);
    }
  };

  // For weekly view, we want to prepare the range of dates for the week
  const getDateRange = (): DateRange => {
    if (viewMode === 'monthly') {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      return { from: start, to: end };
    }
    if (viewMode === 'weekly') {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });
      return { from: start, to: end };
    }
    return { from: date, to: date };
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {viewMode === 'daily' ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            weekStartsOn={1}
            className={cn("p-3 pointer-events-auto")}
          />
        ) : (
          <Calendar
            mode="range"
            selected={getDateRange()}
            onSelect={(newSelection) => {
              if (!newSelection || !('from' in newSelection) || !newSelection.from) return;
              handleSelect(newSelection.from);
            }}
            initialFocus
            showOutsideDays
            weekStartsOn={1}
            className={cn("p-3 pointer-events-auto")}
            showWeekNumber={viewMode === 'weekly'}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
