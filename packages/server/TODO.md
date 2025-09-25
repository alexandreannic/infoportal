- Use i18n package in client-core and client-datatable and remove Translation
- Move API Error to API-SDK
- We cannot add kobo form twice, but what if the kobo form is "disconnected"? 
- How to deal with FormVersion for a Form linked with Kobo? How to keep consistency after disconnecting from Kobo.

- Rename Server -> Account
- Archive form should move kobo ref to deleteKobo column to keep track?  
- Right now 3 requests are trigger to check loggin.
  It should be merged to avoid hitting the server for nothing especially when 403.
    - /permission/me
    - /workspace/me
    - /me

- Implement searchAnswers accesses
- Delete yup

- Split as dedicated project with distinct root using tsconfig
    - All sdks
    - Script to generate Kobo interface
- Run database sync and db builders in threaded worker
- Multithread servers
- Harmonize code pattern about yup rest api schema
- Harmonize endpoint yup schema (all in Service?)
- Harmonize service structure like KoboAnswerHistory (namespace with schema and typ)

### Landing page

- Realtime updates
- Next generation of collection tools
- Flexible access management
- Data protection: we don't check/sell nor analysis your data. Everything is stored away from American cloud to ensure
  full data protection and privacy. 
