import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { CanvasActivity } from '../canvas_activity/canvas_activity.entity';
import { Canvas } from '../canvas/canvas.entity';
import { MemeActivity } from '../meme_activity/meme_activity.entity';

/**
 * The canvas model describes everything stored per canvas
 * @type {Meme}
 */
@Entity('memes')
export class Meme extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar')
  public imagePath: string;

  @Column('boolean')
  public listed: boolean;

  @Column('int')
  public stars: number;

  @Column('datetime')
  public utc: Date;

  @ManyToOne(() => User, user => user.memes)
  public user: User;

  @ManyToOne(() => Canvas, canvas => canvas.memes)
  public canvas: Canvas;

  @OneToMany(() => MemeActivity, memeActivity => memeActivity.meme)
  public activity: MemeActivity[];
}
