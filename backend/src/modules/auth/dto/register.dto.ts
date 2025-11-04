import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'contractor@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'ABC Construction (Pty) Ltd', required: false })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({ example: '1234567890123', required: false })
  @IsString()
  @IsOptional()
  companyRegistrationNumber?: string;
}

