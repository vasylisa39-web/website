import type { ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';

interface Props {
  title?: string;
  children: ReactNode;
}

export default function KeyTakeaway({ title = 'Key Takeaway', children }: Props) {
  return (
    <div className="takeaway">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={18} className="text-success-600" />
        <h4 className="font-display font-bold text-success-600">{title}</h4>
      </div>
      <div className="text-sm text-navy-700 leading-relaxed">{children}</div>
    </div>
  );
}
