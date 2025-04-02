import nodemailer from 'nodemailer'
import {appConf} from '../../core/conf/AppConf.js'
import {app} from '../../index.js'
import {PrismaClient} from '@prisma/client'

export class EmailClient {
  constructor(
    private prisma: PrismaClient,
    private conf = appConf,
    private log = app.logger('EmailClient'),
    private transporter = nodemailer.createTransport({
      host: conf.email.host,
      port: conf.email.port,
      secure: conf.email.port !== 587,
      pool: true,
      auth: {
        user: conf.email.user,
        pass: conf.email.password,
      },
    }),
  ) {}

  public async send({
    to,
    subject,
    html,
    cc,
    createdBy,
    context,
    tags,
  }: {
    cc?: string[]
    createdBy?: string
    context: string
    html: string
    to: string | string[]
    subject: string
    tags?: any
  }): Promise<void> {
    const ensureStr = (_: string | string[]): string => (Array.isArray(_) ? _.join(' ') : _)
    try {
      const params = {
        from: appConf.email.address,
        cc,
        to,
        subject,
        html,
      }
      if (this.conf.production) await this.transporter.sendMail(params)
      this.log.info(`Send email [${context}] ${JSON.stringify({subject, to: ensureStr(to), tags})}.`)
      await this.prisma.emailOutBox.create({
        data: {
          to: ensureStr(to),
          subject,
          content: html,
          createdBy,
          context,
          cc: cc ? ensureStr(cc) : undefined,
          tags,
          deliveredAt: new Date(),
        },
      })
    } catch (error) {
      this.log.error('Failed to send email:', error)
      await this.prisma.emailOutBox.create({
        data: {
          cc: cc ? ensureStr(cc) : undefined,
          to: ensureStr(to),
          subject,
          content: html,
          createdBy,
          context,
          tags,
        },
      })
    }
  }
}
