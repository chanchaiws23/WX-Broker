type UserRecord = {
  id: number;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

type BrokerRecord = {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  website: string;
  brokerType: string;
  createdAt: Date;
  updatedAt: Date;
};

export function createTestPrisma() {
  const users: UserRecord[] = [];
  const brokers: BrokerRecord[] = [];
  let nextUserId = 1;
  let nextBrokerId = 1;

  return {
    user: {
      findUnique: async ({ where }: { where: { id?: number; email?: string } }) => {
        if (where.id !== undefined) return users.find((user) => user.id === where.id) ?? null;
        if (where.email !== undefined) return users.find((user) => user.email === where.email) ?? null;
        return null;
      },
      create: async ({ data }: { data: Omit<UserRecord, "id" | "createdAt" | "updatedAt" | "deletedAt"> }) => {
        const now = new Date();
        const user = { id: nextUserId++, ...data, createdAt: now, updatedAt: now, deletedAt: null };
        users.push(user);
        return user;
      },
    },
    broker: {
      findMany: async ({ where }: { where?: { name?: { contains: string; mode?: string }; brokerType?: string } }) => {
        let results = [...brokers];
        if (where?.name?.contains) {
          const search = where.name.contains.toLowerCase();
          results = results.filter((broker) => broker.name.toLowerCase().includes(search));
        }
        if (where?.brokerType) {
          results = results.filter((broker) => broker.brokerType === where.brokerType);
        }
        return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      },
      findUnique: async ({ where }: { where: { slug: string } }) =>
        brokers.find((broker) => broker.slug === where.slug) ?? null,
      create: async ({ data }: { data: Omit<BrokerRecord, "id" | "createdAt" | "updatedAt"> }) => {
        const now = new Date();
        const broker = { id: nextBrokerId++, ...data, createdAt: now, updatedAt: now };
        brokers.push(broker);
        return broker;
      },
    },
    __data: { users, brokers },
  };
}
