# Musicians Site

Welcome to the Musicians Site repository, a comprehensive web application designed for musicians fans. This project is a testament to modern web development practices and technologies, offering a rich set of features and functionalities.

## Key Features

- **User Articles Management**: Users can create, read, update, and delete articles about musicians. This includes CRUD operations and multiple CRUD functionalities for managing article publishing using formsets.
- **Enhanced User Authentication**: The site uses Django-allauth for advanced user authentication, including email confirmation for registration, password reset, and email management.
- **Custom Validations**: Custom Regex-based validation is implemented for article titles, ensuring data integrity and user-friendly experiences.
- **Media Handling**: The application supports live photo and video previews during article creation or editing, enhancing user interaction. It includes an EmbedVideoField for seamless video integration.
- **User Profiles**: Handy user profiles are available, showcasing user statistics and integrated account management features provided by Django-allauth.
- **Responsive Design**: The site boasts a highly responsive design, ensuring a seamless experience across various devices and screen sizes.
- **Security and Permissions**: High attention is paid to security aspects and permission handling, safeguarding user data and interactions.
- **Hosting and Deployment**: The application is hosted on Digital Ocean, utilizing Nginx and Gunicorn, with HTTPS for secure communications.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap for responsive design.
- **Backend**: Django framework is the core of the application, providing a robust and scalable backend.
- **Database**: PostgreSQL is used for data storage, offering reliability and performance.
- **Task Queue**: Celery is integrated for handling asynchronous tasks.
- **Testing and CI/CD**: The project includes unit tests and utilizes GitHub Actions for continuous integration and deployment.

## Contributing

Anyone interested in contributing to the project is welcome.

## License

This project code is entirely or partly available for use without any restrictions.

## Live Application

Check out the live application here: [Musicians App](https://musicians-app.me)

[![Django CI](https://github.com/Serg-f/musicians-site/actions/workflows/django.yml/badge.svg)](https://github.com/Serg-f/musicians-site/actions/workflows/django.yml)
