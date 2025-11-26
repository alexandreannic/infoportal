export {Worker} from './vm/worker.js'
//
// const worker = new Worker()
//
// // Example submissions
// const submissions = [
//   {
//     fnString:
//       "async function(submission) { if(!submission.name) throw new Error('Missing name'); return { name: submission.name.toUpperCase() }; }",
//     data: {name: 'Alice'},
//   },
//   {
//     fnString: 'async function(submission) { return { doubled: submission.value * 2 }; }',
//     data: {value: 21},
//   },
//   {
//     fnString: "async function(submission) { return submission.test.test }",
//     data: {},
//   },
// ]
//
// ;(async () => {
//   for (const submission of submissions) {
//     const {fnString, data} = submission
//     const result = await worker.run(fnString, data)
//     if (result.success) {
//       console.log('Transformed:', result.result)
//     } else {
//       console.error('Error:', result.error)
//       console.error(result.stack)
//     }
//   }
// })()
