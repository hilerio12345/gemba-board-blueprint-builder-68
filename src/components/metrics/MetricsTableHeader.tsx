
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MetricsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-100">
        <TableHead className="w-[180px] border-r">Category</TableHead>
        <TableHead className="text-center border-r">Monday</TableHead>
        <TableHead className="text-center border-r">Tuesday</TableHead>
        <TableHead className="text-center border-r">Wednesday</TableHead>
        <TableHead className="text-center border-r">Thursday</TableHead>
        <TableHead className="text-center border-r">Friday</TableHead>
        <TableHead>Notes</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default MetricsTableHeader;
