import type { ReactNode } from "react";
import { Card, CardHeader } from "./Card";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, action, children, className = "" }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader title={title} subtitle={subtitle} action={action} />
      <div className="p-5">{children}</div>
    </Card>
  );
}
