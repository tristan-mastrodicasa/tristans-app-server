import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsOptional, IsDate } from 'class-validator';
import { User } from './user.entity';

/**
 * The user model describes everything stored per user.
 */
@Entity('user_network')
export class UserNetwork extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date; // Date of following

  @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
  public user: User; // The user being followed

  @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
  public follower: User; // The user following

}
