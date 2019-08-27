import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { User } from './user.entity';
import { Meme } from './meme.entity';

enum EAction {
  updated,
  starred,
}

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('memes_activity')
export class MemeActivity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('enum', { enum: EAction })
  @IsEnum(EAction)
  public action: EAction;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @ManyToOne(() => Meme, meme => meme.activity)
  public meme: Meme;

  @ManyToOne(() => User, user => user.canvasActivity)
  public user: User;

}
