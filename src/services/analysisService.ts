import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAnalysisInput {
  // Seed condition inputs
  headShape: number;
  agility: number;
  skinColor: number;
  defect: number;
  cfHead: number;
  cfAgility: number;
  cfSkin: number;
  cfDefect: number;

  // Pond condition inputs
  ph: number;
  temperature: number;

  // Feed type
  feedType: number;

  // Results
  seedCondition: string;
  pondCondition: string;
  finalResult: string;
  cfSeed: number;
  cfPond: number;
  cfFinal: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function createAnalysis(input: CreateAnalysisInput) {
  return prisma.analysis.create({
    data: input,
  });
}

export async function getAnalyses({ page = 1, limit = 10 }: PaginationParams = {}) {
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.analysis.count(),
    prisma.analysis.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAnalysisById(id: string) {
  return prisma.analysis.findUnique({
    where: { id },
  });
} 