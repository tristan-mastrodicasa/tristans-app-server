import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Canvas } from 'database/entities/canvas.entity';
import { User } from 'database/entities/user.entity';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('canvas_invites')
export class CanvasInvites extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @ManyToOne(() => User, user => user.canvasInvites)
  public user: User;

  @ManyToOne(() => Canvas, canvas => canvas.invitations)
  public canvas: Canvas;

}
