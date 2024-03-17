import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateFacultyDto,
  FacultyUserDTO,
  GetFacultyDTO,
  LoginFacultyDTO,
  UpdateFacultyDTO,
} from './dto/faculty.dto';
import { FacultyEntity } from './entities/faculty.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(FacultyEntity)
    private facultyRepository: Repository<FacultyEntity>,
  ) {}

  async findIfExists(id: number): Promise<FacultyEntity> {
    const faculty = await this.facultyRepository.findOneBy({ id: id });
    if (!faculty) throw new NotFoundException();
    else return faculty;
  }

  async register(facultyObject: CreateFacultyDto): Promise<GetFacultyDTO> {
    const { password, ...response } =
      await this.facultyRepository.save(facultyObject);
    return response;
  }

  async login(loginData: LoginFacultyDTO): Promise<any> {
    return await this.facultyRepository.findOneBy({ email: loginData.email });
  }

  async findAll(): Promise<GetFacultyDTO[]> {
    const faculties = await this.facultyRepository.find({});
    return faculties.map(({ password, ...response }) => response);
  }

  async findAllByDesignation(designation: string): Promise<GetFacultyDTO[]> {
    const faculties = await this.facultyRepository.findBy({
      designation: designation,
    });
    return faculties.map(({ password, ...response }) => response);
  }

  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDTO,
  ): Promise<Object> {
    const faculty = await this.findIfExists(id);
    const passwordMatched = await bcrypt.compare(
      updateFacultyDto.userPassword,
      faculty.password,
    );
    if (!passwordMatched) throw new UnauthorizedException();

    if (updateFacultyDto.id || updateFacultyDto.password)
      throw new UnauthorizedException();
    const { userPassword, ...response } = await this.facultyRepository.save({
      id,
      ...updateFacultyDto,
    });
    return response;
  }

  async remove(id: number, user: FacultyUserDTO): Promise<Object> {
    const faculty = await this.findIfExists(id);
    const passwordMatched = await bcrypt.compare(
      user.userPassword,
      faculty.password,
    );
    if (!passwordMatched) throw new UnauthorizedException();

    return await this.facultyRepository.delete({ id: id });
  }

  async getFacultySections(id: number): Promise<Object[]> {
    const faculties =  await this.facultyRepository.find({
      where: { id: id },
      relations: ['sections'],
    });
    return faculties.map(({password, ...response}) => response);
  }

  async getFacultyArticles(id: number): Promise<Object[]> {
    const faculties =  await this.facultyRepository.find({
      where: { id: id },
      relations: ['articles'],
    });
    return faculties.map(({password, ...response}) => response);
  }



}
