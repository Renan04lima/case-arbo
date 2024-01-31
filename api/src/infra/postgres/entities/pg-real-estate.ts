import { TYPES_OF_REAL_ESTATE } from '@/domain/entities/real-estate'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { PgUser } from './pg-user'

@Entity('real_estate')
export class PgRealEstate {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  zipcode!: string

  @Column()
  street!: string

  @Column()
  number!: number

  @Column({ nullable: true })
  complement?: string

  @Column()
  neighborhood!: string

  @Column()
  city!: string

  @Column()
  state!: string

  @Column()
  type!: TYPES_OF_REAL_ESTATE

  @Column()
  value!: number

  @Column('text', { array: true })
  images_url!: string[]

  @Column()
  user_id!: string

  @ManyToOne(() => PgUser, (user) => user.realEstates)
  @JoinColumn({ name: 'user_id' })
  user!: PgUser
}
