import { ContentStatus, Prisma } from '@prisma/client';

const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    // essay: {
    //   async findMany({ args, query }) {
    //     // Properly merge where conditions
    //     args.where = {
    //       AND: [args.where || {}, { NOT: { status: ContentStatus.deleted } }],
    //     };
    //     return query(args);
    //   },

    //   async findFirst({ args, query }) {
    //     args.where = {
    //       AND: [args.where || {}, { NOT: { status: ContentStatus.deleted } }],
    //     };
    //     return query(args);
    //   },

    //   async findUnique({ args, query }) {
    //     // For findUnique, convert to findFirst but keep the unique condition
    //     const { where, ...rest } = args;
    //     return query({
    //       ...rest,
    //       action: 'findFirst',
    //       where: {
    //         ...where, // Keep the unique identifier
    //         status: { not: ContentStatus.deleted }, // Add NOT deleted condition
    //       },
    //     });
    //   },

    //   async delete({ args, query }) {
    //     return query({
    //       ...args,
    //       data: { status: ContentStatus.deleted },
    //     });
    //   },

    //   async deleteMany({ args, query }) {
    //     return query({
    //       ...args,
    //       data: { status: ContentStatus.deleted },
    //     });
    //   },

    //   async update({ args, query }) {
    //     // For update, keep the unique identifier and add NOT deleted condition
    //     const { where, data, ...rest } = args;
    //     return query({
    //       ...rest,
    //       data,
    //       where: {
    //         ...where, // Keep the unique identifier
    //         status: { not: ContentStatus.deleted }, // Add NOT deleted condition
    //       },
    //     });
    //   },

    //   async updateMany({ args, query }) {
    //     const { where, ...rest } = args;
    //     return query({
    //       ...rest,
    //       where: {
    //         AND: [where || {}, { NOT: { status: ContentStatus.deleted } }],
    //       },
    //     });
    //   },

    //   async count({ args, query }) {
    //     args.where = {
    //       AND: [args.where || {}, { NOT: { status: ContentStatus.deleted } }],
    //     };
    //     return query(args);
    //   },
    // },
  },
});

export { softDeleteExtension };
