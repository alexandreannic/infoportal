import {FunctionBodyExecutor} from './FunctionBodyExecutor'
;(async () => {
  const executor = new FunctionBodyExecutor()

  await executor.initialize()

  const userCode1 = `
  console.log('>>>', input)
  console.log('Processed', processed.length, 'items');
  return { processedItems: [], total: 0 };
`

  const result1 = await executor.executeFunction(userCode1, {
    items: [
      {name: 'Apple', price: 1.0, category: 'fruit'},
      {name: 'Banana', price: 0.5, category: 'fruit'},
    ],
  })
  console.log(result1)
})()
// // Apply user function body over rows, save result to DB (pseudo)
// import {runUserMap} from './runUserMap'
// import module {MapJob, Row} from './module'
//
// async function example() {
//   const rows: Row[] = [
//     {first: 'Ada', last: 'Lovelace', age: 36},
//     {first: 'Alan', last: 'Turing', age: 41},
//   ]
//
//   const functionBody = `
//     // Must return something serializable
//     const fullName = String(row.first ?? '') + ' ' + String(row.last ?? '');
//     return { fullName, isAdult: (row.age as number) >= 18 };
//   `
//
//   const job: MapJob = {
//     jobId: 'job-123',
//     functionBody,
//     rows,
//     cpuMs: 3000,
//     perItemTimeoutMs: 100,
//     memoryMb: 64,
//   }
//
//   const result = await runUserMap(job)
//   if (!result.ok) {
//     console.error('Job failed:', result.error)
//     return
//   }
//
//   // Persist to DB (pseudo). You keep DB logic in the trusted process.
//   // await db.resultTable.insertMany(result.results)
//   console.log('Mapped results:', result.results)
// }
//
// example().catch(console.error)
