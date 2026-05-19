/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery as useConvexQuery, useMutation as useConvexMutation } from "convex/react";
import { useEffect, useState, useCallback } from "react";

// Check if Convex environment variables are missing or dummy
export const isMockMode = (): boolean => {
  if (typeof window === "undefined") return true;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  return !url || url.includes("dummy.convex.cloud") || url.includes("localhost:3000");
};

// --- TYPE STUBS FOR COMPILATION ---
export interface MockUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "operator" | "provider" | "event_company";
  companyId?: string;
  createdAt: number;
}

export interface MockProject {
  _id: string;
  userId: string;
  name: string;
  category: "Solar" | "Wind" | "Hydro" | "Biomass";
  status: "active" | "in_analysis" | "completed";
  location: string;
  description?: string;
  createdAt: number;
}

export interface MockCompany {
  _id: string;
  name: string;
  type: "client" | "provider";
  cnpj?: string;
  status: "active" | "inactive";
  region?: string;
  capacity?: string;
  rating?: number;
  category?: string;
  createdAt: number;
}

export interface MockEvent {
  _id: string;
  name: string;
  status: "planning" | "active" | "completed" | "cancelled";
  startDate: number;
  endDate: number;
  location: string;
  expectedAttendees: number;
  estimatedConsumption: number;
  toleranceKwh?: number;
  companyId: string;
  companyName: string;
  createdAt: number;
}

export interface MockConsumption {
  _id: string;
  eventId: string;
  predictedKwh: number;
  actualKwh?: number;
  isReconciled?: boolean;
  day: string;
  recordedAt: number;
  createdAt: number;
}

export interface MockAlert {
  id: string;
  eventId: string;
  type: "error" | "warning";
  title: string;
  description: string;
  timestamp: number;
}

// --- LOCAL STORAGE KEY DEFINITIONS ---
const STORAGE_KEYS = {
  USER: "ecovolt_session_user",
  PROJECTS: "ecovolt_mock_projects",
  EVENTS: "ecovolt_mock_events",
  COMPANIES: "ecovolt_mock_companies",
  CONSUMPTIONS: "ecovolt_mock_consumptions",
  ALERTS: "ecovolt_mock_alerts",
  FINANCIALS: "ecovolt_mock_financials",
};

// --- STATIC SEED DATA ---
const DEFAULT_USER: MockUser = {
  _id: "user_ecovolt_admin_001",
  name: "Henrique MC",
  email: "admin@ecovolt.com",
  role: "admin",
  companyId: "company_ecovolt_client_001",
  createdAt: Date.now(),
};

const DEFAULT_COMPANIES: MockCompany[] = [
  {
    _id: "company_ecovolt_client_001",
    name: "EcoVolt Solutions Inc",
    type: "client",
    cnpj: "12.345.678/0001-90",
    status: "active",
    region: "Sudeste",
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "company_ecovolt_client_002",
    name: "Rio Arena Congressos",
    type: "client",
    cnpj: "98.765.432/0001-21",
    status: "active",
    region: "Sudeste",
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "company_ecovolt_provider_001",
    name: "Matrix Clean Energy",
    type: "provider",
    status: "active",
    capacity: "150 MWh/mês",
    rating: 4.9,
    category: "Solar",
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
];

const DEFAULT_PROJECTS: MockProject[] = [
  {
    _id: "proj_solar_norte",
    userId: "user_ecovolt_admin_001",
    name: "Usina Solar Norte",
    category: "Solar",
    status: "active",
    location: "Sobral, CE",
    description: "Parque fotovoltaico com 12.000 painéis bifaciais ativos.",
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "proj_wind_sul",
    userId: "user_ecovolt_admin_001",
    name: "Complexo Eólico Sul",
    category: "Wind",
    status: "in_analysis",
    location: "Chuí, RS",
    description: "Estudo de viabilidade técnica para instalação de 8 turbinas de 4.2MW.",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "proj_hydro_leste",
    userId: "user_ecovolt_admin_001",
    name: "PCH Rio Claro",
    category: "Hydro",
    status: "completed",
    location: "Iguape, SP",
    description: "Pequena Central Hidrelétrica operacionalizada com 15MW de capacidade.",
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
  },
];

const DEFAULT_EVENTS: MockEvent[] = [
  {
    _id: "event_festival_verao",
    name: "Festival de Verão Rio 2026",
    status: "active",
    startDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    location: "Copacabana, Rio de Janeiro",
    expectedAttendees: 15000,
    estimatedConsumption: 45000,
    companyId: "company_ecovolt_client_002",
    companyName: "Rio Arena Congressos",
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "event_forum_tech",
    name: "Fórum de Inovação Energética",
    status: "planning",
    startDate: Date.now() + 10 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 12 * 24 * 60 * 60 * 1000,
    location: "Centro de Convenções, SP",
    expectedAttendees: 3500,
    estimatedConsumption: 12000,
    companyId: "company_ecovolt_client_001",
    companyName: "EcoVolt Solutions Inc",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
];

const DEFAULT_CONSUMPTIONS: MockConsumption[] = [
  { _id: "c_1", eventId: "event_festival_verao", predictedKwh: 8500, actualKwh: 8750, day: "Seg", recordedAt: Date.now() - 4 * 24 * 60 * 60 * 1000, createdAt: Date.now() },
  { _id: "c_2", eventId: "event_festival_verao", predictedKwh: 9000, actualKwh: 9800, day: "Ter", recordedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, createdAt: Date.now() },
  { _id: "c_3", eventId: "event_festival_verao", predictedKwh: 9500, actualKwh: 11400, day: "Qua", recordedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, createdAt: Date.now() }, // Over
  { _id: "c_4", eventId: "event_festival_verao", predictedKwh: 10000, actualKwh: 9600, day: "Qui", recordedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, createdAt: Date.now() },
  { _id: "c_5", eventId: "event_festival_verao", predictedKwh: 12000, actualKwh: 11900, day: "Sex", recordedAt: Date.now(), createdAt: Date.now() },
];

const DEFAULT_ALERTS: MockAlert[] = [
  {
    id: "alert_01",
    eventId: "event_festival_verao",
    type: "warning",
    title: "Sobrecarga de Curva Predictiva",
    description: "O consumo medido na quarta-feira superou a provisão técnica contratada em +20%.",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "alert_02",
    eventId: "event_festival_verao",
    type: "error",
    title: "Fator de Potência Crítico",
    description: "Detecção de oscilação harmônica no Setor de Refrigeração Copacabana B.",
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
  }
];

// Seed the DB in localStorage if empty
const initializeLocalStorage = () => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMPANIES)) {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(DEFAULT_COMPANIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONSUMPTIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONSUMPTIONS, JSON.stringify(DEFAULT_CONSUMPTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(DEFAULT_ALERTS));
  }
};

// --- REACTIVE LISTENER SYSTEM ---
type Listener = () => void;
const listeners = new Set<Listener>();
const notifyAll = () => listeners.forEach(l => l());

// --- MOCK DATABASE HELPER ACTIONS ---
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  initializeLocalStorage();
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  notifyAll();
};

// --- MOCK IMPLEMENTATIONS ---
const mockQueries: Record<string, (args?: any) => any> = {
  "users.getMe": () => {
    return getStorageItem<MockUser | null>(STORAGE_KEYS.USER, DEFAULT_USER);
  },
  "projects.list": (args) => {
    const projs = getStorageItem<MockProject[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    if (args && args.userId) {
      return projs.filter(p => p.userId === args.userId);
    }
    return projs;
  },
  "projects.getById": (args) => {
    const projs = getStorageItem<MockProject[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    return projs.find(p => p._id === args.projectId) || null;
  },
  "events.getEvents": () => {
    return getStorageItem<MockEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
  },
  "companies.getCompanies": () => {
    return getStorageItem<MockCompany[]>(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES);
  },
  "consumptions.getConsumptionByEventId": (args) => {
    const data = getStorageItem<MockConsumption[]>(STORAGE_KEYS.CONSUMPTIONS, DEFAULT_CONSUMPTIONS);
    if (args && args.eventId) {
      return data.filter(c => c.eventId === args.eventId);
    }
    return data;
  },
  "alerts.getAlertsByEventId": (args) => {
    const alerts = getStorageItem<MockAlert[]>(STORAGE_KEYS.ALERTS, DEFAULT_ALERTS);
    if (args && args.eventId) {
      return alerts.filter(a => a.eventId === args.eventId);
    }
    return alerts;
  },
  "metrics.getGlobalStats": (args?: any) => {
    const range = args?.timeRange || "30d";
    const projs = getStorageItem<MockProject[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    const evts = getStorageItem<MockEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    const con = getStorageItem<MockConsumption[]>(STORAGE_KEYS.CONSUMPTIONS, DEFAULT_CONSUMPTIONS);
    
    const activeProjects = projs.filter(p => p.status === 'active').length;
    const totalConsumption = con.reduce((acc, c) => acc + (c.actualKwh || 0), 0);
    
    let multiplier = 1.0;
    if (range === "24h") multiplier = 0.05;
    else if (range === "7d") multiplier = 0.25;
    else if (range === "30d") multiplier = 1.0;
    else if (range === "12m") multiplier = 12.0;

    const scaledConsumption = Math.round(totalConsumption * multiplier);
    const totalSavings = Math.round(scaledConsumption * 0.42);
    const environmentalImpact = Math.round(scaledConsumption * 0.35);

    return {
      activeProjects,
      totalEnergy: scaledConsumption,
      totalSavings,
      totalCO2: environmentalImpact,
      activeEvents: evts.filter(e => e.status === "active").length,
    };
  },
  "metrics.getGlobalChartData": (args?: any) => {
    const range = args?.timeRange || "30d";

    if (range === "24h") {
      const data = [];
      const currentHour = new Date().getHours();
      for (let i = 23; i >= 0; i--) {
        const hour = (currentHour - i + 24) % 24;
        const hourStr = `${hour.toString().padStart(2, "0")}:00`;
        const factor = Math.max(0.1, 1 - Math.abs(hour - 13) / 10);
        const previsto = Math.round(300 + factor * 500 + Math.random() * 50);
        const realizado = Math.round(previsto * (0.92 + Math.random() * 0.15));
        data.push({ name: hourStr, previsto, realizado });
      }
      return data;
    }

    if (range === "7d") {
      const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const data = [];
      const today = new Date().getDay();
      for (let i = 6; i >= 0; i--) {
        const dayIdx = (today - i + 7) % 7;
        const previsto = Math.round(3200 + Math.random() * 800);
        const realizado = Math.round(previsto * (0.95 + Math.random() * 0.1));
        data.push({ name: weekdays[dayIdx], previsto, realizado });
      }
      return data;
    }

    if (range === "30d") {
      const data = [];
      for (let i = 30; i > 0; i -= 3) {
        const day = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
        const dateStr = `${day.getDate()}/${day.getMonth() + 1}`;
        const previsto = Math.round(3800 + Math.random() * 1000);
        const realizado = Math.round(previsto * (0.94 + Math.random() * 0.12));
        data.push({ name: dateStr, previsto, realizado });
      }
      return data;
    }

    return [
      { name: 'Jan', previsto: 4500, realizado: 4200 },
      { name: 'Fev', previsto: 4600, realizado: 4800 },
      { name: 'Mar', previsto: 4800, realizado: 4400 },
      { name: 'Abr', previsto: 5000, realizado: 5200 },
      { name: 'Mai', previsto: 5200, realizado: 4900 },
      { name: 'Jun', previsto: 5500, realizado: 5600 },
      { name: 'Jul', previsto: 5800, realizado: 5400 },
      { name: 'Ago', previsto: 6000, realizado: 6100 },
      { name: 'Set', previsto: 5900, realizado: 5800 },
      { name: 'Out', previsto: 5700, realizado: 5900 },
      { name: 'Nov', previsto: 5500, realizado: 5300 },
      { name: 'Dez', previsto: 5800, realizado: 6000 },
    ];
  }
};

const mockMutations: Record<string, (args: any) => Promise<any>> = {
  "users.storeUser": async () => {
    return DEFAULT_USER;
  },
  "projects.create": async (args) => {
    const projs = getStorageItem<MockProject[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    const newProj: MockProject = {
      _id: `proj_${Date.now()}`,
      userId: args.userId || "user_ecovolt_admin_001",
      name: args.name,
      category: args.category,
      status: "active",
      location: args.location,
      createdAt: Date.now(),
    };
    setStorageItem(STORAGE_KEYS.PROJECTS, [...projs, newProj]);
    return newProj;
  },
  "projects.remove": async (args) => {
    const projs = getStorageItem<MockProject[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    const filtered = projs.filter(p => p._id !== args.projectId);
    setStorageItem(STORAGE_KEYS.PROJECTS, filtered);
    return { success: true };
  },
  "events.createEvent": async (args) => {
    const evts = getStorageItem<MockEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    const comps = getStorageItem<MockCompany[]>(STORAGE_KEYS.COMPANIES, DEFAULT_COMPANIES);
    const company = comps.find(c => c._id === args.companyId);
    
    const newEvent: MockEvent = {
      _id: `event_${Date.now()}`,
      name: args.name,
      status: args.status || "planning",
      startDate: args.startDate,
      endDate: args.endDate,
      location: args.location,
      expectedAttendees: args.expectedAttendees,
      estimatedConsumption: args.estimatedConsumption,
      companyId: args.companyId,
      companyName: company ? company.name : "Entidade Desconhecida",
      createdAt: Date.now(),
    };
    setStorageItem(STORAGE_KEYS.EVENTS, [...evts, newEvent]);
    
    // Automatically generate seed consumptions for visual chart populating
    const baseConsumption = args.estimatedConsumption / 5;
    const newConsumptions = [
      { _id: `c_${Date.now()}_1`, eventId: newEvent._id, predictedKwh: baseConsumption, actualKwh: baseConsumption * 0.9, day: "Seg", recordedAt: Date.now(), createdAt: Date.now() },
      { _id: `c_${Date.now()}_2`, eventId: newEvent._id, predictedKwh: baseConsumption, actualKwh: baseConsumption * 1.05, day: "Ter", recordedAt: Date.now(), createdAt: Date.now() },
      { _id: `c_${Date.now()}_3`, eventId: newEvent._id, predictedKwh: baseConsumption, actualKwh: baseConsumption * 0.98, day: "Qua", recordedAt: Date.now(), createdAt: Date.now() },
    ];
    const existingConsumptions = getStorageItem<MockConsumption[]>(STORAGE_KEYS.CONSUMPTIONS, DEFAULT_CONSUMPTIONS);
    setStorageItem(STORAGE_KEYS.CONSUMPTIONS, [...existingConsumptions, ...newConsumptions]);

    return newEvent;
  },
  "events.updateEvent": async (args) => {
    const evts = getStorageItem<MockEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    const index = evts.findIndex(e => e._id === args.eventId);
    if (index !== -1) {
      evts[index] = {
        ...evts[index],
        name: args.name,
        status: args.status,
        startDate: args.startDate,
        endDate: args.endDate,
        location: args.location,
        expectedAttendees: args.expectedAttendees,
        estimatedConsumption: args.estimatedConsumption,
        companyId: args.companyId,
      };
      setStorageItem(STORAGE_KEYS.EVENTS, evts);
      return evts[index];
    }
    throw new Error("Evento não encontrado");
  },
  "events.removeEvent": async (args) => {
    const evts = getStorageItem<MockEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    const filtered = evts.filter(e => e._id !== args.eventId);
    setStorageItem(STORAGE_KEYS.EVENTS, filtered);
    return { success: true };
  }
};

// --- CUSTOM WRAPPED HOOKS ---
export function useQuery(queryReference: any, args?: any) {
  const isMock = isMockMode();

  // If live Convex is active, delegate directly to native Convex hook
  const liveResult = useConvexQuery(isMock ? undefined : queryReference, args);

  const [state, setState] = useState<any>(undefined);

  // Extract path string from Convex query reference: api.path.to.query._path
  const queryPath: string = queryReference && queryReference._path ? queryReference._path : "";

  const serializedArgs = args ? JSON.stringify(args) : "";

  const runMock = useCallback(() => {
    if (!isMock || !queryPath) return;
    if (args === "skip") {
      setState(undefined);
      return;
    }
    const handler = mockQueries[queryPath];
    if (handler) {
      setState(handler(args));
    } else {
      console.warn(`Query mock sem handler para path: ${queryPath}`);
      setState(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMock, queryPath, serializedArgs]);

  useEffect(() => {
    if (!isMock) return;
    
    Promise.resolve().then(() => {
      runMock();
    });

    listeners.add(runMock);
    return () => {
      listeners.delete(runMock);
    };
  }, [runMock, isMock]);

  if (!isMock) {
    return liveResult;
  }
  return state;
}

export function useMutation(mutationReference: any) {
  const isMock = isMockMode();
  const liveMutation = useConvexMutation(isMock ? undefined : mutationReference);

  const mutationPath: string = mutationReference && mutationReference._path ? mutationReference._path : "";

  const executeMock = useCallback(
    async (args: any) => {
      if (!mutationPath) return;
      const handler = mockMutations[mutationPath];
      if (handler) {
        // Simulate minor network latency for premium organic UX loader transitions
        await new Promise(resolve => setTimeout(resolve, 600));
        return handler(args);
      } else {
        console.warn(`Mutation mock sem handler para path: ${mutationPath}`);
        return { success: true };
      }
    },
    [mutationPath]
  );

  if (!isMock) {
    return liveMutation;
  }
  return executeMock;
}

export function useAction(actionReference: any) {
  // Similar to mutation for full stubs compatibility
  return useMutation(actionReference);
}
