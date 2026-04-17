# Welcome to..

<img width="899" height="277" alt="SecureEventLogo" src="https://github.com/user-attachments/assets/1b439a50-83c6-4c78-9e1a-c8f6667a44fe" />

With SecurEvents ***Secure comes first***.

About SecurEvents
-
The SecurEvents application is designed to solve **security issues commonly found in event booking and management systems** like:

    🔓 Weak authentication
    
    🔓 Broken access control
    
    🔓 Insecure Data Handling
    
Our app aims to address these common vulnerabilities and offer a **secure solution**

The app allows users to:
  - Sign up and log in using email verification codes 
  - Browse and search for events 
  - Book tickets and complete payments 
  - View and manage their tickets 
  - Create and manage events (organizers) 
  - Allow admins to approve events and manage users / tickets

For more information about the design process, security evaluations and solutions check out our presentation [here!](https://stuconestogacon-my.sharepoint.com/:p:/g/personal/jjakob3896_conestogac_on_ca/IQAfmjKkqyvdRrzKO56jDdtgAeB-0hviBxuq6R08WYmvg5E?e=J7TroJ&nav=eyJzSWQiOjI1NiwiY0lkIjo0MDY3NTM5MDU2fQ)


How to Run SecurEvents
-
1. Clone this repository!
2. Navigate to the cloned folder and the [securevents](securevents/) directory inside of it
   <img width="409" height="89" alt="image" src="https://github.com/user-attachments/assets/4c31ce48-f29d-48f3-9cee-742c046d8f93" />

**Setting up the Backend**
The Backend contains 4 microservices that need to be started first.
1. Inside of the[securevents](securevents/) directory open up the [Backend](securevents/Backend) folder
2. Open the Backend.sln file in Visual Studio
3. Update the connection string in the app settings
4. Once it's open in Visual Studio navigate and set up the multi-application start
5. Start the backend
6. Now the backend is running! Leave all of these console windows open!

**Setting up the Frontend**
1. Go back into the file explorer and navigate back into the [securevents](securevents/) directory
2. Open up the [Frontend](securevents/Frontend/) folder
3. Inside of the [Frontend](securevents/Frontend/) folder open up the [securevents](securevents/Frontend/securevents/)
4. While inside of this folder click in the file path and type `cmd` - this will open the command prompt
5. Inside of the command prompt type `npm install` and enter
6. Once that finishes executing type in `npm run build` and enter
7. Once that is finished executing type in `npm start` and enter - this will start up the application in your browser. The frontend is now running!



