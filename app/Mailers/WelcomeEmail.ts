import Env from '@ioc:Adonis/Core/Env'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class WelcomeEmail extends BaseMailer {
  constructor(private email: string, private name: string) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from(Env.get('SMTP_EMAIL_SENDER'))
      .to(this.email)
      .subject(`TGL: Seja bem-vindo(a), ${this.name}!`)
      .htmlView('emails/welcome', { name: this.name })
  }
}
