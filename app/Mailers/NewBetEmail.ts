import Env from '@ioc:Adonis/Core/Env'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class NewBetEmail extends BaseMailer {
  constructor(private email: string, private name: string, private amount: number) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from(Env.get('SMTP_EMAIL_SENDER'))
      .to(this.email)
      .subject('TGL: New Bet made!')
      .htmlView('emails/new_bet', { name: this.name, amount: this.amount })
  }
}
