import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import { UserResponse } from './dto/auth-response.dto';
import { TeacherDto, ProfileDto } from './dto/user-request.dto';
import {
  DeleteUserResponse,
  FindAllUserQuery,
  UsersResponse,
} from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiQuery({ type: FindAllUserQuery })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UsersResponse,
  })
  findAll(@Query() dto: FindAllUserQuery): Promise<UsersResponse> {
    return this.userService.findAll(dto);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
  })
  findById(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.findById(id);
  }

  @Post('teachers')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserResponse,
  })
  createTeacher(@Body() teacherDto: TeacherDto): Promise<UserResponse> {
    return this.userService.createTeacher(teacherDto);
  }

  @Patch('teachers/:id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
  })
  updateTeacher(
    @Param('id') id: string,
    @Body() teacherDto: TeacherDto,
  ): Promise<UserResponse> {
    return this.userService.updateTeacher(id, teacherDto);
  }

  @Patch('teachers/:id/profile')
  @Roles(UserRole.TEACHER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
  })
  updateTeacherProfile(
    @Param('id') id: string,
    @Body() profileDto: ProfileDto,
  ): Promise<UserResponse> {
    return this.userService.updateProfileTeacher(id, profileDto);
  }

  @Patch('students/:id/profile')
  @Roles(UserRole.USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
  })
  updateStudentProfile(
    @Param('id') id: string,
    @Body() profileDto: ProfileDto,
  ): Promise<UserResponse> {
    return this.userService.updateProfileStudent(id, profileDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteUserResponse,
  })
  remove(@Param('id') id: string): Promise<DeleteUserResponse> {
    return this.userService.remove(id);
  }
}
