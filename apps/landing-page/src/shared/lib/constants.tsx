import React from "react";
import { Zap, ShieldCheck, Building2 } from "lucide-react";

export const NAV_LINKS = [
  { name: "Início", href: "#" },
  { name: "Solução", href: "#solucao" },
  { name: "Como Funciona", href: "#como-funciona" },
  { name: "Plataforma", href: "#plataforma" },
  { name: "Benefícios", href: "#beneficios" },
  { name: "Contato", href: "#contato" },
];

export const BENEFITS_DATA = [
  {
    icon: <Zap className="w-5 h-5 text-emerald-500" />,
    title: "Gestão Inteligente",
    description: "Controle e previsibilidade energética com dados em tempo real.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    title: "Eco-Compliance",
    description: "Certificação e auditoria de fontes renováveis para ESG.",
  },
  {
    icon: <Building2 className="w-5 h-5 text-emerald-500" />,
    title: "Para o seu ecossistema",
    description: "Soluções customizadas de infraestrutura B2B escalável.",
  },
];

export const FOOTER_LINKS = [
  {
    title: "Produto",
    links: [
      { label: "Como Funciona", href: "/product/how-it-works" },
      { label: "Plataforma", href: "/product/platform" },
      { label: "Segurança", href: "/product/security" },
      { label: "Preços", href: "/product/pricing" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre Nós", href: "/company/about" },
      { label: "Carreiras", href: "/company/careers" },
      { label: "Blog", href: "/company/blog" },
      { label: "Sustentabilidade", href: "/company/sustainability" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Documentação", href: "/resources/docs" },
      { label: "API Reference", href: "/resources/api-reference" },
      { label: "Status", href: "/resources/status" },
      { label: "Suporte", href: "/resources/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "/legal/privacy" },
      { label: "Termos de Uso", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Compliance", href: "/legal/compliance" },
    ],
  },
];
