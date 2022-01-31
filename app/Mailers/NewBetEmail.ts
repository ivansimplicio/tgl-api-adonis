import Env from '@ioc:Adonis/Core/Env'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class NewBetEmail extends BaseMailer {
  constructor(
    private email: string,
    private name: string,
    private bets: any[],
    private amount: number
  ) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from(Env.get('SMTP_EMAIL_SENDER'))
      .to(this.email)
      .subject('TGL: Nova aposta realizada!')
      .htmlView('emails/new_bet', { name: this.name, bets: this.bets, amount: this.amount })
  }
}
