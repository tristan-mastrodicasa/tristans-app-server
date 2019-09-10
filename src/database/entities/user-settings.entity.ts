import { BaseEntity, Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsInt } from 'class-validator';
import { User } from 'database/entities/user.entity';

/**
 * The user model describes the statistics of the user using an 1:1 Relation.
 */
@Entity('user_settings')
export class UserSettings extends BaseEntity {

  @Column('int')
  @IsInt()
  public influence: number;

  @Column('boolean', { default: () => 'true' })
  public nCanvasInvites: boolean; // Get notifications when people invite you to meme their canvas

  @Column('boolean', { default: () => 'true' })
  public nSubscriptionUploadedACanvas: boolean; // Get notifications when the people you follow upload canvases

  @Column('boolean', { default: () => 'true' })
  public nUserMemedMyCanvas: boolean; // Get notifications for when your canvas is memed

  @Column('boolean', { default: () => 'true' })
  public nPointsUpdate: boolean; // Get notifications for when you reach certain influence point thresholds

  @OneToOne(() => User, user => user.settings, { primary: true })
  @JoinColumn()
  public user: User; // Foreign key of the user entity used also the primary key

}
