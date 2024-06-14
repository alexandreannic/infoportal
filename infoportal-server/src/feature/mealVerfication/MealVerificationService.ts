import {MealVerificationStatus, PrismaClient} from '@prisma/client'
import {app, AppLogger} from '../../index'
import {InferType} from 'yup'
import {MealVerificationSchema} from '../../server/controller/ControllerMealVerification'
import {UUID} from '@infoportal-common'
import {MealVerificationAnswersStatus} from './MealVerificationType'

export type MealVerificationCreate = InferType<typeof MealVerificationSchema.create> & {
  createdBy: string
}

export class MealVerificationService {

  constructor(
    private prisma: PrismaClient,
    private log: AppLogger = app.logger('MealVerificationService'),
  ) {
  }

  readonly create = async ({answers, ...body}: MealVerificationCreate) => {
    const parent = await this.prisma.mealVerification.create({
      data: body,
    })
    return this.prisma.mealVerificationAnswers.createMany({
      data: answers.map(_ => ({
        mealVerificationId: parent.id,
        koboAnswerId: _.koboAnswerId,
        status: _.status,
      }))
    })
  }

  readonly getAll = async () => {
    return this.prisma.mealVerification.findMany({
      orderBy: {createdAt: 'desc'}
    })
  }

  readonly getAnswers = async (mealVerificationId: UUID) => {
    return this.prisma.mealVerificationAnswers.findMany({
      where: {
        mealVerificationId,
      }
    })
  }

  readonly remove = async (mealVerificationId: UUID) => {
    await this.prisma.mealVerificationAnswers.deleteMany({where: {mealVerificationId}})
    await this.prisma.mealVerification.delete({where: {id: mealVerificationId}})
  }

  readonly update = async (id: UUID, status?: MealVerificationStatus) => {
    return this.prisma.mealVerification.update({
      where: {id},
      data: {
        status,
      }
    })
  }

  readonly updateAnswerStatus = async (id: UUID, selected?: MealVerificationAnswersStatus) => {
    await this.prisma.mealVerificationAnswers.update({
      where: {id},
      data: {
        status: selected ?? null
      }
    })
  }
}