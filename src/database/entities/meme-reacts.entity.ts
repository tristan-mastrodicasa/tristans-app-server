import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Meme } from './meme.entity';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('meme_reacts')
export class MemeReacts extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @ManyToOne(() => Meme, meme => meme.reacts, { onDelete: 'CASCADE' })
  public meme: Meme;

  @ManyToOne(() => User, user => user.canvasReacts, { onDelete: 'CASCADE' })
  public user: User;

}
