import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { User } from './user.entity';
import { Meme } from './meme.entity';
import { EMemeActions } from 'shared/models';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('memes_reacts')
export class MemeReacts extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('enum', { enum: EMemeActions })
  @IsEnum(EMemeActions)
  public action: EMemeActions;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @ManyToOne(() => Meme, meme => meme.reacts, { onDelete: 'CASCADE' })
  public meme: Meme;

  @ManyToOne(() => User, user => user.canvasReacts, { onDelete: 'CASCADE' })
  public user: User;

}
