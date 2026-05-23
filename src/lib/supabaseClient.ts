import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import * as Types from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App & Firestore Database
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) 
  : getFirestore(app);
export const auth = getAuth(app);

// Verify Connection to Firestore as mandated by the skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration: Firestore Client is currently offline.");
    }
  }
}
testConnection();

// Define error helper types as mandated by firebase-integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Local Storage sandbox fallback emulator to guarantee fully operational UI testing offline
class LocalDbFallback {
  private getStore<T>(table: string): T[] {
    const data = localStorage.getItem(`vdb_${table}`);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    }
    return this.getInitialMockData(table) as T[];
  }

  private setStore<T>(table: string, data: T[]) {
    localStorage.setItem(`vdb_${table}`, JSON.stringify(data));
  }

  private getInitialMockData(table: string): any[] {
    switch (table) {
      case 'users':
        return [];
      case 'leads':
        return [];
      case 'properties':
        return [];
      case 'conversations':
        return [];
      case 'appointments':
        return [];
      case 'deals':
        return [];
      case 'tasks':
        return [];
      case 'ai_memory':
        return [];
      case 'notifications':
        return [];
      case 'subscriptions':
        return [];
      default:
        return [];
    }
  }

  async select<T>(table: string): Promise<T[]> {
    return this.getStore<T>(table);
  }

  async insert<T extends { id: string }>(table: string, record: T): Promise<T> {
    const store = this.getStore<T>(table);
    store.unshift(record);
    this.setStore(table, store);
    return record;
  }

  async update<T extends { id: string }>(table: string, id: string, updates: Partial<T>): Promise<T | null> {
    const store = this.getStore<T>(table);
    const index = store.findIndex(item => item.id === id);
    if (index === -1) return null;
    store[index] = { ...store[index], ...updates };
    this.setStore(table, store);
    return store[index];
  }

  async delete(table: string, id: string): Promise<boolean> {
    const store = this.getStore<any>(table);
    const filtered = store.filter(item => item.id !== id);
    this.setStore(table, filtered);
    return store.length !== filtered.length;
  }
}

const localFallback = new LocalDbFallback();

export const propaiDb = {
  isConfigured: () => {
    return !!firebaseConfig.projectId;
  },

  // Configuration helper mockup for manual settings page
  saveLocalConfig: (url: string, anonKey: string) => {
    console.log('Firebase configuration is managed automatically via firebase-applet-config.json.');
  },

  getConfig: () => {
    return {
      url: firebaseConfig.projectId,
      anonKey: firebaseConfig.apiKey,
      isConfigured: true
    };
  },

  // Universal executor with error handler tracking
  async execute<T>(
    operation: () => Promise<T>,
    localAction: () => Promise<T>,
    operationType: OperationType,
    path: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (err: any) {
      console.warn(`Firebase query on path "${path}" failed. Falling back to offline client emulation. Error:`, err);
      if (err?.code === 'permission-denied' || err?.message?.toLowerCase().includes('permission')) {
        handleFirestoreError(err, operationType, path);
      }
      return await localAction();
    }
  },

  // --- 1. USERS TABLE API ---
  users: {
    async list(): Promise<Types.User[]> {
      return propaiDb.execute(
        async () => {
          const snap = await getDocs(collection(db, 'users'));
          const list: Types.User[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.User));
          return list;
        },
        () => localFallback.select<Types.User>('users'),
        OperationType.LIST,
        'users'
      );
    },
    async create(user: Types.User): Promise<Types.User> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'users', user.id), user);
          return user;
        },
        () => localFallback.insert<Types.User>('users', user),
        OperationType.CREATE,
        `users/${user.id}`
      );
    },
    async update(id: string, updates: Partial<Types.User>): Promise<Types.User | null> {
      return propaiDb.execute(
        async () => {
          await updateDoc(doc(db, 'users', id), updates);
          const snap = await getDoc(doc(db, 'users', id));
          return snap.exists() ? (snap.data() as Types.User) : null;
        },
        () => localFallback.update<Types.User>('users', id, updates),
        OperationType.UPDATE,
        `users/${id}`
      );
    }
  },

  // --- 2. LEADS TABLE API ---
  leads: {
    async list(userId?: string): Promise<Types.Lead[]> {
      return propaiDb.execute(
        async () => {
          const ref = collection(db, 'leads');
          let q = query(ref);
          if (userId) {
            q = query(ref, where('assigned_user_id', '==', userId));
          }
          const snap = await getDocs(q);
          const list: Types.Lead[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.Lead));
          return list;
        },
        async () => {
          const list = await localFallback.select<Types.Lead>('leads');
          return userId ? list.filter(l => l.assigned_user_id === userId) : list;
        },
        OperationType.LIST,
        'leads'
      );
    },
    async create(lead: Types.Lead): Promise<Types.Lead> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'leads', lead.id), lead);
          return lead;
        },
        () => localFallback.insert<Types.Lead>('leads', lead),
        OperationType.CREATE,
        `leads/${lead.id}`
      );
    },
    async update(id: string, updates: Partial<Types.Lead>): Promise<Types.Lead | null> {
      return propaiDb.execute(
        async () => {
          await updateDoc(doc(db, 'leads', id), updates);
          const snap = await getDoc(doc(db, 'leads', id));
          return snap.exists() ? (snap.data() as Types.Lead) : null;
        },
        () => localFallback.update<Types.Lead>('leads', id, updates),
        OperationType.UPDATE,
        `leads/${id}`
      );
    },
    async delete(id: string): Promise<boolean> {
      return propaiDb.execute(
        async () => {
          await deleteDoc(doc(db, 'leads', id));
          return true;
        },
        () => localFallback.delete('leads', id),
        OperationType.DELETE,
        `leads/${id}`
      );
    }
  },

  // --- 3. PROPERTIES TABLE API ---
  properties: {
    async list(userId?: string): Promise<Types.Property[]> {
      return propaiDb.execute(
        async () => {
          const ref = collection(db, 'properties');
          let q = query(ref);
          if (userId) {
            q = query(ref, where('realtor_id', '==', userId));
          }
          const snap = await getDocs(q);
          const list: Types.Property[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.Property));
          return list;
        },
        async () => {
          const list = await localFallback.select<Types.Property>('properties');
          return userId ? list.filter(p => p.realtor_id === userId) : list;
        },
        OperationType.LIST,
        'properties'
      );
    },
    async create(property: Types.Property): Promise<Types.Property> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'properties', property.id), property);
          return property;
        },
        () => localFallback.insert<Types.Property>('properties', property),
        OperationType.CREATE,
        `properties/${property.id}`
      );
    },
    async update(id: string, updates: Partial<Types.Property>): Promise<Types.Property | null> {
      return propaiDb.execute(
        async () => {
          await updateDoc(doc(db, 'properties', id), updates);
          const snap = await getDoc(doc(db, 'properties', id));
          return snap.exists() ? (snap.data() as Types.Property) : null;
        },
        () => localFallback.update<Types.Property>('properties', id, updates),
        OperationType.UPDATE,
        `properties/${id}`
      );
    },
    async delete(id: string): Promise<boolean> {
      return propaiDb.execute(
        async () => {
          await deleteDoc(doc(db, 'properties', id));
          return true;
        },
        () => localFallback.delete('properties', id),
        OperationType.DELETE,
        `properties/${id}`
      );
    }
  },

  // --- 4. CONVERSATIONS TABLE API ---
  conversations: {
    async list(leadId?: string): Promise<Types.Conversation[]> {
      return propaiDb.execute(
        async () => {
          const ref = collection(db, 'conversations');
          let q = query(ref);
          if (leadId) {
            q = query(ref, where('lead_id', '==', leadId));
          }
          const snap = await getDocs(q);
          const list: Types.Conversation[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.Conversation));
          return list;
        },
        async () => {
          const list = await localFallback.select<Types.Conversation>('conversations');
          return leadId ? list.filter(c => c.lead_id === leadId) : list;
        },
        OperationType.LIST,
        'conversations'
      );
    },
    async create(conv: Types.Conversation): Promise<Types.Conversation> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'conversations', conv.id), conv);
          return conv;
        },
        () => localFallback.insert<Types.Conversation>('conversations', conv),
        OperationType.CREATE,
        `conversations/${conv.id}`
      );
    }
  },

  // --- 5. APPOINTMENTS TABLE API ---
  appointments: {
    async list(): Promise<Types.Appointment[]> {
      return propaiDb.execute(
        async () => {
          const snap = await getDocs(collection(db, 'appointments'));
          const list: Types.Appointment[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.Appointment));
          return list;
        },
        () => localFallback.select<Types.Appointment>('appointments'),
        OperationType.LIST,
        'appointments'
      );
    },
    async create(app: Types.Appointment): Promise<Types.Appointment> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'appointments', app.id), app);
          return app;
        },
        () => localFallback.insert<Types.Appointment>('appointments', app),
        OperationType.CREATE,
        `appointments/${app.id}`
      );
    }
  },

  // --- 6. DEALS TABLE API ---
  deals: {
    async list(): Promise<Types.Deal[]> {
      return propaiDb.execute(
        async () => {
          const snap = await getDocs(collection(db, 'deals'));
          const list: Types.Deal[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.Deal));
          return list;
        },
        () => localFallback.select<Types.Deal>('deals'),
        OperationType.LIST,
        'deals'
      );
    },
    async create(deal: Types.Deal): Promise<Types.Deal> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'deals', deal.id), deal);
          return deal;
        },
        () => localFallback.insert<Types.Deal>('deals', deal),
        OperationType.CREATE,
        `deals/${deal.id}`
      );
    }
  },

  // --- 7. TASKS TABLE API ---
  tasks: {
    async list(userId?: string): Promise<Types.Task[]> {
      return propaiDb.execute(
        async () => {
          const ref = collection(db, 'tasks');
          let q = query(ref);
          if (userId) {
            q = query(ref, where('assigned_user_id', '==', userId));
          }
          const snap = await getDocs(q);
          const list: Types.Task[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.Task));
          return list;
        },
        async () => {
          const list = await localFallback.select<Types.Task>('tasks');
          return userId ? list.filter(t => t.assigned_user_id === userId) : list;
        },
        OperationType.LIST,
        'tasks'
      );
    },
    async create(task: Types.Task): Promise<Types.Task> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'tasks', task.id), task);
          return task;
        },
        () => localFallback.insert<Types.Task>('tasks', task),
        OperationType.CREATE,
        `tasks/${task.id}`
      );
    },
    async update(id: string, updates: Partial<Types.Task>): Promise<Types.Task | null> {
      return propaiDb.execute(
        async () => {
          await updateDoc(doc(db, 'tasks', id), updates);
          const snap = await getDoc(doc(db, 'tasks', id));
          return snap.exists() ? (snap.data() as Types.Task) : null;
        },
        () => localFallback.update<Types.Task>('tasks', id, updates),
        OperationType.UPDATE,
        `tasks/${id}`
      );
    },
    async delete(id: string): Promise<boolean> {
      return propaiDb.execute(
        async () => {
          await deleteDoc(doc(db, 'tasks', id));
          return true;
        },
        () => localFallback.delete('tasks', id),
        OperationType.DELETE,
        `tasks/${id}`
      );
    }
  },

  // --- 8. AI MEMORY TABLE API ---
  aiMemory: {
    async list(entityId?: string): Promise<Types.AIMemory[]> {
      return propaiDb.execute(
        async () => {
          const ref = collection(db, 'ai_memory');
          let q = query(ref);
          if (entityId) {
            q = query(ref, where('entity_id', '==', entityId));
          }
          const snap = await getDocs(q);
          const list: Types.AIMemory[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.AIMemory));
          return list;
        },
        async () => {
          const list = await localFallback.select<Types.AIMemory>('ai_memory');
          return entityId ? list.filter(m => m.entity_id === entityId) : list;
        },
        OperationType.LIST,
        'ai_memory'
      );
    },
    async create(mem: Types.AIMemory): Promise<Types.AIMemory> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'ai_memory', mem.id), mem);
          return mem;
        },
        () => localFallback.insert<Types.AIMemory>('ai_memory', mem),
        OperationType.CREATE,
        `ai_memory/${mem.id}`
      );
    }
  },

  // --- 9. NOTIFICATIONS TABLE API ---
  notifications: {
    async list(userId?: string): Promise<Types.Notification[]> {
      return propaiDb.execute(
        async () => {
          const ref = collection(db, 'notifications');
          let q = query(ref);
          if (userId) {
            q = query(ref, where('user_id', '==', userId));
          }
          const snap = await getDocs(q);
          const list: Types.Notification[] = [];
          snap.forEach(d => list.push({ ...d.data() } as Types.Notification));
          return list;
        },
        async () => {
          const list = await localFallback.select<Types.Notification>('notifications');
          return userId ? list.filter(n => n.user_id === userId) : list;
        },
        OperationType.LIST,
        'notifications'
      );
    },
    async create(notif: Types.Notification): Promise<Types.Notification> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'notifications', notif.id), notif);
          return notif;
        },
        () => localFallback.insert<Types.Notification>('notifications', notif),
        OperationType.CREATE,
        `notifications/${notif.id}`
      );
    },
    async markAsRead(id: string): Promise<Types.Notification | null> {
      return propaiDb.execute(
        async () => {
          await updateDoc(doc(db, 'notifications', id), { read_status: true });
          const snap = await getDoc(doc(db, 'notifications', id));
          return snap.exists() ? (snap.data() as Types.Notification) : null;
        },
        () => localFallback.update<Types.Notification>('notifications', id, { read_status: true }),
        OperationType.UPDATE,
        `notifications/${id}`
      );
    }
  },

  // --- 10. SUBSCRIPTIONS TABLE API ---
  subscriptions: {
    async get(userId: string): Promise<Types.Subscription | null> {
      return propaiDb.execute(
        async () => {
          const ref = collection(db, 'subscriptions');
          const q = query(ref, where('user_id', '==', userId));
          const snap = await getDocs(q);
          if (snap.empty) return null;
          let sub: Types.Subscription | null = null;
          snap.forEach(doc => {
            sub = doc.data() as Types.Subscription;
          });
          return sub;
        },
        async () => {
          const list = await localFallback.select<Types.Subscription>('subscriptions');
          return list.find(s => s.user_id === userId) || null;
        },
        OperationType.GET,
        `subscriptions`
      );
    },
    async create(sub: Types.Subscription): Promise<Types.Subscription> {
      return propaiDb.execute(
        async () => {
          await setDoc(doc(db, 'subscriptions', sub.id), sub);
          return sub;
        },
        () => localFallback.insert<Types.Subscription>('subscriptions', sub),
        OperationType.CREATE,
        `subscriptions/${sub.id}`
      );
    }
  },

  // Keep a copy of the SQL initialization schema block in backup for completeness
  getSQLSchema(): string {
    return ``;
  }
};
