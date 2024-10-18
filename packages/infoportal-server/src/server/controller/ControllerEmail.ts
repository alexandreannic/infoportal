import {EmailService} from '../../core/EmailService'

class PrismaClient {
}

export class ControllerEmail {
  constructor(
    private prisma: PrismaClient,
    private service = new EmailService(),
  ) {
  }

  // readonly send = async (req: Request, res: Response, next: NextFunction) => {
  //
  // }
}