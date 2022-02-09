import Producer from 'App/Services/kafka/KafkaService'

export default class ProducerService {
  public async produceTopicWelcomeEmail(user: any) {
    this.sendToTopic('welcome', {}, user, `TGL: Seja bem-vindo(a), ${user.name}!`)
  }

  public async produceTopicForgotPasswordEmail(user: any, url: string) {
    this.sendToTopic('forgot_password', { url }, user, 'TGL: Recuperação de senha')
  }

  public async produceTopicNewBetEmail(user: any, bets: any[], amount: number) {
    this.sendToTopic('new_bet', { bets, amount }, user, 'TGL: Nova aposta realizada!')
  }

  public async produceTopicCallPlayersEmail(user: any) {
    this.sendToTopic('call_players', {}, user, 'TGL: Sentimos sua falta...')
  }

  public async produceTopicNotifyAdminEmail(admin: any, user: any, amount: number) {
    this.sendToTopic('notify_admin', { user, amount }, admin, 'TGL/Admin: Nova aposta realizada!')
  }

  private async sendToTopic(topic: string, content: {}, user: any, subject: string) {
    const message = { user, subject, content }
    await new Producer().send(topic.toString(), [{ value: JSON.stringify(message) }])
  }
}
