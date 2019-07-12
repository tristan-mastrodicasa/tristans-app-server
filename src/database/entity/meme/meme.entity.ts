import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsBoolean, IsInt, IsDate, IsOptional } from 'class-validator';
import { User } from '../user/user.entity';
import { CanvasActivity } from '../canvas-activity/canvas-activity.entity';
import { Canvas } from '../canvas/canvas.entity';
import { MemeActivity } from '../meme-activity/meme-activity.entity';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('memes')
export class Meme extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { length: 64, unique: true })
  @IsNotEmpty()
  public imagePath: string;

  @Column('boolean')
  @IsBoolean()
  public listed: boolean;

  @Column('int')
  @IsInt()
  public stars: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc: Date;

  @ManyToOne(() => User, user => user.memes)
  public user: User;

  @ManyToOne(() => Canvas, canvas => canvas.memes)
  public canvas: Canvas;

  @OneToMany(() => MemeActivity, memeActivity => memeActivity.meme)
  public activity: MemeActivity[];

}
