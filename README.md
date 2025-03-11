# Free-domainia
## Deployment made easy with free-domainia


![p2](https://github.com/user-attachments/assets/ad9b309c-7857-41c8-a5d5-ade529699ac2)


## ℹ️ Project description
"Free-Domainia is an innovative platform designed to streamline the process of deploying
React or JavaScript projects online, offering a comprehensive suite of services including
domain provisioning, deployment, and building capabilities, all at zero cost to users. By
harnessing the power of state-of-the-art open-source technologies such as Redis, Docker,
and Aiven, Free-Domainia ensures seamless deployment experiences for its users.At the
core of Free-Domainia is its user-friendly interface, which simplifies the deployment
process, allowing users to effortlessly launch their projects onto the web with just a few
clicks. Leveraging the latest advancements in containerization technology, Free-Domainia
utilizes Docker to provide a scalable and efficient deployment environment, ensuring
optimal performance for deployed projects.


</div>


## ⚒️ Sequence diagram:

![p3](https://github.com/user-attachments/assets/943481d4-b4ca-4963-8e37-0f95dc9329a7)


## 🤔 What challenges I ran into

<table>
    <tr>
      <td>Containerization : </td>
      <td> Understanding the concept and purpose of containerization.Grasping the functionality and usage of Docker for encapsulating applications and dependencies.</td>
    </tr>
    <tr>
      <td>Image Management:</td>
      <td>Probably I worked for this part mostly such a pipeline was the backbone of this project, I was too confused and wanted to leave project for once however, I slowly worked of making a streamlined flow of generating build files (docker helped) and then getting images deployed on S3 or cloudfare (I ended using both) </td>
    </tr>
    <tr>
      <td>Using promises</td>
      <td>I have only heard and learned about promises and never utilized them in my any of the project until now, oh man they were life saver, they helped me in making and flow better and workable, I literally now want to use promises everywhere, I really got the understand of promises, async await, .then and catch</td>
    </tr>
      <tr>
      <td> AWS Services: </td>
        <td>Familiarizing oneself with ECR (Elastic Container Registry) for secure Docker image storage. Understanding ECS (Elastic Container Service) and its role in orchestrating
          containerized applications. Exploring EC2 (Elastic Compute Cloud) for scalable computing resources.
          Deployment Challenges:</td>
    </tr>
        
</table>

## 💻 Tech Stack


[PostgreSQL](https://www.postgresql.org/): An open-source relational database management system known for its
reliability, scalability, and advanced features, widely used in web development for
storing and managing structured data.

[AWS SDK](https://aws.amazon.com/sdk-for-javascript/): A collection of tools
and libraries provided by Amazon Web Services (AWS) for developers to interact with
AWS services programmatically, facilitating integration with cloud infrastructure.

[Docker](https://www.docker.com/): A platform for containerizing applications, allowing developers to package
software and its dependencies into standardized units called containers, making it easy
to deploy and manage applications across different environments.

[Next.js](https://nextjs.org): A React framework for building server-side rendered (SSR) or static web
applications, providing features like automatic code splitting, route prefetching, and
server-side rendering out of the box.

[React](https://react.dev/): A JavaScript library for building user interfaces, developed by Facebook, known
for its component-based architecture, virtual DOM, and declarative approach to building
UIs, making it highly efficient and easy to maintain.

# Setup Guide ✨

Welcome to the **Free-domainia** project! Follow these steps to set up and run the project on your local machine.

## Prerequisites 🛠️

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

## Installation Steps 🚀

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Girishbari/free-domainia.git
    ```

2. **Navigate to the project directory:**

    ```sh
    cd free-domainia
    ```
    
3. **Configuration ⚙️ :**

      Before running the project, you may need to configure certain environment variables or settings. These configurations are typically found in `.env` files within specific directories. Ensure that you review and update these configurations according to your environment.


## Running Individual Components 🧩

Run individual components separately, follow these steps:

### Run the Services Only 🌐

Navigate to the server directory and install the dependencies:

```sh
cd dir && npm install
```

### Run the Client Only 💻

Navigate to the client directory and start the client:

```sh
cd client && npm run dev
```


## 🤔 How to contribute ?

Contributing to open-source software (OSS) projects can be a rewarding and fulfilling experience. Not only can you learn new skills, but you can also help make a valuable contribution to a project that benefits the broader community

- Remember to read [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

- Read the [Git Workflow](docs/git.md) to follow best practices.

- Follow the [Contribution Guidelines](CONTRIBUTING.md).

- Create an [issue](https://github.com/Girishbari/comic-cult/issues) to report bugs, and vulnerabilities or add a new feature.

- Remember to add a good commit message.

- Don't spam if you do it your PR/issue will be closed.