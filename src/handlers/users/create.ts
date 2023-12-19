// else {
//     // user doesn't exist. Create them!
//     try {
//       // generate salt
//       bcrypt.genSalt(saltRounds, function (err: string, salt: string) {
//         if (err) throw err;
//         // generate hash
//         bcrypt.hash(
//           JSON.stringify(req.body),
//           salt,
//           async function (err: string, hash: string) {
//             if (err) throw err;
//             const newUser: Omit<Users, "id"> = {
//               email: payload,
//               hash,
//               salt,
//             };
//             await getXataClient()
//               .db.users.create(newUser)
//               .then((user) => {
//                 res.status(200).send({
//                   message: "YAY! User has been successfully created",
//                   email: user.email,
//                 });
//               })
//               .catch((err) => {
//                 res.status(400).send({
//                   error: {
//                     message:
//                       "Oops, something went wrong when creating the user in db",
//                     error: err,
//                   },
//                 });
//               });
//           }
//         );
//       });
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   }