import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { CanvasActivity } from '../canvas_activity/canvas_activity.entity';
import { Meme } from '../meme/meme.entity';

// Enum for the visibility levels of the canvas
enum EVisibility {
  public,
  follwers,
  followBacks,
  specificUsers,
}

/**
 * The canvas model describes everything stored per canvas
 * @type {Canvas}
 */
@Entity('canvas')
export class Canvas extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('text')
  public description: string;

  @Column('varchar')
  public imagePath: string;

  @Column('enum', { enum: EVisibility })
  public visibility: EVisibility;

  @Column('int')
  public stars: number;

  @Column('datetime')
  public utc: Date;

  @ManyToOne(() => User, user => user.canvas)
  public user: User;

  @OneToMany(() => CanvasActivity, canvasActivity => canvasActivity.canvas)
  public activity: CanvasActivity[];

  @OneToMany(() => Meme, meme => meme.canvas)
  public memes: Meme[];
}
