# vslmb
Navigate through the below link to the website:
# https://vslmb-devi-sris-projects-a1440bc8.vercel.app/
- The demands of essential legal assistance from clients remain challenging due to problems with finding qualified legal assistance providers. The paper focuses on a web-based "Smart Advocate Finding and Booking System" which simplifies the complete advocate search and hiring operations. Three web technologies collude to enable the system's operation through React together with Express for backend services and MySQL for data storage. The application provides functionality that allows identity verification for users with advocate profile access and feedback systems alongside continuous booking options. The application enhances accessibility along with legal services efficiency through its search technology with the additional filtering feature. The system functions smoothly and securely because it uses JWT-based authentication and robust database management protocols. The system meets its purpose to simplify legal service access as demonstrated through testing of its functional elements. Users benefit from improved experience when AI recommendation programs and safe payment gateway systems integrate in the future.
-  User Authentication and Role Management
The system implements JWT (JSON Web Token) for secure authentication combined with role-based access control. It also employs bcrypt to secure credentials through hashing before storage for unauthorized access prevention.
Technologies Used:
1.	Node.js & Express: Handles authentication requests and user session management.
2.	JWT (JSON Web Token): Provides a secure mechanism for authentication and authorization.
3.	bcrypt: Ensures password security by hashing user credentials before storing them in the database.

- Advocate Profile Creation and Management
The profile and management function of advocate details including specialization and experience as well as ratings belongs to advocates. Clients can search advocates who meet their legal requirements by using real-time system updates for accurate selection.
Technologies Used:
1.	MySQL & Sequelize ORM – Stores and retrieves structured advocate data.
2.	React.js – Displays dynamic advocate profiles.
3.	Express.js API – Manages profile updates and retrieval.
-  Smart Search and Filtering Mechanism
The system enables users to search for advocates through an advanced interface which allows them to specify their criteria using expertise specificity and geographical location and ratings information. Search accuracy together with performance enhancement is made possible by the combination of indexed queries and filters.
Technologies Used:
•	MySQL Indexing & Full-Text Search – Enhances search speed and relevance.
•	React & Context API/Redux – Manages real-time filtering and sorting.
•	Express.js API – Handles search queries efficiently.

-  Booking and Appointment Scheduling
Advocates provide online scheduling to clients for consultations according to their availability to prevent booking conflicts. The system maintains appointment flow through real-time updates that send alerts to users.
Technologies Used:
•	Node.js & Express.js – Manages appointment logic via RESTful APIs.
•	MySQL Transactions – Prevents double bookings and ensures consistency.
•	React Calendar Component – Provides an interactive scheduling UI.

