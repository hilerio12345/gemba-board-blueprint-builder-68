
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MetricsTableHeaderProps {
  viewMode?: 'daily' | 'weekly';
}

const MetricsTableHeader = ({ viewMode = 'weekly' }: MetricsTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-100">
        <TableHead className="w-[180px] border-r">Category</TableHead>
        
        {viewMode === 'weekly' ? (
          <>
            <TableHead className="text-center border-r">Monday</TableHead>
            <TableHead className="text-center border-r">Tuesday</TableHead>
            <TableHead className="text-center border-r">Wednesday</TableHead>
            <TableHead className="text-center border-r">Thursday</TableHead>
            <TableHead className="text-center border-r">Friday</TableHead>
          </>
        ) : (
          <TableHead className="text-center border-r">Status</TableHead>
        )}
        
        <TableHead>Notes</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default MetricsTableHeader;
