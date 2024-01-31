import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { PgRealEstate } from './pg-real-estate'

@Entity('users')
export class PgUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column({ unique: true })
  email!: string

  @Column({ name: 'hashed_password' })
  hashedPassword!: string

  @OneToMany(() => PgRealEstate, (realEstate) => realEstate.user)
  realEstates!: PgRealEstate[]
}
