### XATA error message:

```js
// ---FILTER---
// const page = await getXataClient()
//   .db.users.filter({ email: "goofy@him.io" })
//   .getFirst();

// Response OK: {
//   "email": "goofy@him.io",
//   "hash": "$2a$12$UOIylUAMUXLFKxzK75xYduippcqKNL0tc59cCIrU8olrj0wEjhDMi",
//   "id": "rec_clboug5ptuhrulp3n1ng",
//   "salt": null,
//   "xata": {
//     "createdAt": "2023-11-17T16:05:20.418Z",
//     "updatedAt": "2023-11-17T16:05:20.418Z",
//     "version": 0
//   }
// }

// const page = await getXataClient()
//   .db.users.filter({ email: "a" })
//   .getFirst();

// Response : null

// ---CREATE---
// const page = await getXataClient()
//     .db.users.create({ hash: "bla", salt: "bla", email: "2#2cm"})

// Response OK
//     {
//   "email": "2#2cm",
//   "hash": "bla",
//   "id": "rec_cljmkgb7pk5is6u04r6g",
//   "salt": "bla",
//   "xata": {
//     "createdAt": "2023-11-29T16:43:45.803Z",
//     "updatedAt": "2023-11-29T16:43:45.803Z",
//     "version": 0
//   }
// }

// RESPONSE ERROR
// {
//   "message": "Oops, something went wrong when creating the user in db",
//   "error": {
//     "status": 400,
//     "errors": [
//       {
//         "message": "invalid record: column [email]: is not unique",
//         "status": 400
//       }
//     ],
//     "requestId": "0a689e2e-f0ec-9ecf-bdea-2fda6f23fe58"
//   }
// }
```
