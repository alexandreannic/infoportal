'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {WfpDeduplicationPage} from '@/features/WfpDeduplication/WfpDeduplicationPage'

const WfpDeduplicationRoute = () => {
  return (
    <ProtectRoute>
      <WfpDeduplicationPage/>
    </ProtectRoute>
  )
}

export default WfpDeduplicationRoute

// fetch('https://buildingblocks.ukr.wfp.org/api/manager/beneficiaries/import', {
//   'headers': {
//     'accept': 'application/json',
//     'authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYjBiMGQ4OGQtMjQ0Yi00ODYyLWI5MjctOWY1MzZjZDYzYzA3IiwiZmluZ2VycHJpbnQiOiIyYWU2YWNmMmEwMGU3ZDRiMjNmODM2MDVhNzliZjEzOSIsIml2IjoiY2Q2ZGZlZTJkY2Y0ZjVhZDRlNjM3ZjE0NTIzNjg3OTAiLCJhdWRpZW5jZUVuYyI6ImYxNGU4NGI0ZDY2Yjg2ZGQ4NDdmODE2ZDRhZTZiODI2N2VmNjYzYzY4ZGQ4MmZjYTI1Mzg0MDcyNWRmZDhjNjBjODk0NjgwMDQ2NmYzZjY3Y2RkM2RjZGFmNThjMzVhZTBhNTgwMTgyMmFlOTY3MzE0ZmZhMDQ1NDNiNjMzZjMzYTM4MjVhNmY5M2M1NTEzODA4OTk0YzExYTU1Y2I0MzExOTgzZDg3NWM1YWU0ZmUxODM3MzNiZTJkYTdkNTc3ZGUwZjY5MTE3OWJhNzQzM2JlZjNjMDM4NjlhMWFkZmQ0IiwiaWF0IjoxNjg4NDcyMTE0LCJyb2xlIjoibWFuYWdlciIsImV4cCI6MTY4ODQ3MzkxNH0.38Lg_ucSqGWTwGXwB7_weFsOiyaA9n-CDL8nsyq2di4',
//     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryR1rNNAq3z1V0q4oF',
//   },
//   'body': '------WebKitFormBoundaryR1rNNAq3z1V0q4oF\r\nContent-Disposition: form-data; name="data"; filename="HRK_20230704.xlsx.gpg"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryR1rNNAq3z1V0q4oF\r\nContent-Disposition: form-data; name="uaopFlag"\r\n\r\nIncrementalDeltaAmountNoOption\r\n------WebKitFormBoundaryR1rNNAq3z1V0q4oF\r\nContent-Disposition: form-data; name="categories"\r\n\r\nCASH-MPA\r\n------WebKitFormBoundaryR1rNNAq3z1V0q4oF\r\nContent-Disposition: form-data; name="overlapPeriod"\r\n\r\nnone\r\n------WebKitFormBoundaryR1rNNAq3z1V0q4oF\r\nContent-Disposition: form-data; name="schedule"\r\n\r\nfalse\r\n------WebKitFormBoundaryR1rNNAq3z1V0q4oF\r\nContent-Disposition: form-data; name="dryRun"\r\n\r\ntrue\r\n------WebKitFormBoundaryR1rNNAq3z1V0q4oF\r\nContent-Disposition: form-data; name="mapping"\r\n\r\n{"taxId":1,"organization":2,"category":3,"currency":4,"reloadAmount":5,"reloadDate":6,"expiry":7}\r\n------WebKitFormBoundaryR1rNNAq3z1V0q4oF\r\nContent-Disposition: form-data; name="startIndex"\r\n\r\n2\r\n------WebKitFormBoundaryR1rNNAq3z1V0q4oF--\r\n',
//   'method': 'POST',
//   'mode': 'cors',
//   'credentials': 'include'
// })


// {
//   "id": "00dc9114-aa04-4b3c-a061-15b85a23cb29",
//   "parentId": null,
//   "type": "beneficiary-import-requests",
//   "additionalInfo": {
//   "lastBatchResult": null
// },
//   "fileName": "HRK_20230704.xlsx.gpg",
//   "createdAt": "2023-07-04T12:02:41.283Z",
//   "children": [],
//   "parkedAt": "2023-07-04T12:02:41.283Z",
//   "startedAt": null,
//   "authorizedAt": null,
//   "cancelledAt": null,
//   "finishedAt": null,
//   "errors": null,
//   "informationMessages": null,
//   "warnings": null,
//   "progress": null,
//   "payload": {},
//   "fileExpired": false,
//   "signatures": [],
//   "scheduledFor": null,
//   "createdByManager": {
//   "id": "137",
//     "name": "Alexandre ANNIC",
//     "email": "alexandre.annic@drc.ngo",
//     "agency": "DRC"
// },
//   "authorizedByManager": null,
//   "cancelledByManager": null,
//   "createdByManagerId": "137",
//   "authorizedByManagerId": null,
//   "cancelledByManagerId": null,
//   "dryRun": true,
//   "dryRunErrors": [],
//   "preCancelledByManager": null,
//   "preCancelledAt": null,
//   "createdByVendorUser": null,
//   "cancelledByVendorUser": null,
//   "additionalFiles": [],
//   "deduplicationWarnings": null,
//   "deduplicationOptions": {
//   "overlapPeriod": "none",
//     "uaopFlag": "IncrementalDeltaAmountYesOption",
//     "categories": []
// }
// }

//
// fetch("https://buildingblocks.ukr.wfp.org/api/manager/tasks/beneficiary-import-requests/c059ab3e-66fd-494a-ae64-7d4392e49e40", {
//   "headers": {
//     "accept": "application/json",
//     "authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYjBiMGQ4OGQtMjQ0Yi00ODYyLWI5MjctOWY1MzZjZDYzYzA3IiwiZmluZ2VycHJpbnQiOiIyYWU2YWNmMmEwMGU3ZDRiMjNmODM2MDVhNzliZjEzOSIsIml2IjoiY2Q2ZGZlZTJkY2Y0ZjVhZDRlNjM3ZjE0NTIzNjg3OTAiLCJhdWRpZW5jZUVuYyI6ImYxNGU4NGI0ZDY2Yjg2ZGQ4NDdmODE2ZDRhZTZiODI2N2VmNjYzYzY4ZGQ4MmZjYTI1Mzg0MDcyNWRmZDhjNjBjODk0NjgwMDQ2NmYzZjY3Y2RkM2RjZGFmNThjMzVhZTBhNTgwMTgyMmFlOTY3MzE0ZmZhMDQ1NDNiNjMzZjMzYTM4MjVhNmY5M2M1NTEzODA4OTk0YzExYTU1Y2I0MzExOTgzZDg3NWM1YWU0ZmUxODM3MzNiZTJkYTdkNTc3ZGUwZjY5MTE3OWJhNzQzM2JlZjNjMDM4NjlhMWFkZmQ0IiwiaWF0IjoxNjg4NDcyMTE0LCJyb2xlIjoibWFuYWdlciIsImV4cCI6MTY4ODQ3MzkxNH0.38Lg_ucSqGWTwGXwB7_weFsOiyaA9n-CDL8nsyq2di4",
//     "content-type": "application/json",
//   },
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });

// {
//   "task": {
//   "id": "c059ab3e-66fd-494a-ae64-7d4392e49e40",
//     "parentId": null,
//     "type": "beneficiary-import-requests",
//     "additionalInfo": {
//     "rowSum": 639360,
//       "rowCount": 53,
//       "failsCount": 1,
//       "successCount": 53,
//       "warningsCount": 1,
//       "categoryPerFile": "CASH-MPA",
//       "lastBatchResult": null
//   },
//   "fileName": "HRK_20230704.xlsx.gpg",
//     "createdAt": "2023-07-04T12:05:47.578Z",
//     "children": [
//     {
//       "id": "44356597-af72-4d8c-9c69-5f957f65f4d9", // TODO THIS IS FILE ID
//       "parentId": "c059ab3e-66fd-494a-ae64-7d4392e49e40",
//       "type": "upload-report-export-requests",
//       "additionalInfo": {},
//       "fileName": "validation_result_c059ab3e-66fd-494a-ae64-7d4392e49e40.csv.gpg",
//       "createdAt": "2023-07-04T12:05:49.133Z",
//       "children": [],
//       "parkedAt": null,
//       "startedAt": "2023-07-04T12:05:49.235Z",
//       "authorizedAt": null,
//       "cancelledAt": null,
//       "finishedAt": "2023-07-04T12:05:49.384Z",
//       "errors": null,
//       "informationMessages": null,
//       "warnings": null,
//       "progress": null,
//       "payload": {},
//       "fileExpired": false,
//       "signatures": [],
//       "scheduledFor": null,
//       "createdByManager": null,
//       "authorizedByManager": null,
//       "cancelledByManager": null,
//       "createdByManagerId": "137",
//       "authorizedByManagerId": null,
//       "cancelledByManagerId": null,
//       "dryRun": false,
//       "dryRunErrors": [],
//       "preCancelledByManager": null,
//       "preCancelledAt": null,
//       "createdByVendorUser": null,
//       "cancelledByVendorUser": null,
//       "additionalFiles": [],
//       "deduplicationWarnings": null,
//       "deduplicationOptions": {
//         "overlapPeriod": "none",
//         "uaopFlag": "IncrementalDeltaAmountYesOption",
//         "categories": []
//       }
//     }
//   ],
//     "parkedAt": "2023-07-04T12:05:47.578Z",
//     "startedAt": "2023-07-04T12:05:47.689Z",
//     "authorizedAt": null,
//     "cancelledAt": null,
//     "finishedAt": "2023-07-04T12:05:49.188Z",
//     "errors": [
//     "Category not supported. Supported categories  CASH-MPA.",
//     "There can only be one assistance category per file.",
//     "Currency not supported. Supported currency UAH.",
//     "Start date must be inserted as YYYYMMDD.",
//     "End date must be inserted as YYYYMMDD.",
//     "Organization not supported."
//   ],
//     "informationMessages": null,
//     "warnings": [
//     "Number of warnings - 1"
//   ],
//     "progress": null,
//     "payload": {},
//   "fileExpired": false,
//     "signatures": [],
//     "scheduledFor": null,
//     "createdByManager": {
//     "id": "137",
//       "name": "Alexandre ANNIC",
//       "email": "alexandre.annic@drc.ngo",
//       "agency": "DRC"
//   },
//   "authorizedByManager": null,
//     "cancelledByManager": null,
//     "createdByManagerId": "137",
//     "authorizedByManagerId": null,
//     "cancelledByManagerId": null,
//     "dryRun": true,
//     "dryRunErrors": [
//     "Category not supported. Supported categories  CASH-MPA.",
//     "There can only be one assistance category per file.",
//     "Currency not supported. Supported currency UAH.",
//     "Start date must be inserted as YYYYMMDD.",
//     "End date must be inserted as YYYYMMDD.",
//     "Organization not supported.",
//     "Number of warnings - 1"
//   ],
//     "preCancelledByManager": null,
//     "preCancelledAt": null,
//     "createdByVendorUser": null,
//     "cancelledByVendorUser": null,
//     "additionalFiles": [],
//     "deduplicationWarnings": null,
//     "deduplicationOptions": {
//     "overlapPeriod": "none",
//       "uaopFlag": "IncrementalDeltaAmountNoOption",
//       "categories": []
//   },
//   "deduplicationCount": "0"
// },
//   "scheduler": null
// }

// fetch("https://buildingblocks.ukr.wfp.org/api/manager/tasks/upload-report-export-requests/44356597-af72-4d8c-9c69-5f957f65f4d9/download", {
//   "headers": {
//     "accept": "application/json",
//     "authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYjBiMGQ4OGQtMjQ0Yi00ODYyLWI5MjctOWY1MzZjZDYzYzA3IiwiZmluZ2VycHJpbnQiOiIyYWU2YWNmMmEwMGU3ZDRiMjNmODM2MDVhNzliZjEzOSIsIml2IjoiY2Q2ZGZlZTJkY2Y0ZjVhZDRlNjM3ZjE0NTIzNjg3OTAiLCJhdWRpZW5jZUVuYyI6ImYxNGU4NGI0ZDY2Yjg2ZGQ4NDdmODE2ZDRhZTZiODI2N2VmNjYzYzY4ZGQ4MmZjYTI1Mzg0MDcyNWRmZDhjNjBjODk0NjgwMDQ2NmYzZjY3Y2RkM2RjZGFmNThjMzVhZTBhNTgwMTgyMmFlOTY3MzE0ZmZhMDQ1NDNiNjMzZjMzYTM4MjVhNmY5M2M1NTEzODA4OTk0YzExYTU1Y2I0MzExOTgzZDg3NWM1YWU0ZmUxODM3MzNiZTJkYTdkNTc3ZGUwZjY5MTE3OWJhNzQzM2JlZjNjMDM4NjlhMWFkZmQ0IiwiaWF0IjoxNjg4NDcyMTE0LCJyb2xlIjoibWFuYWdlciIsImV4cCI6MTY4ODQ3MzkxNH0.38Lg_ucSqGWTwGXwB7_weFsOiyaA9n-CDL8nsyq2di4",
//     "content-type": "application/json",
//   },
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });

// When IMPORT SUCCEED

// {
//   "task": {
//   "id": "c1c2ce00-340a-45b0-a1c4-f380af58c167",
//     "parentId": null,
//     "type": "beneficiary-import-requests",
//     "additionalInfo": {
//     "rowSum": 639360,
//       "rowCount": 52,
//       "failsCount": 0,
//       "successCount": 52,
//       "warningsCount": 0,
//       "lastBatchIndex": 1,
//       "categoryPerFile": "CASH-MPA",
//       "numberOfBatches": 1,
//       "lastBatchResult": null
//   },
//   "fileName": "HRK_20230704.xlsx.gpg",
//     "createdAt": "2023-07-04T12:17:33.557Z",
//     "children": [
//     {
//       "id": "66682ea5-8e96-4111-9637-423fd16e6047",
//       "parentId": "c1c2ce00-340a-45b0-a1c4-f380af58c167",
//       "type": "upload-report-export-requests",
//       "additionalInfo": {},
//       "fileName": "validation_result_c1c2ce00-340a-45b0-a1c4-f380af58c167.csv.gpg",
//       "createdAt": "2023-07-04T12:17:34.870Z",
//       "children": [],
//       "parkedAt": null,
//       "startedAt": "2023-07-04T12:17:35.020Z",
//       "authorizedAt": null,
//       "cancelledAt": null,
//       "finishedAt": "2023-07-04T12:17:35.279Z",
//       "errors": null,
//       "informationMessages": null,
//       "warnings": null,
//       "progress": null,
//       "payload": {},
//       "fileExpired": false,
//       "signatures": [],
//       "scheduledFor": null,
//       "createdByManager": null,
//       "authorizedByManager": null,
//       "cancelledByManager": null,
//       "createdByManagerId": "137",
//       "authorizedByManagerId": null,
//       "cancelledByManagerId": null,
//       "dryRun": false,
//       "dryRunErrors": [],
//       "preCancelledByManager": null,
//       "preCancelledAt": null,
//       "createdByVendorUser": null,
//       "cancelledByVendorUser": null,
//       "additionalFiles": [],
//       "deduplicationWarnings": null,
//       "deduplicationOptions": {
//         "overlapPeriod": "none",
//         "uaopFlag": "IncrementalDeltaAmountYesOption",
//         "categories": []
//       }
//     }
//   ],
//     "parkedAt": "2023-07-04T12:17:33.556Z",
//     "startedAt": "2023-07-04T12:17:33.698Z",
//     "authorizedAt": null,
//     "cancelledAt": null,
//     "finishedAt": "2023-07-04T12:17:34.970Z",
//     "errors": null,
//     "informationMessages": null,
//     "warnings": null,
//     "progress": "1",
//     "payload": {},
//   "fileExpired": false,
//     "signatures": [],
//     "scheduledFor": null,
//     "createdByManager": {
//     "id": "137",
//       "name": "Alexandre ANNIC",
//       "email": "alexandre.annic@drc.ngo",
//       "agency": "DRC"
//   },
//   "authorizedByManager": null,
//     "cancelledByManager": null,
//     "createdByManagerId": "137",
//     "authorizedByManagerId": null,
//     "cancelledByManagerId": null,
//     "dryRun": true,
//     "dryRunErrors": [],
//     "preCancelledByManager": null,
//     "preCancelledAt": null,
//     "createdByVendorUser": null,
//     "cancelledByVendorUser": null,
//     "additionalFiles": [],
//     "deduplicationWarnings": null,
//     "deduplicationOptions": {
//     "overlapPeriod": "none",
//       "uaopFlag": "IncrementalDeltaAmountNoOption",
//       "categories": []
//   },
//   "deduplicationCount": "0"
// },
//   "scheduler": null
// }