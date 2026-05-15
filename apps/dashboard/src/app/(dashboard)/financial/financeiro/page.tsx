import React from 'react';
import { DollarSign } from 'lucide-react';
import { PagePlaceholder } from '../../../../shared/ui/page-placeholder';

export default function Page() {
  return <PagePlaceholder title="Financeiro" description="Faturamento e pagamentos" icon={DollarSign} />;
}
