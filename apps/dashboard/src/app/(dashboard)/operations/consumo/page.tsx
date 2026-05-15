import React from 'react';
import { Activity } from 'lucide-react';
import { PagePlaceholder } from '../../../../shared/ui/page-placeholder';

export default function Page() {
  return <PagePlaceholder title="Consumo" description="Análise de consumo em tempo real" icon={Activity} />;
}
