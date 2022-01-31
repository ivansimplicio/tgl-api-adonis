import Env from '@ioc:Adonis/Core/Env'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class CallPlayerToPlayEmail extends BaseMailer {
  constructor(private email: string, private name: string) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from(Env.get('SMTP_EMAIL_SENDER'))
      .to(this.email)
      .subject('TGL: Sentimos sua falta...')
      .htmlView('emails/call_player_to_play', { name: this.name })
  }
}
