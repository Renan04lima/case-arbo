import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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
}
