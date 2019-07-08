import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { CanvasActivity } from '../canvas_activity/canvas_activity.entity';
import { Canvas } from '../canvas/canvas.entity';
import { Meme } from '../meme/meme.entity';

enum EAction {
  updated,
  starred,
}

/**
 * The canvas model describes everything stored per canvas
 * @type {MemeActivity}
 */
@Entity('memes_activity')
export class MemeActivity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('enum', { enum: EAction })
  public action: EAction;

  @Column('datetime')
  public utc: Date;

  @ManyToOne(() => Meme, meme => meme.activity)
  public meme: Meme;

  @ManyToOne(() => User, user => user.canvasActivity)
  public user: User;
}
