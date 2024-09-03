# elib
This is the first project i am building using MERN stack.
first we careted server.ts. server.ts is the main entry file to start the server.
this file knows about the port, and this knows to listen the datas in that port.
app.tsx file is added to this file.
app.tsx file is the entry file for the express.
in the app.tsx file, route created for the users register end point. body parse function used and the app is exported to be used globally also the global error handler imported to this file.
in the users folder the model created to have Schema for users of mongoDB.
userRouter is the entry file for the users Registration process however all the logics were written in the userController.ts
-----------
Problems are :
1) env files are not working.
2) nodemon is not starting the server.
Lesson learned :
1) How to create global error handeling.
2) how to use env variables on the config.js
3) to connect mongoDB to the project i found easier way.
4) create new user - status code 201.
5) user not fouind - status code 404.
PROBLEMS:
1) i am not being able to send the file and cover image at a time. this might be the issue with the postman.i will try this feature with the ui.
2) nodemon is not restarting the server.
3) I need to save each file to reflect the changes on next server run.