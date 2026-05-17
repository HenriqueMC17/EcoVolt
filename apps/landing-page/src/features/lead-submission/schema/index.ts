import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  company: z.string().min(2, "Empresa é obrigatória"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  role: z.string().min(2, "Cargo é obrigatório"),
  segment: z.string().min(1, "Selecione um segmento"),
  message: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
