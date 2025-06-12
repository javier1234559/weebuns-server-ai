import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BannerService } from './banner.service';
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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/auth/role.guard';
import { AuthGuard } from 'src/common/auth/auth.guard';

@Controller('banner')
@ApiTags('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: BannerResponse,
  })
  findAll(@Query() query: FindAllBannerQuery): Promise<BannerResponse> {
    return this.bannerService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: SingleBannerResponse,
  })
  findOne(@Param('id') id: string): Promise<SingleBannerResponse> {
    return this.bannerService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 201,
    type: SingleBannerResponse,
  })
  create(
    @Body() createBannerDto: CreateBannerDto,
  ): Promise<SingleBannerResponse> {
    return this.bannerService.create(createBannerDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    type: SingleBannerResponse,
  })
  update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ): Promise<SingleBannerResponse> {
    return this.bannerService.update(id, updateBannerDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    type: DeleteBannerResponse,
  })
  remove(@Param('id') id: string): Promise<DeleteBannerResponse> {
    return this.bannerService.remove(id);
  }
}
