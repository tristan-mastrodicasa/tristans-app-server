import { BaseEntity, Entity, PrimaryGeneratedColumn, OneToOne, Column, JoinColumn } from 'typeorm';
import { Length } from 'class-validator';
import { User } from './user.entity';

/**
 * The mobile relation entity maps users to mobile devices
 */
@Entity('mobile_relations')
export class MobileRelations extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { length: 50, unique: true })
  @Length(1, 50)
  public deviceId: string; // Mobile device

  @OneToOne(() => User, user => user.mobileDevice, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User; // User associated with it

}
