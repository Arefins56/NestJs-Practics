import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtService: JwtService
    ) { }

    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        // const exists = this.userRepo.findOne(username);

        // if(exists){
        //     // ... throw some error
        // }

        // const salt = await bcrypt.genSalt();
        // console.log(salt);

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        // const user = this.userRepo.create({ ...authCredentialsDto });

        try {
            //   await this.userRepo.save(user);
            await user.save();
        } catch (error) {
            // console.log(error.code);
            if (error.code === '23505') {
                throw new ConflictException('Username already exists.');
            } else {
                throw new InternalServerErrorException('');
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const username = await this.validateUserPassword(authCredentialsDto);
        // console.log(username);

        if (!username) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepo.findOne({ where: { username } });

        if (user && (await user.validatePassword(password))) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
