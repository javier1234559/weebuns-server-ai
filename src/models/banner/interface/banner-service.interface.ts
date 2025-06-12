import {
  CreateBannerDto,
  FindAllBannerQuery,
  UpdateBannerDto,
} from '../dto/banner.request';
import {
  BannerResponse,
  DeleteBannerResponse,
  SingleBannerResponse,
} from '../dto/banner.response';

export interface IBannerService {
  findAll(query: FindAllBannerQuery): Promise<BannerResponse>;
  findById(id: string): Promise<SingleBannerResponse>;
  create(createBannerDto: CreateBannerDto): Promise<SingleBannerResponse>;
  update(
    id: string,
    updateBannerDto: UpdateBannerDto,
  ): Promise<SingleBannerResponse>;
  remove(id: string): Promise<DeleteBannerResponse>;
}
