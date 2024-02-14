# TEstate

TEstate is a real estate management platform that allows users to create accounts, upload property listings, and interact with clients through the application.
- [Demo](https://testate.onrender.com/)
- [System Design Document](https://woolly-society-a2b.notion.site/System-Design-Document-TEstate-9258aa398b864ec38566850ccaf70175?pvs=4)
## Features

- **User Account Management**: Users can register accounts and authenticate using email/password or "sign in with Google" feature.
- **Property Listing Management**: Authenticated users can upload property listings, including images, descriptions, and pricing information.
- **Client Interaction**: Clients can browse property listings, make inquiries, and schedule viewings through the application.
- **Responsive UI**: Built with React and styled with Tailwind CSS, TEstate provides a smooth and responsive user experience.

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens), Firebase Authentication

## Installation

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/your-username/TEstate.git

# Go into the repository
$ cd TEstate

# Install dependencies
$ npm install && npm install --prefix client

# Run the app for api
$ npm run dev

# Run the app for client
$ cd client/
$ npm run dev
```
> **Note**
> Make sure you set enviromental variables; `MONGO`, `JWT_SECRET`, `VITE_FIREBASE_API_KEY`.

## Contributing

🙌 Contributions are welcome! If you'd like to contribute to this project, feel free to open a pull request or submit an issue with any suggestions or improvements.

## License

📄 This project is licensed under the [MIT License](LICENSE).
