import { ContentStatus, Prisma } from '@prisma/client';

type PaginatedQuery = {
  skip?: number;
  take?: number;
  where?: any;
  orderBy?: any;
};

export const notDeletedQuery = {
  deletedAt: null,
};

export const isPublishedQuery = {
  status: ContentStatus.published,
};

export const softDeleteQuery = (id: string): Prisma.UserUpdateArgs => ({
  where: { id },
  data: { deletedAt: new Date() },
});

export const paginationQuery = (
  page?: number,
  perPage?: number,
): PaginatedQuery => {
  if (!page || !perPage) return {};
  return {
    skip: (page - 1) * perPage,
    take: perPage,
  };
};

export const searchQuery = (search: string, fields: string[]) => {
  if (!search) return {};
  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' },
    })),
  };
};
