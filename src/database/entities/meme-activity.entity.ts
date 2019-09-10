import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { User } from 'database/entities/user.entity';
import { Meme } from 'database/entities/meme.entity';
import { EMemeActions } from 'models/enums';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('memes_activity')
export class MemeActivity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('enum', { enum: EMemeActions })
  @IsEnum(EMemeActions)
  public action: EMemeActions;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @ManyToOne(() => Meme, meme => meme.activity)
  public meme: Meme;

  @ManyToOne(() => User, user => user.canvasActivity)
  public user: User;

}
