import {Prisma, PrismaClient} from '@prisma/client'
import {GlobalEvent} from '../../../core/GlobalEvent'
import {KoboAnswerFlat, KoboId} from '../../connector/kobo/KoboClient/type/KoboAnswer'
import {koboFormsId} from '../../../core/conf/KoboFormsId'
import {KoboUnifiedBasicneeds} from './KoboUnifiedMapperBasicneeds'
import {KoboUnifiedCreate, KoboUnifiedOrigin} from './KoboUnifiedType'
import {logger, Logger} from '../../../helper/Logger'
import {KoboService} from '../KoboService'
import {UUID} from '@infoportal-common'
import {seq} from '@alexandreannic/ts-utils'
import Event = GlobalEvent.Event

class KoboUnifiedMapper {
  static readonly map: Record<KoboId, (_: KoboAnswerFlat<any>) => KoboUnifiedCreate> = {
    [koboFormsId.prod.bn_re]: KoboUnifiedBasicneeds.bn_re,
  }
}

export class KoboUnifiedService {

  constructor(
    private prisma: PrismaClient,
    private kobo = new KoboService(prisma),
    private event = GlobalEvent.Class.getInstance(),
    private log: Logger = logger('KoboSyncServer'),
  ) {
  }

  readonly start = () => {
    this.log.info(`Start listening to ${Event.KOBO_FORM_SYNCHRONIZED}`)
    this.event.listen(Event.KOBO_FORM_SYNCHRONIZED, this.synchronize)
  }

  private build = async ({
    formId,
  }: {formId: KoboId}) => {
    const answers = await this.kobo.searchAnswers({formId}).then(_ => _.data)

  }

  private synchronize = async ({
    formId,
  }: {
    formId: KoboId
  }) => {
    const mapper = KoboUnifiedMapper.map[formId]
    if (!mapper) {
      this.log.error(`No mapper implemented for ${formId}`)
      return
    }
    this.log.info(`Fetch remote answers...`)
    const remoteAnswers: KoboUnifiedOrigin[] = await this.prisma.koboAnswers.findMany({
      select: {
        formId: true,
        uuid: true,
        answers: true,
        date: true,
        id: true
      },
      where: {formId}
    })
    const remoteIdsIndex: Map<KoboId, KoboUnifiedOrigin> = remoteAnswers.reduce((map, curr) => map.set(curr.id, curr), new Map<KoboId, KoboUnifiedOrigin>)

    this.log.info(`Fetch remote answers... ${remoteAnswers.length} fetched.`)

    this.log.info(`Fetch local answers...`)
    const localAnswersIndex = await this.prisma.koboAnsersUnified.findMany({where: {formId}, select: {id: true, uuid: true}}).then(_ => {
      return _.reduce((map, curr) => map.set(curr.id, curr.uuid), new Map<KoboId, UUID>())
    })
    this.log.info(`Fetch local answers... ${localAnswersIndex.size} fetched.`)

    const handleDelete = async () => {
      const idsToDelete = [...localAnswersIndex.keys()].filter(_ => !remoteIdsIndex.has(_))
      this.log.info(`Handle delete (${idsToDelete.length})...`)
      await this.prisma.koboAnsersUnified.deleteMany({where: {formId, id: {in: idsToDelete}}})
      return idsToDelete
    }

    const handleCreate = async () => {
      const notInsertedAnswers = remoteAnswers.filter(_ => !localAnswersIndex.has(_.id))
      this.log.info(`Handle create (${notInsertedAnswers.length})...`)
      const mapped = notInsertedAnswers.map(mapper)
      const individuals = mapped.flatMap(_ => {
        const res: Prisma.KoboIndividualUncheckedCreateInput[] = _.individuals?.map(ind => ({...ind, unifiedId: _.id})) ?? []
        delete _['individuals']
        return res
      })
      await this.prisma.koboAnsersUnified.createMany({
        data: mapped,
        // skipDuplicates: true,
      })
      await this.prisma.koboIndividual.createMany({
        data: individuals
      })
      return notInsertedAnswers
    }

    const handleUpdate = async () => {
      const answersToUpdate = seq([...localAnswersIndex]).map(([id, uuid]) => {
        const match = remoteIdsIndex.get(id)
        const hasBeenUpdated = match && match.uuid !== uuid
        return hasBeenUpdated ? match : undefined
      }).compact()
      this.log.info(`Handle update (${answersToUpdate.length})...`)
      await Promise.all(answersToUpdate.map(a => {
        const {individuals, ...answer} = mapper(a)
        return this.prisma.koboAnsersUnified.update({
          where: {
            id: a.id,
          },
          data: {
            individuals: {
              createMany: {data: individuals ?? []}
            },
            ...answer
          }
        })
      }))
      return answersToUpdate
    }

    const answersIdsDeleted = await handleDelete()
    const answersCreated = await handleCreate()
    const answersUpdated = await handleUpdate()
    return {
      // answersIdsDeleted,
      // answersCreated,
      // answersUpdated,
    }

    // const current = await this.prisma.koboAnsersUnified.findMany()
    // current.map(_ => _.answerUuid)
    // const remoteIdsIndex: Map<KoboId, KoboUnified> = current.reduce((map, answer) => map.set(rest.id, answer), new Map())
    //
    //
    // this.log.info('Synchronizing unified database...')
    // console.log({
    //   answersIdsDeleted,
    //   answersUpdated,
    //   answersCreated,
    // })
    // const mapper = KoboUnifiedMapper.map[formId]
    // await this.prisma.koboAnsersUnified.deleteMany({
    //   where: {
    //     id: {in: answersIdsDeleted}
    //   }
    // })
    // await this.prisma.koboAnsersUnified.createMany({
    //   data: answersCreated.map(mapper),
    // })
    // await Promise.all(answersUpdated.map(a => {
    //   return this.prisma.koboAnsersUnified.updateMany({
    //     where: {id: a.id},
    //     data: answersCreated.map(mapper),
    //   })
    // }))
    // this.log.info('Synchronizing unified database... COMPLETED')
  }

}