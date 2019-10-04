import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Canvas } from './canvas.entity';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('canvas_reacts')
export class CanvasReacts extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @ManyToOne(() => Canvas, canvas => canvas.reacts, { onDelete: 'CASCADE' })
  public canvas: Canvas;

  @ManyToOne(() => User, user => user.canvasReacts, { onDelete: 'CASCADE' })
  public user: User;

}
