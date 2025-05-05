
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MetricsTableHeaderProps {
  viewMode?: 'daily' | 'weekly' | 'monthly';
  tier?: string;
}

const MetricsTableHeader = ({ viewMode = 'weekly', tier = 'TIER 1' }: MetricsTableHeaderProps) => {
  const isTierOne = tier === 'TIER 1';
  const isTierFour = tier === 'TIER 4';
  
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
        ) : viewMode === 'daily' ? (
          <TableHead className="text-center border-r">Status</TableHead>
        ) : (
          // Monthly view
          <TableHead className="text-center border-r">Monthly Status</TableHead>
        )}
        
        {/* For higher tier boards, show source information */}
        {!isTierOne && viewMode !== 'monthly' && (
          <TableHead className="text-center border-r">Source</TableHead>
        )}
        
        {viewMode !== 'monthly' && (
          <TableHead className={isTierFour ? "min-w-[250px]" : ""}>Notes</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default MetricsTableHeader;
