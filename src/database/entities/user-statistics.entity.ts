import { BaseEntity, Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { IsInt, IsOptional } from 'class-validator';
import { User } from './user.entity';

/**
 * The user model describes the statistics of the user using an 1:1 Relation.
 */
@Entity('user_statistics')
export class UserStatistics extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('int', { default: () => '0' })
  @IsOptional()
  @IsInt()
  public influence?: number;

  @Column('int', { default: () => '0' })
  @IsOptional()
  @IsInt()
  public contentNum?: number; // Number of meme's/canvas

  @Column('int', { default: () => '0' })
  @IsOptional()
  @IsInt()
  public followers?: number; // number of followers

  @Column('int', { default: () => '0' })
  @IsOptional()
  @IsInt()
  public following?: number; // number of users following

  @OneToOne(() => User, user => user.statistics, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User; // Foreign key of the user entity used also the primary key

}
