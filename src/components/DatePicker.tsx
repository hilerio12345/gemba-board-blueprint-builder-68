
import * as React from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  viewMode?: 'daily' | 'weekly';
}

const DatePicker = ({ date, onDateChange, viewMode = 'daily' }: DatePickerProps) => {
  const formatDate = (date: Date) => {
    if (viewMode === 'weekly') {
      const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(date, { weekStartsOn: 1 });
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    return format(date, "MMMM d, yyyy");
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
        <Calendar
          mode={viewMode === 'weekly' ? "single" : "single"}
          selected={date}
          onSelect={(newDate) => newDate && onDateChange(newDate)}
          initialFocus
          showOutsideDays={viewMode === 'weekly'}
          weekStartsOn={1}
          className={cn("p-3 pointer-events-auto")}
          ISOWeek={viewMode === 'weekly'}
          showWeekNumber={viewMode === 'weekly'}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
