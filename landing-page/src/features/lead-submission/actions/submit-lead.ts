"use server";

import { leadSchema, LeadFormValues } from "../schema";

export async function submitLeadAction(values: LeadFormValues) {
  // Validate data on the server
  const validatedFields = leadSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Dados inválidos. Por favor, verifique os campos.",
    };
  }

  // Simulate enterprise logic (e.g., save to DB, send to CRM, trigger email)
  console.log("Processing lead discovery:", validatedFields.data);
  
  // Artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: "Obrigado! Um especialista da EcoVolt entrará em contato em breve.",
  };
}
