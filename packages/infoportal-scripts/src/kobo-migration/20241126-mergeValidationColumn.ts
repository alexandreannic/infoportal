import {groupBy, KoboHelper, KoboIndex, KoboValidation} from 'infoportal-common'
import {PrismaClient} from '@prisma/client'
import winston from 'winston'
import {fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import {chunkify, Kobo, KoboClient} from 'kobo-sdk'

type Req = {
  validation: KoboValidation
  data: any[]
  formId: string
}
const allForms = [
  'a4bgAsLLag7HTjjY3pSLT7',// a4bgAsLLag7HTjjY3pSLT7 Approved 1
  'a4iDDoLpUJHbu6cwsn2fnG',// ecrec_vetEvaluation Approved 181
  'a4iDDoLpUJHbu6cwsn2fnG',// ecrec_vetEvaluation Rejected 25
  'a52hN5iiCW73mxqqfmEAfp',// protection_pss null 1
  'a5Noq6Wf9a8aE2cmi74FyS',// protection_gbv null 1
  'a62ZpworuN4nFLznsUej8r',// protection_referral Approved 174
  'a62ZpworuN4nFLznsUej8r',// protection_referral Flagged 2
  'a62ZpworuN4nFLznsUej8r',// protection_referral null 1
  'a62ZpworuN4nFLznsUej8r',// protection_referral Pending 1
  'a62ZpworuN4nFLznsUej8r',// protection_referral Rejected 8
  'a62ZpworuN4nFLznsUej8r',// protection_referral UnderReview 9
  'a9CjhyhTKVojCdArKmw9yM',// shelter_cashForRepair Approved 95
  'aAJNkn7v9fRL2XqQCgEkXf',// safety_incident null 1
  'aAJNkn7v9fRL2XqQCgEkXf',// safety_incident Rejected 2
  'aCPdwVnnsYeReynJ7YnLGH',// shelter_north Approved 62
  'aCPdwVnnsYeReynJ7YnLGH',// shelter_north null 13
  'adpuqZypnqHb8LNfX49iA5',// bn_rapidResponse2 Approved 877
  'adpuqZypnqHb8LNfX49iA5',// bn_rapidResponse2 null 1
  'adpuqZypnqHb8LNfX49iA5',// bn_rapidResponse2 Rejected 37
  'aE5md7RfHiy4LJmddoFAQH',// ecrec_cashRegistration Approved 2498
  'aE5md7RfHiy4LJmddoFAQH',// ecrec_cashRegistration null 160
  'aE5md7RfHiy4LJmddoFAQH',// ecrec_cashRegistration Pending 14
  'aE5md7RfHiy4LJmddoFAQH',// ecrec_cashRegistration Rejected 148
  'affnm5MBjwADExT9SH6Eng',// affnm5MBjwADExT9SH6Eng Rejected 3
  'ag34YtGDQiW5FstyAxzy5P',// ag34YtGDQiW5FstyAxzy5P null 3
  'ag34YtGDQiW5FstyAxzy5P',// ag34YtGDQiW5FstyAxzy5P Rejected 7
  'ag6n7kQk7vps4MYjjVoja8',// ag6n7kQk7vps4MYjjVoja8 Approved 1
  'ag6n7kQk7vps4MYjjVoja8',// ag6n7kQk7vps4MYjjVoja8 Rejected 42
  'aGGGapARnC2ek7sA6SuHmu',// ecrec_vetApplication Approved 492
  'aGGGapARnC2ek7sA6SuHmu',// ecrec_vetApplication null 4
  'aGGGapARnC2ek7sA6SuHmu',// ecrec_vetApplication Pending 129
  'aGGGapARnC2ek7sA6SuHmu',// ecrec_vetApplication Rejected 1281
  'ajNzDaUuLkcEvjQhVsAmao',// bn_cashForRentRegistration Approved 305
  'ajNzDaUuLkcEvjQhVsAmao',// bn_cashForRentRegistration Rejected 12
  'aKgX4MNs6gCemDQKPeXxY8',// bn_re Approved 5361
  'aKgX4MNs6gCemDQKPeXxY8',// bn_re Flagged 40
  'aKgX4MNs6gCemDQKPeXxY8',// bn_re null 140
  'aKgX4MNs6gCemDQKPeXxY8',// bn_re Rejected 296
  'aKgX4MNs6gCemDQKPeXxY8',// bn_re UnderReview 17
  'aKvvsPDBHyrZt4tZPWBsQL',// aKvvsPDBHyrZt4tZPWBsQL Flagged 4
  'aL8oHMzJJ9soPepvK6YU9E',// shelter_nta Approved 2959
  'aL8oHMzJJ9soPepvK6YU9E',// shelter_nta null 5
  'aL8oHMzJJ9soPepvK6YU9E',// shelter_nta Pending 56
  'aL8oHMzJJ9soPepvK6YU9E',// shelter_nta Rejected 50
  'aL8oHMzJJ9soPepvK6YU9E',// shelter_nta UnderReview 38
  'aLEGqicGyzkZCeCYeWqEyG',// aLEGqicGyzkZCeCYeWqEyG Approved 65
  'aLEGqicGyzkZCeCYeWqEyG',// aLEGqicGyzkZCeCYeWqEyG Flagged 271
  'aLEGqicGyzkZCeCYeWqEyG',// aLEGqicGyzkZCeCYeWqEyG null 2
  'aLEGqicGyzkZCeCYeWqEyG',// aLEGqicGyzkZCeCYeWqEyG Pending 389
  'aLEGqicGyzkZCeCYeWqEyG',// aLEGqicGyzkZCeCYeWqEyG Rejected 379
  'aLEGqicGyzkZCeCYeWqEyG',// aLEGqicGyzkZCeCYeWqEyG UnderReview 1
  'aMJL9DG8qEcULqTZTKQbrq',// bn_rapidResponse Approved 1329
  'aMJL9DG8qEcULqTZTKQbrq',// bn_rapidResponse null 5
  'aMJL9DG8qEcULqTZTKQbrq',// bn_rapidResponse Rejected 1
  'aMJL9DG8qEcULqTZTKQbrq',// bn_rapidResponse UnderReview 4
  'aNRJbxkYEH2yogyeNowXzS',// aNRJbxkYEH2yogyeNowXzS Approved 20
  'aNRJbxkYEH2yogyeNowXzS',// aNRJbxkYEH2yogyeNowXzS Pending 32
  'aNRJbxkYEH2yogyeNowXzS',// aNRJbxkYEH2yogyeNowXzS Rejected 4
  'aoJppKLX7QvSkMYokUfEjB',// ecrec_msmeGrantReg Approved 30
  'aoJppKLX7QvSkMYokUfEjB',// ecrec_msmeGrantReg Flagged 25
  'aoJppKLX7QvSkMYokUfEjB',// ecrec_msmeGrantReg null 1
  'aoJppKLX7QvSkMYokUfEjB',// ecrec_msmeGrantReg Pending 10
  'aoJppKLX7QvSkMYokUfEjB',// ecrec_msmeGrantReg Rejected 46
  'aPaTzi4QaCUu9F4oci4iit',// aPaTzi4QaCUu9F4oci4iit Approved 4
  'apn6HTbCJgwzrrGAywJdp2',// apn6HTbCJgwzrrGAywJdp2 Pending 1
  'aQCGR2fESUNFMYKVHMyAET',// ecrec_cashRegistrationBha Approved 1682
  'aQCGR2fESUNFMYKVHMyAET',// ecrec_cashRegistrationBha null 9
  'aQCGR2fESUNFMYKVHMyAET',// ecrec_cashRegistrationBha Pending 1
  'aQCGR2fESUNFMYKVHMyAET',// ecrec_cashRegistrationBha Rejected 51
  'aQCGR2fESUNFMYKVHMyAET',// ecrec_cashRegistrationBha UnderReview 5
  'aQgRrYdwHuvWbj23LpywPF',// shelter_cashForShelter null 2
  'aQHBhYgevdzw8TR2Vq2ZdR',// protection_communityMonitoring Approved 12
  'aQkWZkWjVpJsqZ3tYtuwFZ',// ecrec_msmeGrantSelection Approved 477
  'aQkWZkWjVpJsqZ3tYtuwFZ',// ecrec_msmeGrantSelection null 3
  'aQkWZkWjVpJsqZ3tYtuwFZ',// ecrec_msmeGrantSelection Pending 6
  'aQkWZkWjVpJsqZ3tYtuwFZ',// ecrec_msmeGrantSelection Rejected 471
  'aTP5nwZjpyR7oy7bdMZktC',// shelter_ta Approved 340
  'aTP5nwZjpyR7oy7bdMZktC',// shelter_ta null 2
  'aTP5nwZjpyR7oy7bdMZktC',// shelter_ta Rejected 2
  'aTP5nwZjpyR7oy7bdMZktC',// shelter_ta UnderReview 1
  'aVKUygTUFUYktC89rAoy5Y',// aVKUygTUFUYktC89rAoy5Y Approved 1
  'aVKUygTUFUYktC89rAoy5Y',// aVKUygTUFUYktC89rAoy5Y null 1
  'awYf9G3sZB4grG8S4w3Wt8',// ecrec_msmeGrantEoi Approved 456
  'awYf9G3sZB4grG8S4w3Wt8',// ecrec_msmeGrantEoi Flagged 45
  'awYf9G3sZB4grG8S4w3Wt8',// ecrec_msmeGrantEoi null 3
  'awYf9G3sZB4grG8S4w3Wt8',// ecrec_msmeGrantEoi Pending 55
  'awYf9G3sZB4grG8S4w3Wt8',// ecrec_msmeGrantEoi Rejected 1046
]
export const run = async () => {
  console.log('start')
  const prisma = new PrismaClient()
  const server = await prisma.koboServer.findFirstOrThrow({
    where: {
      url: 'https://kobo.humanitarianresponse.info'
    }
  })
  const answers = await prisma.koboAnswers.findMany({
    where: {
      form: {
        server: {
          id: server.id,
        }
      },
      tags: {
        path: ['_validation'],
        not: {equals: null},
      }
    },
  })
  const sdk = new KoboClient({
    urlv1: server.urlV1 + '/api/v1',
    urlv2: server.url + '/api',
    token: server.token,
    log: winston.createLogger({
      transports: [
        new winston.transports.Console()
      ]
    }),
  })

  const reqs: Req[] = []
  groupBy({
    data: answers,
    groups: [
      {by: _ => _.formId},
      {by: _ => (_.tags as any)._validation},
    ],
    finalTransform: async (grouped, [formId, validation]) => {
      reqs.push({formId, validation, data: grouped})
    }
  })

  for (let req of reqs) {
    const {formId, validation, data: grouped} = req
    if (formId !== 'awYf9G3sZB4grG8S4w3Wt8') break
    console.log(formId, KoboIndex.searchById(formId)?.name ?? formId, validation, grouped.length)
    const submissionIds = grouped.map(_ => _.id)
    const status = KoboHelper.mapValidation.toKobo(validation)
    if (status._validation_status) {
      await sdk.v2.updateValidation({
        submissionIds,
        formId,
        status: status._validation_status
      })
    } else if (status._IP_VALIDATION_STATUS_EXTRA) {
      if (validation)
        await sdk.v2.updateData({
          submissionIds,
          formId,
          data: {
            _IP_VALIDATION_STATUS_EXTRA: status._IP_VALIDATION_STATUS_EXTRA,
          }
        })
    }
    const answers = await sdk.v2.getAnswers(formId)
    await Promise.all(Obj.entries(seq(answers.results).groupBy(_ => _.validationStatus!)).map(([k, v]) => {
      return chunkify({
        size: 10000,
        data: v.map(_ => _._id),
        fn: _ => {
          return prisma.koboAnswers.updateMany({
            where: {
              id: {in: _}
            },
            data: {
              validationStatus: k === 'undefined' as any ? null : k,
            }
          })
        },
        concurrency: 1,
      })
    }))
  }

// const formId = 'ag6n7kQk7vps4MYjjVoja8'
// const answers = await sdk.v2.getAnswers(formId)
// const answer = answers.data[0]
// console.log(answer)
// await sdk.v2.updateData({
//   formId, submissionIds: [answer.id], data: {
//     _validation_status_ip: 'test'
//   }
// })
}
run()