# Nodejs and MongoDB web app

### Go to `http://127.0.0.1:9000` on browser after starting app.js server script.

#### It has three imortant routes:
1. Worker Login: for login of workers to check tasks
2. Manager Login: for login of managers to add/update/approve tasks
3. Registration: user registration

##### Note: Here I have used only one route for user registartion for simplicity so storing both managers and workers in same collection in mongodb. Due to that didn't implemented total score functionality.

#### Tasks are of three types:
1. Compeleted: which are already completed and aproved by manager.
2. Assigned: which are done by worker but waiting for approval from manager
3. Pending: which are still to be doe by user.

#### After manager login, the tasks shown to him/her will be the tasks created by himself/herself in three categories defined above. Whereas after worker login, all the tasks will be shown divided into above three defined categories.
