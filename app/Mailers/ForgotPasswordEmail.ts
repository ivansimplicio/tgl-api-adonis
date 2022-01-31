import Env from '@ioc:Adonis/Core/Env'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class ForgotPasswordEmail extends BaseMailer {
  constructor(private email: string, private name: string, private resetPasswordUrl: string) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from(Env.get('SMTP_EMAIL_SENDER'))
      .to(this.email)
      .subject('TGL: Recuperação de senha')
      .htmlView('emails/forgot_password', { name: this.name, url: this.resetPasswordUrl })
  }
}
