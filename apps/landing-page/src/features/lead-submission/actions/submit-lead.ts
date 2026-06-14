"use server";

import { leadSchema, LeadFormValues } from "../schema";
import { headers } from "next/headers";

// Simple in-memory rate limiter to prevent spam
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string, limit = 3, windowMs = 60000): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (clientData.count >= limit) {
    return true;
  }

  clientData.count += 1;
  return false;
}

export async function submitLeadAction(values: LeadFormValues) {
  // Apply rate limiting based on client IP
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1";

  if (isRateLimited(ip)) {
    return {
      error: "Muitas solicitações enviadas de seu IP. Por favor, aguarde um minuto e tente novamente.",
    };
  }

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

