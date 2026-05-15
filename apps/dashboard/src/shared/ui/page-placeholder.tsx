import React from 'react';
import { Card, CardContent } from './card';

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export function PagePlaceholder({ title, description, icon: Icon }: PagePlaceholderProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted mt-1 text-sm">{description}</p>
      </div>
      
      <Card className="flex-1 border-dashed border-2 border-white/10 bg-white/5 flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-muted mb-4">
            <Icon size={32} />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Módulo em Desenvolvimento</h3>
          <p className="text-sm text-muted max-w-sm">
            Esta área ({title}) está sendo reestruturada para o novo padrão Enterprise da EcoVolt e estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
