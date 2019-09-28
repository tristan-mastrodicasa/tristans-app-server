import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Canvas } from './canvas.entity';
import { User } from './user.entity';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('canvas_invites')
export class CanvasInvites extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @ManyToOne(() => User, user => user.canvasInvites, { onDelete: 'CASCADE' })
  public user: User;

  @ManyToOne(() => Canvas, canvas => canvas.invitations, { onDelete: 'CASCADE' })
  public canvas: Canvas;

}
