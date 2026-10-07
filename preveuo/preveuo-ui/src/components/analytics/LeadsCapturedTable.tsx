import React from 'react';
import { LeadRecord } from '@/types/analytics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@/components/ui';
import { Mail, ArrowUpRight } from 'lucide-react';

interface LeadsCapturedTableProps {
  leads: LeadRecord[];
}

export const LeadsCapturedTable: React.FC<LeadsCapturedTableProps> = ({ leads }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Captured Leads</CardTitle>
          <CardDescription>
            Prospects who completed lead-gate forms within your interactive tours.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
          View CRM Pipeline
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-y border-[#f0f0f4] bg-[#fafafc] text-[#6b7280] font-semibold">
                <th className="py-3 px-6">Prospect Email</th>
                <th className="py-3 px-6">Company</th>
                <th className="py-3 px-6">Lead Trigger Step</th>
                <th className="py-3 px-6">Captured At</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f4]">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#f8f8fc] transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#0f0f1a] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#9ca3af]" />
                    <span>{lead.email}</span>
                  </td>
                  <td className="py-4 px-6 text-[#4b5563] font-medium">{lead.company}</td>
                  <td className="py-4 px-6 text-[#6b7280]">{lead.step}</td>
                  <td className="py-4 px-6 text-[#9ca3af]">{lead.date}</td>
                  <td className="py-4 px-6">
                    <Badge variant="success" size="sm" dot>
                      {lead.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
