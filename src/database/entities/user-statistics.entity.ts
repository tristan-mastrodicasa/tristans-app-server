import { BaseEntity, Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsInt } from 'class-validator';
import { User } from 'database/entities/user.entity';

/**
 * The user model describes the statistics of the user using an 1:1 Relation.
 */
@Entity('user_statistics')
export class UserStatistics extends BaseEntity {

  @Column('int')
  @IsInt()
  public influence: number;

  @Column('int')
  @IsInt()
  public contentNum: number; // Number of meme's/canvas

  @Column('int')
  @IsInt()
  public followers: number; // number of followers

  @Column('int')
  @IsInt()
  public following: number; // number of users following

  @OneToOne(() => User, user => user.statistics, { primary: true })
  @JoinColumn()
  public user: User; // Foreign key of the user entity used also the primary key

}
