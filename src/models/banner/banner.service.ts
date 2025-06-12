import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { IBannerService } from './interface/banner-service.interface';
import {
  CreateBannerDto,
  FindAllBannerQuery,
  UpdateBannerDto,
} from './dto/banner.request';
import {
  BannerResponse,
  DeleteBannerResponse,
  SingleBannerResponse,
} from './dto/banner.response';
import {
  paginationQuery,
  searchQuery,
} from 'src/common/helper/prisma-queries.helper';
import { calculatePagination } from 'src/common/utils/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class BannerService implements IBannerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindAllBannerQuery): Promise<BannerResponse> {
    const { page, perPage, search, orderIndex } = query;

    const queryOptions: Prisma.BannerFindManyArgs = {
      where: {
        ...(search ? searchQuery(search, ['title']) : {}),
        ...(orderIndex !== undefined ? { orderIndex } : {}),
      },
      ...paginationQuery(page, perPage),
      orderBy: { orderIndex: 'asc' as const },
    };

    const [banners, totalItems] = await Promise.all([
      this.prisma.banner.findMany(queryOptions),
      this.prisma.banner.count({ where: queryOptions.where }),
    ]);

    return {
      data: banners,
      pagination: calculatePagination(totalItems, query),
    };
  }

  async findById(id: string): Promise<SingleBannerResponse> {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    return { data: banner };
  }

  async create(
    createBannerDto: CreateBannerDto,
  ): Promise<SingleBannerResponse> {
    const banner = await this.prisma.banner.create({
      data: createBannerDto,
    });

    return { data: banner };
  }

  async update(
    id: string,
    updateBannerDto: UpdateBannerDto,
  ): Promise<SingleBannerResponse> {
    const banner = await this.prisma.banner.update({
      where: { id },
      data: updateBannerDto,
    });

    return { data: banner };
  }

  async remove(id: string): Promise<DeleteBannerResponse> {
    await this.prisma.banner.delete({
      where: { id },
    });

    return { message: 'Banner deleted successfully' };
  }
}
