**fully comprehensive description** of your entire system, encompassing the backend schemas, server setup, middleware, routes, frontend components, and the interplay between different parts of the application. This detailed overview aims to provide a clear understanding of each component's purpose, functionality, and interactions within the system.

---
> Table of contents
> 
> 
> [**🌟 Forge AI Laboratory: Empowering Content Creation with Advanced AI Tools 🌟**](about:blank#48c17002-ca20-4e9b-a323-3252b8ee95a9)
> 
> [**📝** **Abstract:**](about:blank#26b247ee-c7b0-4a55-8dbb-71785f02644a)
> 
> [**📘** **Introduction:**](about:blank#3b902ec2-36ab-484b-b4b7-cd0c88973ff7)
> 
> [**🌐 AI Image Generation Platform: Revolutionizing Digital Content creation 🌐**](about:blank#ae19ab2f-5247-4219-af43-bc86926096d1)
> 
> [**🎯** **Aims & Objectives:**](about:blank#f716789d-e8f0-4d5a-ae8a-9b2f2e8d2fcd)
> 
> [**1️⃣** **Aim 1: Design an Advanced AI Image Generation System for Enhanced User Creativity**](about:blank#99f5023c-c936-4fd0-ad97-3c5e262ca875)
> 
> [**2️⃣** **Aim 2: Develop Comprehensive Community and Growth Features for User Engagement**](about:blank#0c3b8800-066a-468e-935c-92e87fa479eb)
> 
> [**3️⃣** **Aim 3: Prioritize Platform Security, Scalability, and Comprehensive Documentation**](about:blank#5f0814c5-122e-42f3-894a-9a5acbcdf2cf)
> 
> [**4️⃣** **Aim 4: Implement Efficient Admin Controls for Optimal Platform Management**](about:blank#be8fdb54-e10d-4f8f-a309-70a1b2ec5107)
> 
> [**📂 Frontend:**](about:blank#733c8597-0ed5-40e6-bb3f-c36657404523)
> 
> [**📚 Backend:**](about:blank#38f008b5-1e02-473e-9ce7-3c9f9d7dc2cb)
> 
> [**🤖 AI Server:**](about:blank#64e15b8c-080c-4871-b606-40e8a0ed8156)
> 
> [🤓Research and strategy🔎](about:blank#a7cf6c26-f9db-4ec4-8d4a-b43ddc78965b)
> 
> [🔧Methodology**⚙️**](about:blank#9ea5d845-1a62-4d29-884c-3ee1bccfe77f)
> 
> [**🌐 High Level Architecture 🌉**](about:blank#a2791876-c9d7-40aa-8f78-393087603c77)
> 
> [🤯 Let me blow your mind 🤯](about:blank#22818f3e-2119-4c67-b3a4-05afc6834ccf)
> 
> [🎨🔧 **Components & Workflow:** 🖥️✨](about:blank#83ef8edc-bf81-427a-9bdd-ac1584c82794)
> 
> [**🌐 API Selection & Rationale 🚀**](about:blank#75efd649-482f-4b7d-adf8-d43621839810)
> 
> [**🛠** **Integration Strategy** **🌟**](about:blank#704bbd4b-9291-4b36-a1e8-65fd4d1064c0)
> 
> [**1. Stripe API** **🎯**](about:blank#028fcbec-7633-42bf-b78f-57ddf4d35407)
> 
> [**2. PayPal API** **💸**](about:blank#892abd4d-7674-4917-a28a-056a711f0d2e)
> 
> [**3. Cloudflare Workers API ☁️**](about:blank#6721c93d-ae8a-416f-b6ca-8ba078e75f38)
> 
> [`Software Architecture`**: Components & Workflow**](about:blank#440e2ede-35c2-4289-8f93-c6ea6ab3cae9)
> 
> [**🎨🔧 Database Architecture & Workflow: 🖥️✨**](about:blank#43902b22-0880-4672-8633-b0a92bad3052)
> 
> [**🚀 API Architecture Design 🛠️**](about:blank#9c880290-f152-498b-bf5d-8685239d55f0)
> 
> [**👉** `APIArchitecture`](about:blank#77efe804-972d-4dde-b780-517644f765dd)
> 
> [Our **API Architecture** 🌐 seamlessly integrates](about:blank#0a146449-0c6b-4595-8619-a6c33e249567)
> 
> [various functionalities:](about:blank#be4fd97b-7c10-4e1d-9a13-9d879d9c7df1)
> 
> [**☁️ S3 Bucket Architecture Design 🗃️**](about:blank#c3dfb89d-8373-4677-ba7c-55645c8c8a70)
> 
> [**👉** `aiDashboard-Bucket/`](about:blank#98750019-d1a5-4307-b9ab-129de064f2ce)
> 
> [**☁️ S3 Bucket How does it work 🗃️**](about:blank#22ead3a2-1c15-4326-8602-19182f116002)
> 
> [🌐 **Website Architecture Overview** 🖥️](about:blank#b1d4f9f1-e4f7-44a4-8461-b889bbe1d969)
> 
> [**🌐 Website Architecture Overview 🖥️ This is my little construction site**](about:blank#9881dc58-4625-4e4c-9d1a-0bd19c2c7ff1)
> 
> [**👉** `Website structure/`](about:blank#18dd5d58-70d0-466b-8894-9557bc165abd)
> 
> [**🌐 Website Architecture Overview 🖥️**](about:blank#b584cf67-c529-463b-98d4-3516027d413d)
> 
> [**Security and Compliance**](about:blank#875afdcb-8e66-42a8-ab3b-79f5fc7a036f)
> 
> [🛡️ Security and Compliance 📜](about:blank#1f67f3a0-0268-4f31-b82a-6f5273f40fd2)
> 
> [🚀 Notification System & Incident Response 🚨](about:blank#7fee3ad1-e934-4c0c-aaa3-59fa4ee2632a)
> 
> [🌐 Server Configurations & Firewall 🔥](about:blank#64e5a364-cbe6-4b64-aeec-cd913bc98012)
> 
> [📧 Email & Communication Security 💌](about:blank#d4576c51-1bf8-4875-9777-9b69dfa67b9d)
> 
> [⚡ Rate Limiting & DDoS Protection 🌊](about:blank#303fcd95-9965-4b33-bd4f-0f6fd158326d)
> 
> [🧑‍💼 Admin Panel & AI Content Moderation 👁️](about:blank#62e25a5a-495c-45e3-a33d-7c9867fb15a6)
> 
> [🚀 Future Considerations 🚀](about:blank#5c747859-b950-40fe-b894-dc1cc1d2ef17)
> 
> [`Follow us Get the latest updates on our progress we do our AI platform!`](about:blank#f71bd8e4-576e-4724-a24e-4740c6c6359f)
> 

# **🌟 Forge AI Laboratory: Empowering Content Creation with Advanced AI Tools 🌟**
## Key Action Items

- [ ]  Review and update all schemas to ensure they meet current project requirements
- [ ]  Implement robust error handling and data validation for all routes
- [ ]  Set up comprehensive unit and integration tests for backend components
- [ ]  Optimize database queries for improved performance
- [ ]  Implement caching mechanisms for frequently accessed data
- [ ]  Enhance security measures, including input sanitization and rate limiting
- [ ]  Document all API endpoints and their usage
- [ ]  Set up monitoring and logging for the backend system

## Table of Contents

1. [1. Overview](#overview)
2. [2. Backend Components](#backend-components)
    - [2.1. Schemas](#schemas)
        - [2.1.1. User Schema](#user-schema)
        - [2.1.2. Project Schema](#project-schema)
        - [2.1.3. Task Schema](#task-schema)
        - [2.1.4. Submission Schema](#submission-schema)
        - [2.1.5. Comment Schema](#comment-schema)
        - [2.1.6. Notification Schema](#notification-schema)
        - [2.1.7. Email Schema](#email-schema)
        - [2.1.8. Leaderboard Schema](#leaderboard-schema)
    - [2.2. Server Setup](#server-setup)
        - [2.2.1. Imports and Dependencies](#imports-and-dependencies)
        - [2.2.2. Express Application Configuration](#express-application-configuration)
        - [2.2.3. Middleware Configuration](#middleware-configuration)
        - [2.2.4. File Upload Handling](#file-upload-handling)
        - [2.2.5. Authentication Middleware](#authentication-middleware)
        - [2.2.6. Request Logging](#request-logging)
    - [2.3. Utility Functions](#utility-functions)
        - [2.3.1. createNewTask Function](#createnewtask-function)
    - [2.4. Routes](#routes)
        - [2.4.1. Authentication Routes](#authentication-routes)
        - [2.4.2. Task Management Routes](#task-management-routes)
        - [2.4.3. Submission Management Routes](#submission-management-routes)
        - [2.4.5. Comment Management Routes](#comment-management-routes)
        - [2.4.6. Admin Routes](#admin-routes)
        - [2.4.7. Miscellaneous Routes](#miscellaneous-routes)
3. [3. Frontend Components](#frontend-components)
    - [3.1. HTML Structure](#html-structure)
    - [3.2. CSS and Styling](#css-and-styling)
    - [3.3. JavaScript Functionality](#javascript-functionality)
4. [4. Security Considerations](#security-considerations)
5. [5. Deployment and Environment Configuration](#deployment-and-environment-configuration)
6. [6. Conclusion](#conclusion)

## Table of Contents

1. [Overview](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
2. [Backend Components](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [Schemas](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [User Schema](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Project Schema](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Task Schema](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Submission Schema](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Comment Schema](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Notification Schema](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Email Schema](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Leaderboard Schema](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [Server Setup](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Imports and Dependencies](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Express Application Configuration](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Middleware Configuration](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [File Upload Handling](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Authentication Middleware](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Request Logging](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [Utility Functions](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [createNewTask Function](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Authentication Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [User Registration](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [User Login](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Promote User to Admin](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Get Current User Profile](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Task Management Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Create New Task](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Update Task](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Get All Tasks for User](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Delete Task](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Submission Management Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Get Submissions by User](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Project Management Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Create New Project](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Get All Projects](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Get Specific Project by ID](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Update Project](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Delete Project](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Comment Management Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Add a Comment to a Task](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Get Comments for a Task](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Admin Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Get All Users](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Update a User](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Delete a User](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Admin Overview](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Admin Task Status](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Admin User Activity](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Admin Analytics Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
                - [User Activity Analytics](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
                - [Task Completion Analytics](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Admin Task Assignment](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Miscellaneous Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [File Upload Endpoint](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Processor Endpoint](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Frontend Routes](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
3. [Frontend Components](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [HTML Structure](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [CSS and Styling](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [JavaScript Functionality](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Background Effects](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Navigation Bar](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Main Content](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Initial View](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Pitch Form](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Pitch Deck Slides](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
        - [Interactive Features](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Star Generation](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Pitch Form Handling](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Pitch Deck Generation](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Slide Navigation](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Tooltips](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Invest Modal](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
            - [Keyboard and Swipe Navigation](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
4. [Security Considerations](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [Authentication and Authorization](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [Data Sanitization](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
    - [File Handling Security](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
5. [Deployment and Environment Configuration](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)
6. [Conclusion](https://www.notion.so/Comprehensive-description-of-groqy-backend-116546104b0e8014a407e02c3450db1a?pvs=21)

---

## Overview

Your application, named **Groqy**, is a comprehensive platform designed to manage users, projects, tasks, submissions, comments, notifications, emails, and leaderboards. It integrates a robust backend powered by **Node.js**, **Express.js**, and **MongoDB** with a dynamic frontend using **HTML**, **Tailwind CSS**, and **JavaScript**. The system emphasizes secure user authentication, role-based access control, file handling, and interactive user experiences.

---

## Backend Components

### Schemas

The backend utilizes **Mongoose** to define and interact with MongoDB schemas. Each schema represents a distinct entity within the system, encapsulating relevant data and relationships.

### User Schema

- **Purpose**: Represents a user within the Groqy system.
- **Fields**:
    - `username` (String): User's display name. Defaults to an empty string.
    - `email` (String): User's email address. Defaults to an empty string.
    - `password_hash` (String): Hashed password for secure authentication. Defaults to an empty string.
    - `role` (String): Defines user role, such as 'user' or 'admin'. Defaults to 'user'.
    - `created_at` (Date): Timestamp of user creation. Defaults to the current date and time.
    - `updated_at` (Date): Timestamp of the last profile update. Defaults to the current date and time.
    - `bio` (String): Short biography or description of the user. Defaults to an empty string.
    - `skills` ([String]): Array of user skills. Defaults to an empty array.
    - `total_points` (Number): Total points earned by the user, possibly for gamification. Defaults to 0.
    - `last_notification_at` (Date): Timestamp of the last notification received. Defaults to `null`.
    - `last_email_at` (Date): Timestamp of the last email received. Defaults to `null`.
    - `last_task_viewed` (String): ID of the last task viewed by the user. Defaults to `null`.

### Project Schema

- **Purpose**: Represents a project created by a user.
- **Fields**:
    - `title` (String): Project title. **Required**.
    - `description` (String): Detailed description of the project. Defaults to an empty string.
    - `created_by` (String): ID of the user who created the project. **Required**.
    - `status` (String): Current status of the project, such as 'planning', 'in_progress', or 'completed'. Defaults to 'planning'.
    - `created_at` (Date): Timestamp of project creation. Defaults to the current date and time.
    - `updated_at` (Date): Timestamp of the last project update. Defaults to the current date and time.

### Task Schema

- **Purpose**: Defines tasks assigned to users, potentially linked to projects.
- **Fields**:
    - `prompt` (String): Instructions or prompt for the task. Defaults to an empty string.
    - `user_id` (Schema.Types.ObjectId): Reference to the `User` schema, indicating the assigned user. Defaults to `null`.
    - `completed` (Boolean): Indicates if the task is completed. Defaults to `false`.
    - `inProgress` (Boolean): Indicates if the task is currently in progress. Defaults to `false`.
    - `code` (String): Stores any code related to the task. Defaults to `null`.
    - `created_at` (Date): Timestamp of task creation. Defaults to the current date and time.
    - `updated_at` (Date): Timestamp of the last task update. Defaults to the current date and time.
    - `project_id` (Schema.Types.ObjectId): Reference to the `Project` schema, linking the task to a project. Defaults to `null`.
    - `difficulty` (String): Difficulty level of the task, such as 'easy', 'medium', or 'hard'. Defaults to an empty string.
    - `due_date` (Date): Due date for task completion. Defaults to `null`.
    - `required_skills` ([String]): Skills required to complete the task. Defaults to an empty array.
    - `last_notification_at` (Date): Timestamp of the last notification related to the task. Defaults to `null`.
    - `last_email_at` (Date): Timestamp of the last email related to the task. Defaults to `null`.
    - `title` (String): Task title. Defaults to 'Default Task Title'.
    - `description` (String): Detailed description of the task. Defaults to 'Default Task Description'.
    - `task_url` (String): URL linking to more details about the task. Defaults to an empty string.
    - `file_upload_required` (Boolean): Indicates if file upload is required for the task. Defaults to `false`.
    - `downloadable_file_url` (String): URL to any file required for the task. Defaults to `null`.
    - `prompt_type` (String): Type of task prompt, such as 'text' or 'code'. Defaults to 'text'.

### Submission Schema

- **Purpose**: Tracks submissions made by users in response to tasks.
- **Fields**:
    - `user_id` (String): ID of the user making the submission. Defaults to `null`.
    - `task_id` (String): ID of the task the submission pertains to. Defaults to `null`.
    - `code` (String): Code submitted for the task. Defaults to `null`.
    - `submitted_at` (Date): Timestamp of submission. Defaults to the current date and time.
    - `uploaded_file_url` (String): URL of any file uploaded as part of the submission. Defaults to `null`.
    - `status` (String): Status of the submission, such as 'pending' or 'reviewed'. Defaults to an empty string.
    - `feedback` (String): Feedback provided on the submission. Defaults to `null`.
    - `submission_type` (String): Type of submission, such as 'code' or 'file'. Defaults to 'code'.

### Comment Schema

- **Purpose**: Allows users to leave comments on tasks.
- **Fields**:
    - `user_id` (String): ID of the user leaving the comment. Defaults to `null`.
    - `task_id` (String): ID of the task being commented on. Defaults to `null`.
    - `content` (String): Text content of the comment. Defaults to an empty string.
    - `created_at` (Date): Timestamp of comment creation. Defaults to the current date and time.
    - `updated_at` (Date): Timestamp of the last comment update. Defaults to the current date and time.

### Notification Schema

- **Purpose**: Stores notifications for users.
- **Fields**:
    - `user_id` (String): ID of the user receiving the notification. Defaults to `null`.
    - `type` (String): Type of notification, such as 'task_assigned' or 'submission_feedback'. Defaults to an empty string.
    - `content` (String): Content/message of the notification. Defaults to an empty string.
    - `related_id` (String): ID of the related entity (task, project, submission, etc.). Defaults to `null`.
    - `read` (Boolean): Indicates if the notification has been read. Defaults to `false`.
    - `created_at` (Date): Timestamp of notification creation. Defaults to the current date and time.
    - `read_at` (Date): Timestamp of when the notification was read. Defaults to `null`.

### Email Schema

- **Purpose**: Logs emails sent to users.
- **Fields**:
    - `user_id` (String): ID of the user receiving the email. Defaults to `null`.
    - `subject` (String): Subject line of the email. Defaults to an empty string.
    - `content` (String): Body content of the email. Defaults to an empty string.
    - `related_id` (String): ID of the related entity (task, project, etc.). Defaults to `null`.
    - `sent_at` (Date): Timestamp of when the email was sent. Defaults to the current date and time.
    - `status` (String): Status of the email, such as 'sent' or 'failed'. Defaults to 'sent'.

### Leaderboard Schema

- **Purpose**: Tracks user performance metrics for gamification purposes.
- **Fields**:
    - `user_id` (String): ID of the user being tracked. Defaults to `null`.
    - `points` (Number): Total points earned by the user. Defaults to 0.
    - `tasks_completed` (Number): Number of tasks the user has completed. Defaults to 0.
    - `last_updated` (Date): Timestamp of the last leaderboard update. Defaults to the current date and time.

---

### Server Setup

The server is built using **Express.js**, a minimal and flexible Node.js web application framework. It leverages **Mongoose** for MongoDB interactions, **Multer** for handling file uploads, **CORS** for cross-origin resource sharing, and **JWT** for authentication.

### Imports and Dependencies

- **Core Modules**:
    - `express`: Web framework for building the server.
    - `path`: Utility for handling file and directory paths.
    - `fs`: File system module for reading and writing files.
    - `url`: For parsing URL strings.
- **Third-Party Modules**:
    - `mongoose`: ODM (Object Data Modeling) library for MongoDB.
    - `cors`: Middleware to enable CORS.
    - `bcrypt`: Library for hashing passwords.
    - `jsonwebtoken` (`jwt`): For generating and verifying JWT tokens.
    - `multer`: Middleware for handling `multipart/form-data`, primarily used for file uploads.
    - `sanitize-html`: Library to sanitize user input and prevent XSS attacks.
- **Local Modules**:
    - `./models.js`: Contains all Mongoose models (User, Project, Task, Submission, Comment, Notification, Email, Leaderboard).

### Express Application Configuration

- **Initialization**:
    - The Express app is instantiated using `express()`.
    - The server listens on a port defined by environment variables or defaults to `4000` (or `4001` in test environments).
- **Environment Variables**:
    - `SECRET_KEY`: Used for signing JWT tokens. Defaults to `'banana'` if not provided.
    - `SERVER_URL`: Base URL for constructing file URLs. Defaults to `'https://groqy.com'` if not provided.

### Middleware Configuration

1. **CORS (Cross-Origin Resource Sharing)**:
    - Configured to allow specific origins: `'https://groqy.com'` and `'https://pitchdeck.ai'`.
    - Allowed HTTP methods: `GET`, `POST`, `PUT`, `DELETE`.
    - Allowed headers: `Content-Type`, `Authorization`.
    - Credentials are allowed to support cookies.
2. **Body Parsing**:
    - `express.json()` and `express.urlencoded()` are used to parse incoming request bodies.
    - Both are configured with a size limit of `50mb` to handle large payloads, such as file uploads.
3. **Request Logging**:
    - A custom middleware logs each incoming request with its timestamp, HTTP method, URL, and body content.
4. **Secure File Serving**:
    - `secureFileServe` middleware ensures that only authenticated users can access files within the `'uploads'` directory.
    - It checks for user authentication, verifies file existence, and serves the file securely.
5. **Static File Serving**:
    - Static files are served from the `'public'` directory.
    - The `'uploads'` directory is also served statically but protected by the `secureFileServe` middleware.
6. **View Engine**:
    - The server uses `ejs` as its templating engine.
    - Views are stored in the `'views'` directory.

### File Upload Handling

- **Multer Configuration**:
    - **Storage**: Configured to store files in the `'uploads'` directory with unique filenames to prevent conflicts.
    - **Filename Structure**: Combines the original field name, a unique suffix (timestamp and random number), and the original file extension.
    - **File Size Limit**: Set to `50MB` to accommodate large files.
- **Upload Middleware**:
    - `upload` is an instance of Multer configured with the defined storage and file size limits.
    - Used in routes that handle file uploads, ensuring files are processed and stored correctly.

### Authentication Middleware

- **`authenticateToken` Function**:
    - **Purpose**: Protects routes by verifying JWT tokens.
    - **Process**:
        1. Extracts the `Authorization` header from the request.
        2. Validates the format (`Bearer TOKEN`).
        3. Verifies the token using the `SECRET_KEY`.
        4. Attaches the decoded user information to the `req.user` object.
        5. Handles errors such as missing headers, invalid tokens, and expired tokens by responding with appropriate HTTP status codes and messages.

### Request Logging

- **Middleware Function**:
    - Logs each incoming request's timestamp, HTTP method, URL, and body content.
    - Aids in monitoring, debugging, and auditing by providing a trail of user interactions and server responses.

---

### Utility Functions

### `createNewTask` Function

- **Purpose**: Simplifies the creation of new tasks by encapsulating default values and ensuring consistency.
- **Inputs**:
    - An object containing task-related fields such as `prompt`, `user_id`, `project_id`, `difficulty`, `due_date`, `required_skills`, `title`, `description`, `file_upload_required`, `prompt_type`, `downloadable_file_url`, `task_url`, `completed`, `inProgress`, `code`, `last_notification_at`, and `last_email_at`.
    - Some fields have default values if not provided.
- **Outputs**:
    - Returns a new instance of the `Task` model, ready to be saved to the database.
- **Logic**:
    - Accepts input parameters, applies defaults where necessary, and constructs a new `Task` object using Mongoose's `Task` model.

---

### Routes

The application defines a variety of routes to handle different functionalities, including user authentication, task management, project management, admin operations, file uploads, and frontend rendering.

### Authentication Routes

### User Registration

- **Endpoint**: `POST /api/users/register`
- **Purpose**: Allows new users to create an account.
- **Process**:
    1. Extracts `username`, `email`, `password`, `role`, `bio`, and `skills` from the request body.
    2. Checks if a user with the provided email already exists. If so, responds with a `400 Bad Request`.
    3. Hashes the password using `bcrypt` with a salt round of `10`.
    4. Creates a new `User` instance with the provided and default values.
    5. Saves the new user to the database.
    6. Creates a welcome task for the new user using `createNewTask` with predefined title, description, and prompt.
    7. Saves the welcome task to the database.
    8. Generates a JWT token containing the user's ID, email, and role, valid for `1 hour`.
    9. Responds with the JWT token, sanitized user object (excluding `password_hash`), and the welcome task.

### User Login

- **Endpoint**: `POST /api/users/login`
- **Purpose**: Authenticates existing users and provides access tokens.
- **Process**:
    1. Extracts `email` and `password` from the request body.
    2. Searches for a user with the provided email.
    3. If the user is not found, responds with a `400 Bad Request`.
    4. Compares the provided password with the stored `password_hash` using `bcrypt`.
    5. If the password is invalid, responds with a `400 Bad Request`.
    6. Generates a JWT token containing the user's ID, email, and role, valid for `1 hour`.
    7. Responds with the JWT token and sanitized user object (excluding `password_hash`).

### Promote User to Admin

- **Endpoint**: `POST /api/admin/promote`
- **Purpose**: Allows an admin to elevate a user's role to 'admin'.
- **Access Control**: Restricted to users with the 'admin' role.
- **Process**:
    1. Checks if the authenticated user (`req.user`) has the 'admin' role. If not, responds with a `403 Forbidden`.
    2. Extracts the `email` from the request body.
    3. Searches for the user with the provided email.
    4. If the user is not found, responds with a `404 Not Found`.
    5. Updates the user's `role` to 'admin'.
    6. Saves the updated user to the database.
    7. Responds with a success message indicating the user has been promoted.

### Get Current User Profile

- **Endpoint**: `GET /api/users/me`
- **Purpose**: Retrieves the profile information of the currently authenticated user.
- **Access Control**: Requires authentication.
- **Process**:
    1. Extracts the user ID from `req.user` (populated by `authenticateToken` middleware).
    2. Searches for the user by ID.
    3. If the user is not found, responds with a `404 Not Found`.
    4. Responds with the sanitized user object (excluding `password_hash`).

### Task Management Routes

### Create New Task

- **Endpoint**: `POST /api/tasks`
- **Purpose**: Allows authenticated users to create new tasks.
- **Access Control**: Requires authentication.
- **Process**:
    1. Extracts task-related fields such as `prompt`, `project_id`, `difficulty`, `due_date`, `required_skills`, and `file_upload_required` from the request body.
    2. Calls `createNewTask` with the provided fields and additional defaults like `user_id` from `req.user.id`, `title`, `description`, and `prompt_type`.
    3. Saves the new task to the database.
    4. Responds with the newly created task object.

### Update Task

- **Endpoint**: `PUT /api/tasks/:id`
- **Purpose**: Allows users to update their tasks.
- **Access Control**: Requires authentication. Users can update their own tasks; admins can update any task.
- **Process**:
    1. Extracts `completed`, `inProgress`, and `code` from the request body.
    2. Searches for the task by ID (`req.params.id`).
    3. Checks if the task exists and if the requesting user is either the task owner or an admin. If not, responds with `403 Forbidden`.
    4. Updates the task's `completed` and `inProgress` fields if provided.
    5. Updates the `updated_at` timestamp.
    6. If `code` is provided and the task's `prompt_type` is 'code', updates the `code` field and creates a new `Submission` with the provided code.
    7. Saves the updated task to the database.
    8. Responds with the updated task object and a success message.

### Get All Tasks for User

- **Endpoint**: `GET /api/tasks`
- **Purpose**: Retrieves all tasks assigned to the authenticated user. Admins can retrieve all tasks.
- **Access Control**: Requires authentication.
- **Process**:
    1. Checks if the authenticated user has the 'admin' role.
    2. If the user is an admin, retrieves all tasks, populating the `user_id` field with the `username`.
    3. If the user is not an admin, retrieves tasks where `user_id` matches `req.user.id`.
    4. Responds with an array of task objects.

### Delete Task

- **Endpoint**: `DELETE /api/tasks/:id`
- **Purpose**: Allows users to delete their tasks.
- **Access Control**: Requires authentication. Users can delete their own tasks.
- **Process**:
    1. Searches for and deletes the task by ID (`req.params.id`) where `user_id` matches `req.user.id`.
    2. If the task is not found, responds with `404 Not Found`.
    3. Responds with a success message indicating the task has been deleted.

### Submission Management Routes

### Get Submissions by User

- **Endpoint**: `GET /api/submissions`
- **Purpose**: Retrieves all submissions made by the authenticated user.
- **Access Control**: Requires authentication.
- **Process**:
    1. Searches for submissions where `user_id` matches `req.user.id`.
    2. Responds with an array of submission objects.

### Project Management Routes

### Create New Project

- **Endpoint**: `POST /api/projects`
- **Purpose**: Allows authenticated users to create new projects.
- **Access Control**: Requires authentication.
- **Process**:
    1. Extracts `title`, `description`, and `status` from the request body.
    2. Creates a new `Project` instance with the provided fields and `created_by` set to `req.user.id`.
    3. Saves the new project to the database.
    4. Responds with the newly created project object.

### Get All Projects

- **Endpoint**: `GET /api/projects`
- **Purpose**: Retrieves all projects.
- **Access Control**: Requires authentication.
- **Process**:
    1. Retrieves all projects from the database.
    2. Responds with an array of project objects.

### Get Specific Project by ID

- **Endpoint**: `GET /api/projects/:id`
- **Purpose**: Retrieves a specific project by its ID.
- **Access Control**: Requires authentication.
- **Process**:
    1. Searches for the project by ID (`req.params.id`).
    2. If the project is not found, responds with `404 Not Found`.
    3. Responds with the project object.

### Update Project

- **Endpoint**: `PUT /api/projects/:id`
- **Purpose**: Allows users to update their projects. Admins can update any project.
- **Access Control**: Requires authentication. Users can update projects they created; admins can update any project.
- **Process**:
    1. Extracts `title`, `description`, and `status` from the request body.
    2. Searches for the project by ID (`req.params.id`).
    3. Checks if the project exists and if the requesting user is either the project creator or an admin. If not, responds with `403 Forbidden`.
    4. Updates the project's `title`, `description`, and `status` fields if provided.
    5. Updates the `updated_at` timestamp.
    6. Saves the updated project to the database.
    7. Responds with the updated project object and a success message.

### Delete Project

- **Endpoint**: `DELETE /api/projects/:id`
- **Purpose**: Allows users to delete their projects.
- **Access Control**: Requires authentication. Users can delete projects they created.
- **Process**:
    1. Searches for and deletes the project by ID (`req.params.id`) where `created_by` matches `req.user.id`.
    2. If the project is not found, responds with `404 Not Found`.
    3. Responds with a success message indicating the project has been deleted.

### Comment Management Routes

### Add a Comment to a Task

- **Endpoint**: `POST /api/comments`
- **Purpose**: Allows authenticated users to add comments to tasks.
- **Access Control**: Requires authentication.
- **Process**:
    1. Extracts `task_id` and `content` from the request body.
    2. Searches for the task by ID (`task_id`).
    3. If the task is not found, responds with `404 Not Found`.
    4. Creates a new `Comment` instance with `user_id` set to `req.user.id`, `task_id`, and `content`.
    5. Saves the new comment to the database.
    6. Responds with the newly created comment object.

### Get Comments for a Task

- **Endpoint**: `GET /api/comments/:task_id`
- **Purpose**: Retrieves all comments associated with a specific task.
- **Access Control**: Requires authentication.
- **Process**:
    1. Extracts `task_id` from the route parameter.
    2. Searches for comments where `task_id` matches the provided ID.
    3. Responds with an array of comment objects.

### Admin Routes

Admin routes are specialized endpoints that provide administrative functionalities such as managing users, overseeing projects and tasks, and accessing analytics. These routes are protected and accessible only to users with the 'admin' role.

### Get All Users

- **Endpoint**: `GET /api/admin/users`
- **Purpose**: Retrieves a list of all users along with a summary of their tasks.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Retrieves all users from the database.
    3. For each user, aggregates task statistics:
        - Total number of tasks.
        - Number of completed tasks.
        - Number of tasks in progress.
    4. Constructs an array of user summaries containing user details and task statistics.
    5. Responds with the array of user summaries.

### Update a User

- **Endpoint**: `PUT /api/users/:id`
- **Purpose**: Allows admins to update user information.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Extracts `username`, `email`, `role`, `bio`, and `skills` from the request body.
    3. Searches for the user by ID (`req.params.id`).
    4. If the user is not found, responds with `404 Not Found`.
    5. Updates the user's `username`, `email`, `role`, `bio`, and `skills` fields if provided.
    6. Updates the `updated_at` timestamp.
    7. Saves the updated user to the database.
    8. Responds with the sanitized user object (excluding `password_hash`).

### Delete a User

- **Endpoint**: `DELETE /api/users/:id`
- **Purpose**: Allows admins to delete a user and all associated data.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Searches for and deletes the user by ID (`req.params.id`).
    3. If the user is not found, responds with `404 Not Found`.
    4. Deletes all tasks and submissions associated with the user.
    5. Responds with a success message indicating the user and associated data have been deleted.

### Admin Overview

- **Endpoint**: `GET /api/admin/overview`
- **Purpose**: Provides high-level statistics about the platform.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Aggregates key statistics:
        - Total number of users.
        - Total number of tasks.
        - Number of completed tasks.
        - Completion rate (percentage of tasks completed).
    3. Responds with the aggregated statistics.

### Admin Task Status

- **Endpoint**: `GET /api/admin/task-status`
- **Purpose**: Provides a breakdown of tasks based on their status.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Counts tasks in different statuses:
        - `completed`: Number of tasks marked as completed.
        - `inProgress`: Number of tasks currently in progress.
        - `notStarted`: Number of tasks not yet started (neither completed nor in progress).
    3. Responds with the counts for each status category.

### Admin User Activity

- **Endpoint**: `GET /api/admin/user-activity`
- **Purpose**: Provides detailed activity metrics for each user.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Retrieves all users from the database.
    3. For each user, aggregates task statistics:
        - Total number of tasks.
        - Number of completed tasks.
        - Number of tasks in progress.
    4. Constructs an array of user activity summaries containing username and task statistics.
    5. Responds with the array of user activity summaries.

### Admin Analytics Routes

These routes provide advanced analytical insights into user behavior and task completion trends.

### User Activity Analytics

- **Endpoint**: `GET /api/admin/analytics/user-activity`
- **Purpose**: Provides comprehensive activity data for each user.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Retrieves all users from the database.
    3. For each user, aggregates:
        - Total number of tasks.
        - Number of completed tasks.
        - Number of tasks in progress.
        - Timestamp of the last activity (`lastActive`), determined by the most recent `updated_at` timestamp of their tasks.
    4. Constructs an array of user activity data containing user ID, username, task counts, and last active timestamp.
    5. Responds with the array of user activity data.

### Task Completion Analytics

- **Endpoint**: `GET /api/admin/analytics/task-completion`
- **Purpose**: Tracks task completion trends over the past week.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Calculates the date range for the past 7 days.
    3. For each day in the past week:
        - Counts the number of tasks marked as completed within that day.
        - Records the date and the count of completed tasks.
    4. Compiles the data into an array representing each day's completed task count.
    5. Responds with the array of daily task completion counts in chronological order.

### Admin Task Assignment

- **Endpoint**: `POST /api/admin/tasks/assign`
- **Purpose**: Allows admins to assign new tasks to users, with optional file uploads.
- **Access Control**: Requires authentication and 'admin' role.
- **Process**:
    1. Verifies the authenticated user has the 'admin' role. If not, responds with `403 Forbidden`.
    2. Extracts task-related fields such as `user_id`, `prompt`, `difficulty`, `prompt_type`, `due_date`, `project_id`, and file upload data from the request body.
    3. Searches for the user by `user_id`.
    4. If the user is not found, responds with `404 Not Found`.
    5. Handles file upload (if any) using Multer:
        - If a file is uploaded, constructs the `downloadable_file_url` using the `createFileUrl` utility function.
    6. Calls `createNewTask` with the provided fields, including any uploaded file URL and required skills.
    7. Saves the new task to the database.
    8. Responds with the newly created task object.

### Miscellaneous Routes

### File Upload Endpoint

- **Endpoint**: `POST /api/upload`
- **Purpose**: Allows authenticated users to upload files associated with tasks.
- **Access Control**: Requires authentication.
- **Process**:
    1. Uses the `authenticateToken` middleware to verify the user's identity.
    2. Handles the file upload using Multer's `upload.single('file')` middleware.
    3. Validates the presence of the uploaded file. If absent, responds with `400 Bad Request`.
    4. Constructs the file URL and identifies the file type (`mimetype`).
    5. Extracts `taskId` from the request body and searches for the associated task.
    6. If the task is not found, responds with `404 Not Found`.
    7. Updates the task's `downloadable_file_url` and `file_type` with the uploaded file's details.
    8. Updates the task's `updated_at` timestamp.
    9. If the task's `prompt_type` is 'code', updates the `code` field with the provided code.
    10. Saves the updated task to the database.
    11. Creates a new `Submission` instance linking the upload to the task and user.
    12. Saves the new submission to the database.
    13. Responds with a success message, including file details and submission information.

### Processor Endpoint

- **Endpoint**: `POST /processor`
- **Purpose**: Processes incoming data, sanitizes it, and stores it in a JSON file.
- **Access Control**: Not explicitly restricted; consider adding authentication if necessary.
- **Process**:
    1. Extracts `prompt`, `response`, and `timestamp` from the request body.
    2. Sanitizes the extracted data using `sanitize-html` to prevent XSS and other injection attacks.
    3. Attempts to read existing data from `'data.json'`. If the file doesn't exist or is empty, initializes an empty array.
    4. Appends the sanitized data to the existing data array.
    5. Writes the updated data array back to `'data.json'` with pretty formatting.
    6. Responds with a success message indicating the data has been processed and saved.
    7. Handles any errors by responding with a `500 Internal Server Error` and an appropriate message.

### Frontend Routes

These routes render frontend pages using the EJS templating engine.

- **Root Route (`GET /`)**:
    - **Purpose**: Renders the home page.
    - **Process**: Uses EJS to render the `'home'` view.
- **Staff Route (`GET /staff`)**:
    - **Purpose**: Renders the staff page.
    - **Process**: Uses EJS to render the `'indexrework'` view.
- **Test4 Route (`GET /test4`)**:
    - **Purpose**: Renders the test4 page.
    - **Process**: Uses EJS to render the `'test4'` view.
- **Index Rework Route (`GET /indexrework`)**:
    - **Purpose**: Renders the index rework page.
    - **Process**: Uses EJS to render the `'indexrework'` view.
- **Admin Route (`GET /admin`)**:
    - **Purpose**: Renders the admin dashboard.
    - **Process**: Uses EJS to render the `'admin'` view.

Understood. We'll continue the comprehensive description of your Next.js 14 project by picking up from where the interruption occurred, specifically focusing on the **Users Routes**. We'll ensure that each file is thoroughly described, including its purpose, key components/functions, integration points, data flow, and error handling. Additionally, we'll incorporate Next.js 14 best practices and provide clear file paths to maintain a well-structured project.

---

## Users Routes

### 1. `users/route.js`

**File Path in Next.js:**

```bash
app/api/users/route.js

```

**Purpose:**

Manages user-related operations, including fetching user information, updating user details, and deleting users. This route is primarily intended for administrative tasks, allowing admins to perform bulk user management actions.

**Key Components/Functions:**

- **`GET`**: Retrieves a list of all users along with their task summaries. This is restricted to admin users to ensure that only authorized personnel can access sensitive user data.
- **`POST`**, **`PUT`**, **`DELETE`**: While the primary user creation and authentication are handled in sub-routes (e.g., `register`, `login`), these methods can be extended for additional user-related actions if necessary.

**Implementation Guidelines:**

- **Purpose**: Facilitate comprehensive user management, enabling administrators to retrieve, update, and delete user data as required.
- **Key Functions**:
    - **`get`**:
        - **Functionality**: Fetches all users from the database along with summaries of their associated tasks.
        - **Authorization**: Ensures that only users with the 'admin' role can access this endpoint.
        - **Data Retrieval**: Utilizes MongoDB queries to aggregate user data and their related tasks.
    - **`post`**, **`put`**, **`delete`**:
        - **Potential Uses**: Could handle bulk updates, assignments, or deletions if required in the future.
        - **Current State**: If not needed immediately, these can remain unimplemented or return a `405 Method Not Allowed` status.
- **Integration Points**:
    - **Authentication Middleware**: Integrates with middleware to verify that the requester has the appropriate admin privileges.
    - **Database Models**: Interacts with the `User` and `Task` models to perform CRUD operations.
- **Data Flow**:
    - **Incoming Request**: The admin sends a `GET` request to retrieve user data.
    - **Processing**: The server verifies admin privileges, queries the database, and compiles user summaries.
    - **Response**: Returns a JSON array of users with their task summaries.
- **Error Handling**:
    - **Authentication Errors**: Returns `401 Unauthorized` if the token is missing or invalid.
    - **Authorization Errors**: Returns `403 Forbidden` if the user lacks admin privileges.
    - **Database Errors**: Returns `500 Internal Server Error` for issues during data retrieval.
    - **Method Not Allowed**: Returns `405 Method Not Allowed` for unsupported HTTP methods.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/users/route.js':

- get

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks for admin users, retrieves user data along with their task summaries from MongoDB, and handles errors appropriately.

```

---

### 2. `users/login/route.js`

**File Path in Next.js:**

```bash
app/api/users/login/route.js

```

**Purpose:**

Handles user authentication by verifying credentials and issuing JWT tokens. This endpoint is essential for allowing users to securely log into the system.

**Key Components/Functions:**

- **`POST`**: Authenticates users by validating their email and password, then generates and returns a JWT token upon successful authentication.

**Implementation Guidelines:**

- **Purpose**: Enable users to securely log into the application by validating their credentials and providing authentication tokens for subsequent requests.
- **Key Functions**:
    - **`post`**:
        - **Functionality**:
            - Receives user login credentials (`email` and `password`).
            - Validates the credentials against the stored `User` data in MongoDB.
            - If valid, generates a JWT token containing user information.
            - Returns the token and user details (excluding sensitive information like `password_hash`).
        - **Security**:
            - Utilizes `bcrypt` to compare hashed passwords.
            - Ensures JWT tokens are signed with a secure secret key and have appropriate expiration times.
- **Integration Points**:
    - **Database Models**: Interacts with the `User` model to fetch and verify user data.
    - **Authentication Services**: Utilizes JWT for token generation.
- **Data Flow**:
    - **Incoming Request**: The user submits their `email` and `password` via a `POST` request.
    - **Processing**: The server validates the credentials and, if successful, generates a JWT token.
    - **Response**: Returns the JWT token and sanitized user information.
- **Error Handling**:
    - **Invalid Credentials**: Returns `400 Bad Request` with a message indicating invalid email or password.
    - **User Not Found**: Returns `404 Not Found` if the email does not correspond to any user.
    - **Server Errors**: Returns `500 Internal Server Error` for unexpected issues.

**Implementation Prompt:**

```
Implement the following function for the file 'app/api/users/login/route.js':

- post

Ensure that the implementation follows Next.js 14 best practices, securely authenticates users by verifying their email and password against the database, generates JWT tokens upon successful authentication, and handles errors appropriately.

```

---

### 3. `users/me/route.js`

**File Path in Next.js:**

```bash
app/api/users/me/route.js

```

**Purpose:**

Provides an endpoint for authenticated users to retrieve their own profile information. This allows users to view and possibly update their personal details.

**Key Components/Functions:**

- **`GET`**: Retrieves the authenticated user's profile information.
- **`PUT`**: Allows the authenticated user to update their profile details.
- **`DELETE`**: Potentially allows the authenticated user to delete their own account (if permitted).

**Implementation Guidelines:**

- **Purpose**: Enable users to access and manage their personal profile information securely.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Retrieves the current authenticated user's data from the database.
            - Ensures that sensitive information (e.g., `password_hash`) is excluded from the response.
        - **Security**:
            - Requires the user to be authenticated via JWT.
    - **`put`**:
        - **Functionality**:
            - Allows users to update their profile information such as `username`, `bio`, and `skills`.
            - Validates the input data before updating.
        - **Security**:
            - Ensures that only the authenticated user's data can be modified.
    - **`delete`**:
        - **Functionality**:
            - Allows users to delete their own account.
            - May require additional confirmation or password re-entry for security.
        - **Security**:
            - Ensures that only the authenticated user can delete their account.
- **Integration Points**:
    - **Authentication Middleware**: Ensures that the user is authenticated before accessing these routes.
    - **Database Models**: Interacts with the `User` model to fetch and update user data.
- **Data Flow**:
    - **Incoming Request**: The user sends a `GET`, `PUT`, or `DELETE` request with their JWT token.
    - **Processing**: The server authenticates the user and performs the requested action on the user's data.
    - **Response**: Returns the updated user data, confirmation of deletion, or relevant error messages.
- **Error Handling**:
    - **Authentication Errors**: Returns `401 Unauthorized` if the token is missing or invalid.
    - **Validation Errors**: Returns `400 Bad Request` for invalid input data during updates.
    - **Server Errors**: Returns `500 Internal Server Error` for unexpected issues.
    - **Not Found Errors**: Returns `404 Not Found` if the user does not exist (though unlikely in this context).

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/users/me/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication checks, securely handles user data retrieval and updates, and manages errors appropriately.

```

---

### 4. `users/register/route.js`

**File Path in Next.js:**

```bash
app/api/users/register/route.js

```

**Purpose:**

Handles user registration by creating new user accounts. This endpoint manages the signup process, including validating input data, hashing passwords, and storing user information in the database.

**Key Components/Functions:**

- **`POST`**: Registers a new user by accepting user details, validating them, hashing the password, and storing the user in the database.

**Implementation Guidelines:**

- **Purpose**: Allow new users to create accounts by providing necessary information such as `username`, `email`, and `password`.
- **Key Functions**:
    - **`post`**:
        - **Functionality**:
            - Receives user registration details (`username`, `email`, `password`, etc.).
            - Validates the input data for completeness and correctness.
            - Checks for existing users with the same email to prevent duplicates.
            - Hashes the user's password using `bcrypt` before storing it.
            - Creates a new user entry in the database with default roles and additional information (`bio`, `skills`).
            - Optionally, creates a welcome task for the new user to encourage profile completion.
            - Generates a JWT token for the newly registered user.
            - Returns the token and sanitized user information in the response.
        - **Security**:
            - Ensures passwords are never stored in plain text.
            - Validates and sanitizes all input data to prevent injection attacks.
- **Integration Points**:
    - **Database Models**: Interacts with the `User` and `Task` models to create new entries.
    - **Authentication Services**: Utilizes JWT for token generation.
- **Data Flow**:
    - **Incoming Request**: The user submits their registration details via a `POST` request.
    - **Processing**: The server validates the data, hashes the password, creates the user, assigns a welcome task, and generates a JWT token.
    - **Response**: Returns the JWT token and user information, enabling the user to authenticate subsequent requests.
- **Error Handling**:
    - **Validation Errors**: Returns `400 Bad Request` if required fields are missing or invalid.
    - **Duplicate Users**: Returns `400 Bad Request` if a user with the provided email already exists.
    - **Server Errors**: Returns `500 Internal Server Error` for unexpected issues during registration.

**Implementation Guidelines:**

- **Input Validation**: Ensure all required fields are provided and adhere to expected formats (e.g., valid email, strong password).
- **Password Security**: Use `bcrypt` to hash passwords before storing them in the database.
- **Role Assignment**: Assign a default role (e.g., 'user') upon registration. Optionally, create a welcome task to guide new users.
- **JWT Token Generation**: Create a JWT token containing user ID, email, and role, signed with a secure secret key.
- **Response Structure**: Return the JWT token and user data excluding sensitive information like `password_hash`.

**Implementation Prompt:**

```
Implement the following function for the file 'app/api/users/register/route.js':

- post

Ensure that the implementation follows Next.js 14 best practices, securely handles user registration by validating input data, hashing passwords, storing user information in MongoDB, assigning a welcome task, generating JWT tokens, and managing errors appropriately.

```

---

### 5. `users/[id]/route.js`

**File Path in Next.js:**

```bash
app/api/users/[id]/route.js

```

**Purpose:**

Handles operations on individual user accounts based on their unique identifier (`id`). This includes fetching, updating, and deleting specific users. Primarily intended for administrative use to manage individual user profiles.

**Key Components/Functions:**

- **`GET`**: Retrieves detailed information about a specific user.
- **`PUT`**: Updates the details of a specific user.
- **`DELETE`**: Deletes a specific user from the system.

**Implementation Guidelines:**

- **Purpose**: Enable administrators to perform CRUD (Create, Read, Update, Delete) operations on individual user accounts.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Retrieves detailed information about a user identified by `id`.
            - Ensures that sensitive data (e.g., `password_hash`) is excluded from the response.
        - **Authorization**:
            - Restricted to admin users to prevent unauthorized access to user data.
    - **`put`**:
        - **Functionality**:
            - Allows admins to update user details such as `username`, `email`, `role`, `bio`, and `skills`.
            - Validates the input data before updating.
        - **Authorization**:
            - Ensures that only admins can modify user data.
    - **`delete`**:
        - **Functionality**:
            - Deletes the user identified by `id` from the database.
            - Optionally, handles cascading deletions or data clean-up (e.g., removing associated tasks and submissions).
        - **Authorization**:
            - Restricted to admin users to prevent unauthorized account deletions.
- **Integration Points**:
    - **Authentication Middleware**: Verifies admin privileges before allowing access to these routes.
    - **Database Models**: Interacts with the `User`, `Task`, and `Submission` models to perform necessary operations.
- **Data Flow**:
    - **Incoming Request**: Admin sends a `GET`, `PUT`, or `DELETE` request targeting a specific user ID.
    - **Processing**: The server authenticates the admin, performs the requested action on the user data.
    - **Response**: Returns the updated user data, confirmation of deletion, or relevant error messages.
- **Error Handling**:
    - **Authentication Errors**: Returns `401 Unauthorized` if the token is missing or invalid.
    - **Authorization Errors**: Returns `403 Forbidden` if the user lacks admin privileges.
    - **Not Found Errors**: Returns `404 Not Found` if the user with the specified ID does not exist.
    - **Validation Errors**: Returns `400 Bad Request` for invalid input data during updates.
    - **Server Errors**: Returns `500 Internal Server Error` for unexpected issues.

**Implementation Guidelines:**

- **Dynamic Routing**: Utilize Next.js dynamic route segments (`[id]`) to target specific users.
- **Input Validation**: Validate all incoming data to ensure it meets the required formats and constraints.
- **Data Sanitization**: Sanitize input data to prevent injection attacks and ensure data integrity.
- **Role-Based Access Control**: Enforce that only users with the 'admin' role can access these endpoints.
- **Cascading Deletions**: When deleting a user, consider whether to also delete or reassign their associated tasks and submissions to maintain database consistency.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/users/[id]/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks for admin users, performs secure data retrieval and manipulation for individual users, handles cascading deletions appropriately, and manages errors effectively.

```

---

### Summary of Users Routes Implementation

By following the above guidelines, the Users Routes in your Next.js 14 project will effectively manage user-related operations with robust security and adherence to best practices. Each route ensures that only authorized users (primarily admins) can perform sensitive actions, maintains data integrity through validation and sanitization, and provides clear error messaging to facilitate debugging and user feedback.

---

## Continuing with Other API Routes

Following the detailed descriptions for the Users Routes, the same comprehensive approach should be applied to all other API routes in your project structure. Below is a brief outline for each remaining route to ensure consistency and completeness.

### 6. `admin/analytics/task-completion/route.js`

**File Path in Next.js:**

```bash
app/api/admin/analytics/task-completion/route.js

```

**Purpose:**

Provides analytical data on task completion rates, enabling administrators to monitor productivity and identify trends over time.

**Key Components/Functions:**

- **`GET`**: Retrieves statistics on completed tasks, possibly segmented by time periods or user demographics.

**Implementation Guidelines:**

- **Data Aggregation**: Utilize MongoDB's aggregation framework to compute task completion statistics.
- **Authorization**: Restrict access to admin users.
- **Data Presentation**: Structure the response data in a format suitable for frontend visualization (e.g., charts, graphs).

**Implementation Prompt:**

```
Implement the GET function for the file 'app/api/admin/analytics/task-completion/route.js' to retrieve task completion statistics. Ensure secure access for admin users and structure the data for frontend consumption.

```

---

### 7. `admin/analytics/user-activity/route.js`

**File Path in Next.js:**

```bash
app/api/admin/analytics/user-activity/route.js

```

**Purpose:**

Provides insights into user activity patterns, helping administrators understand engagement levels and identify active or inactive users.

**Key Components/Functions:**

- **`GET`**: Retrieves data on user activities, such as login frequency, task participation, and submission rates.

**Implementation Guidelines:**

- **Data Analysis**: Aggregate user activity data using MongoDB queries.
- **Authorization**: Ensure only admins can access this data.
- **Reporting**: Format the data to support detailed reports or dashboards in the frontend.

**Implementation Prompt:**

```
Implement the GET function for the file 'app/api/admin/analytics/user-activity/route.js' to fetch user activity data. Ensure it is accessible only to admin users and the data is structured for effective reporting.

```

---

### 8. `admin/overview/route.js`

**File Path in Next.js:**

```bash
app/api/admin/overview/route.js

```

**Purpose:**

Serves as a summary endpoint providing high-level metrics about the overall system, such as total users, total tasks, and completion rates.

**Key Components/Functions:**

- **`GET`**: Retrieves aggregate data summarizing the system's state.

**Implementation Guidelines:**

- **Data Summarization**: Compute totals and percentages using MongoDB aggregation.
- **Authorization**: Limit access to admin users.
- **Response Structure**: Provide concise summary metrics suitable for an admin dashboard.

**Implementation Prompt:**

```
Implement the GET function for the file 'app/api/admin/overview/route.js' to provide summary metrics of the system. Ensure only admin users can access this data and format the response for dashboard display.

```

---

### 9. `admin/promote/route.js`

**File Path in Next.js:**

```bash
app/api/admin/promote/route.js

```

**Purpose:**

Allows administrators to promote regular users to higher roles (e.g., 'admin'), granting them elevated privileges within the system.

**Key Components/Functions:**

- **`POST`**: Promotes a user by updating their role in the database.

**Implementation Guidelines:**

- **Input Validation**: Ensure that the request contains a valid user identifier.
- **Authorization**: Confirm that the requester has admin privileges.
- **Role Update**: Safely update the user's role in MongoDB.
- **Response**: Confirm the successful promotion of the user.

**Implementation Prompt:**

```
Implement the POST function for the file 'app/api/admin/promote/route.js' to promote a user to an admin role. Ensure that only admins can perform this action, validate the input, update the user's role in the database, and handle errors appropriately.

```

---

### 10. `admin/task-status/route.js`

**File Path in Next.js:**

```bash
app/api/admin/task-status/route.js

```

**Purpose:**

Provides real-time status updates on tasks, such as how many are completed, in progress, or not started. This helps administrators monitor workflow and identify bottlenecks.

**Key Components/Functions:**

- **`GET`**: Retrieves counts of tasks based on their current status.

**Implementation Guidelines:**

- **Data Retrieval**: Use MongoDB queries to count tasks in different statuses.
- **Authorization**: Restrict access to admin users.
- **Response Format**: Return a JSON object with counts for each task status category.

**Implementation Prompt:**

```
Implement the GET function for the file 'app/api/admin/task-status/route.js' to fetch counts of tasks based on their status (completed, in progress, not started). Ensure secure access for admin users and structure the response appropriately.

```

---

### 11. `admin/tasks/assign/route.js`

**File Path in Next.js:**

```bash
app/api/admin/tasks/assign/route.js

```

**Purpose:**

Enables administrators to assign new tasks to users. This endpoint handles the creation of tasks and their association with specific users or projects.

**Key Components/Functions:**

- **`POST`**: Creates and assigns a new task to a user.

**Implementation Guidelines:**

- **Input Validation**: Ensure that all required task details are provided and valid.
- **Authorization**: Only admin users should be able to assign tasks.
- **Task Creation**: Create a new task entry in MongoDB and associate it with the specified user and project.
- **File Handling**: If the task includes file uploads, handle them securely using Next.js's file handling capabilities.
- **Response**: Return the newly created task details.

**Implementation Prompt:**

```
Implement the POST function for the file 'app/api/admin/tasks/assign/route.js' to assign a new task to a user. Ensure that only admins can perform this action, validate the input data, handle any file uploads if necessary, create the task in the database, and respond with the task details.

```

---

### 12. `admin/tasks/[id]/route.js`

**File Path in Next.js:**

```bash
app/api/admin/tasks/[id]/route.js

```

**Purpose:**

Manages individual tasks based on their unique identifier (`id`). This includes fetching task details, updating task information, and deleting tasks.

**Key Components/Functions:**

- **`GET`**: Retrieves detailed information about a specific task.
- **`PUT`**: Updates the details of a specific task.
- **`DELETE`**: Deletes a specific task from the system.

**Implementation Guidelines:**

- **Purpose**: Enable administrators to perform CRUD operations on individual tasks, ensuring efficient task management.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches detailed information about the task identified by `id`.
            - Includes associated user and project details if necessary.
        - **Authorization**:
            - Restricted to admin users.
    - **`put`**:
        - **Functionality**:
            - Updates task attributes such as `title`, `description`, `status`, `due_date`, etc.
            - Validates input data to maintain data integrity.
        - **Authorization**:
            - Ensures only admins can modify tasks.
    - **`delete`**:
        - **Functionality**:
            - Removes the task identified by `id` from the database.
            - Optionally handles cascading deletions or reassignments.
        - **Authorization**:
            - Restricted to admin users.
- **Integration Points**:
    - **Authentication Middleware**: Confirms admin privileges.
    - **Database Models**: Interacts with the `Task` model for data manipulation.
- **Data Flow**:
    - **Incoming Request**: Admin sends a `GET`, `PUT`, or `DELETE` request targeting a specific task ID.
    - **Processing**: The server authenticates the admin, retrieves or modifies the task as requested.
    - **Response**: Returns the task details, confirmation of updates, or deletion acknowledgments.
- **Error Handling**:
    - **Authentication Errors**: Returns `401 Unauthorized` if the token is missing or invalid.
    - **Authorization Errors**: Returns `403 Forbidden` if the user lacks admin privileges.
    - **Not Found Errors**: Returns `404 Not Found` if the task does not exist.
    - **Validation Errors**: Returns `400 Bad Request` for invalid input data during updates.
    - **Server Errors**: Returns `500 Internal Server Error` for unexpected issues.

**Implementation Guidelines:**

- **Dynamic Routing**: Utilize Next.js dynamic route segments (`[id]`) to target specific tasks.
- **Input Validation**: Ensure all incoming data for updates meets the required formats and constraints.
- **Data Sanitization**: Sanitize input data to prevent injection attacks and maintain data integrity.
- **Role-Based Access Control**: Enforce that only users with the 'admin' role can access these endpoints.
- **Cascading Deletions**: When deleting a task, consider whether to also delete or archive associated submissions or comments.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/admin/tasks/[id]/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks for admin users, performs secure data retrieval and manipulation for individual tasks, handles cascading deletions appropriately, and manages errors effectively.

```

---

### 13. `admin/user-activity/route.js`

**File Path in Next.js:**

```bash
app/api/admin/user-activity/route.js

```

**Purpose:**

Provides detailed insights into user activities, such as task completions, submissions, and login frequencies. This data assists administrators in monitoring user engagement and system utilization.

**Key Components/Functions:**

- **`GET`**: Retrieves comprehensive user activity data for analysis.

**Implementation Guidelines:**

- **Data Aggregation**: Use MongoDB's aggregation capabilities to compile detailed activity logs.
- **Authorization**: Restrict access to admin users.
- **Data Presentation**: Structure the response data to support in-depth analysis and visualization on the frontend.

**Implementation Prompt:**

```
Implement the GET function for the file 'app/api/admin/user-activity/route.js' to fetch detailed user activity data. Ensure that only admin users can access this endpoint and that the data is formatted to support comprehensive analysis.

```

---

### 14. `admin/users/route.js`

**File Path in Next.js:**

```bash
app/api/admin/users/route.js

```

**Purpose:**

Manages administrative actions on user accounts, including listing all users, updating user roles, and deleting users. This endpoint is central to user administration tasks.

**Key Components/Functions:**

- **`GET`**: Retrieves a list of all users with summaries of their activities and roles.
- **`PUT`**: Updates user information, such as roles and personal details.
- **`DELETE`**: Deletes a user account from the system.

**Implementation Guidelines:**

- **Purpose**: Provide administrators with the tools to manage user accounts effectively, including role assignments and account deletions.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches all users from the database.
            - Includes summaries such as total tasks, completed tasks, and in-progress tasks.
        - **Authorization**:
            - Restricted to admin users.
    - **`put`**:
        - **Functionality**:
            - Allows admins to update user details like `username`, `email`, `role`, `bio`, and `skills`.
            - Validates and sanitizes input data before updating.
        - **Authorization**:
            - Ensures only admins can modify user data.
    - **`delete`**:
        - **Functionality**:
            - Deletes a user account identified by `id`.
            - Optionally handles the deletion of associated tasks and submissions to maintain data consistency.
        - **Authorization**:
            - Restricted to admin users.
- **Integration Points**:
    - **Authentication Middleware**: Validates admin privileges.
    - **Database Models**: Interacts with `User`, `Task`, and `Submission` models for data operations.
- **Data Flow**:
    - **Incoming Request**: Admin sends a `GET`, `PUT`, or `DELETE` request to manage user accounts.
    - **Processing**: The server authenticates the admin and performs the requested operation on user data.
    - **Response**: Returns the list of users, updated user information, or deletion confirmations.
- **Error Handling**:
    - **Authentication Errors**: Returns `401 Unauthorized` if the token is missing or invalid.
    - **Authorization Errors**: Returns `403 Forbidden` if the user lacks admin privileges.
    - **Not Found Errors**: Returns `404 Not Found` if the targeted user does not exist.
    - **Validation Errors**: Returns `400 Bad Request` for invalid input data during updates.
    - **Server Errors**: Returns `500 Internal Server Error` for unexpected issues.

**Implementation Guidelines:**

- **Bulk Operations**: Consider implementing bulk update or delete functionalities if needed.
- **Input Validation**: Ensure that updates do not allow unauthorized changes (e.g., escalating one's own privileges).
- **Data Sanitization**: Sanitize all inputs to prevent injection attacks and ensure data integrity.
- **Response Structure**: Provide clear and concise responses, especially when dealing with multiple users.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/admin/users/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks for admin users, securely handles user data retrieval and manipulation, manages cascading deletions appropriately, and handles errors effectively.

```

---

### 15. `admin/overview/route.js`

**File Path in Next.js:**

```bash
app/api/admin/overview/route.js

```

**Purpose:**

Provides a high-level overview of the system's current state, including metrics like total users, total tasks, completed tasks, and completion rates. This endpoint is essential for administrators to get quick insights into the platform's performance.

**Key Components/Functions:**

- **`GET`**: Retrieves aggregate metrics summarizing the system's status.

**Implementation Guidelines:**

- **Data Summarization**: Utilize MongoDB's aggregation framework to compute totals and rates.
- **Authorization**: Restrict access to admin users.
- **Response Structure**: Return a JSON object containing key metrics suitable for dashboard display.

**Implementation Prompt:**

```
Implement the GET function for the file 'app/api/admin/overview/route.js' to provide summary metrics such as total users, total tasks, completed tasks, and completion rates. Ensure that only admin users can access this endpoint and that the data is formatted for easy integration into an admin dashboard.

```

---

### 16. `processor/route.js`

**File Path in Next.js:**

```bash
app/api/processor/route.js

```

**Purpose:**

Handles data processing tasks, such as ingesting and storing data from external sources or performing batch operations. This endpoint may serve as a bridge for data manipulation and analysis within the system.

**Key Components/Functions:**

- **`POST`**: Accepts data payloads for processing and stores them appropriately.

**Implementation Guidelines:**

- **Data Validation**: Ensure that incoming data is validated and sanitized before processing.
- **Security**: Implement authentication checks if the processor is sensitive to unauthorized data submissions.
- **Data Storage**: Define how and where processed data will be stored, whether in the database or as files.
- **Error Handling**: Manage errors related to data processing, storage failures, or invalid inputs.

**Implementation Prompt:**

```
Implement the POST function for the file 'app/api/processor/route.js' to handle incoming data payloads, validate and sanitize the data, process it as required, store it in the database or file system, and respond with appropriate success or error messages. Ensure adherence to Next.js 14 best practices and secure handling of data.

```

---

### 17. `comments/route.js`

**File Path in Next.js:**

```bash
app/api/comments/route.js

```

**Purpose:**

Manages comment-related operations, allowing users to add comments to tasks and administrators to oversee or moderate them.

**Key Components/Functions:**

- **`POST`**: Adds a new comment to a specific task.
- **`GET`**, **`PUT`**, **`DELETE`**: Potentially handles fetching, updating, or deleting comments if necessary.

**Implementation Guidelines:**

- **Purpose**: Enable users to provide feedback, ask questions, or engage in discussions related to tasks.
- **Key Functions**:
    - **`post`**:
        - **Functionality**:
            - Accepts comment data (`task_id`, `content`).
            - Validates that the task exists.
            - Associates the comment with the specified task and user.
            - Saves the comment to the database.
        - **Authorization**:
            - Typically requires the user to be authenticated to post comments.
    - **`get`**, **`put`**, **`delete`**:
        - **Potential Uses**: Fetching comments for a task, editing comments, or deleting inappropriate comments.
        - **Current State**: If not immediately required, these can remain unimplemented or return a `405 Method Not Allowed` status.
- **Integration Points**:
    - **Authentication Middleware**: Ensures that only authenticated users can post comments.
    - **Database Models**: Interacts with the `Comment` and `Task` models to manage comment data.
- **Data Flow**:
    - **Incoming Request**: User sends a `POST` request with comment data.
    - **Processing**: The server validates the task, associates the comment with the user and task, and saves it to the database.
    - **Response**: Returns the newly created comment details.
- **Error Handling**:
    - **Authentication Errors**: Returns `401 Unauthorized` if the user is not authenticated.
    - **Validation Errors**: Returns `400 Bad Request` if required fields are missing or invalid.
    - **Not Found Errors**: Returns `404 Not Found` if the specified task does not exist.
    - **Server Errors**: Returns `500 Internal Server Error` for unexpected issues.

**Implementation Prompt:**

```
Implement the following function for the file 'app/api/comments/route.js':

- post

Ensure that the implementation follows Next.js 14 best practices, includes authentication checks, validates and sanitizes input data, associates comments with the correct tasks and users, saves them in MongoDB, and handles errors appropriately.

```

---

### 18. `comments/[taskId]/route.js`

**File Path in Next.js:**

```bash
app/api/comments/[taskId]/route.js

```

**Purpose:**

Manages operations on comments associated with a specific task, identified by `taskId`. This includes fetching all comments for a task, updating specific comments, and deleting them.

**Key Components/Functions:**

- **`GET`**: Retrieves all comments related to a specific task.
- **`PUT`**: Updates a particular comment.
- **`DELETE`**: Deletes a specific comment.

**Implementation Guidelines:**

- **Purpose**: Facilitate detailed management of comments on individual tasks, enabling users to view, modify, or remove their comments.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches all comments associated with the `taskId`.
            - Optionally, supports pagination or filtering.
        - **Authorization**:
            - May allow any authenticated user to view comments.
    - **`put`**:
        - **Functionality**:
            - Allows users to edit their own comments.
            - Validates input data and ensures that users can only modify their comments.
        - **Authorization**:
            - Ensures that only the comment owner or admins can update comments.
    - **`delete`**:
        - **Functionality**:
            - Enables users to delete their own comments or allows admins to remove any comment.
        - **Authorization**:
            - Restricted to the comment owner or admin users.
- **Integration Points**:
    - **Authentication Middleware**: Validates user authentication and ownership of comments.
    - **Database Models**: Interacts with the `Comment` and `Task` models to manage comment data.
- **Data Flow**:
    - **Incoming Request**: User sends a `GET`, `PUT`, or `DELETE` request targeting a specific `taskId`.
    - **Processing**: The server authenticates the user, verifies permissions, and performs the requested action on the comments.
    - **Response**: Returns the list of comments, updated comment details, or deletion confirmations.
- **Error Handling**:
    - **Authentication Errors**: Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**: Returns `403 Forbidden` if the user lacks permissions.
    - **Not Found Errors**: Returns `404 Not Found` if the task or comment does not exist.
    - **Validation Errors**: Returns `400 Bad Request` for invalid input data.
    - **Server Errors**: Returns `500 Internal Server Error` for unexpected issues.

**Implementation Guidelines:**

- **Dynamic Routing**: Utilize Next.js dynamic route segments (`[taskId]`) to target specific tasks.
- **Input Validation**: Ensure that comment content is valid and adheres to length and format requirements.
- **Data Sanitization**: Sanitize all inputs to prevent injection attacks and maintain data integrity.
- **Role-Based Access Control**: Enforce that users can only modify or delete their own comments unless they have admin privileges.
- **Response Structure**: Provide clear and concise responses, especially when dealing with multiple comments.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/comments/[taskId]/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, securely handles data retrieval and manipulation for comments associated with specific tasks, manages errors effectively, and ensures data integrity.

```

---

---

## 19. `projects/route.js`

**File Path in Next.js:**

```bash
app/api/projects/route.js

```

**Purpose:**

Manages project-related operations, allowing users and administrators to create, retrieve, update, and delete projects. Projects can encompass multiple tasks and are central to organizing work within the system.

**Key Components/Functions:**

- **`GET`**: Retrieves a list of all projects.
- **`POST`**: Creates a new project.
- **`PUT`, `DELETE`**: Potentially handles bulk updates or deletions if necessary.

**Implementation Guidelines:**

- **Purpose**: Facilitate comprehensive project management, enabling the creation and oversight of projects that contain multiple tasks.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches all projects from the database.
            - May include associated tasks and user details if necessary.
        - **Authorization**:
            - Accessible to authenticated users, with potential role-based restrictions (e.g., only admins can view all projects).
    - **`post`**:
        - **Functionality**:
            - Creates a new project with details like title, description, and status.
            - Associates the project with the user who created it (`created_by`).
        - **Authorization**:
            - Ensures that only authenticated users can create projects.
    - **`put`, `delete`**:
        - **Potential Uses**:
            - Handle bulk updates or deletions of projects.
        - **Current State**:
            - If not immediately required, these can remain unimplemented or return a `405 Method Not Allowed` status.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the user is authenticated before allowing project creation or retrieval.
    - **Database Models**:
        - Interacts with the `Project` and `Task` models to manage project data.
- **Data Flow**:
    - **Incoming Request**:
        - User sends a `GET` or `POST` request to manage projects.
    - **Processing**:
        - The server authenticates the user.
        - For `GET`: Retrieves projects from the database.
        - For `POST`: Validates input data and creates a new project.
    - **Response**:
        - Returns the list of projects or the newly created project details in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user lacks the necessary permissions.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid input data during project creation.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that all required project details (e.g., title, description) are provided and valid during creation.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/projects/route.js':

- get
- post
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, interacts with the Project and Task models in MongoDB, validates input data, and handles errors appropriately.

```

---

## 20. `projects/[id]/route.js`

**File Path in Next.js:**

```bash
app/api/projects/[id]/route.js

```

**Purpose:**

Handles operations for a specific project identified by its unique ID. This includes retrieving, updating, and deleting individual projects.

**Key Components/Functions:**

- **`GET`**: Retrieves details of a specific project.
- **`PUT`**: Updates the details of a specific project.
- **`DELETE`**: Deletes a specific project.

**Implementation Guidelines:**

- **Purpose**: Enable detailed management of individual projects, allowing for retrieval, modification, and removal based on the project's unique identifier.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches the project identified by the `[id]` parameter.
            - May include associated tasks and user details.
        - **Authorization**:
            - Accessible to authenticated users.
            - Admins may have broader access compared to regular users (e.g., viewing all projects vs. only their own).
    - **`put`**:
        - **Functionality**:
            - Updates project details such as title, description, status, etc.
        - **Authorization**:
            - Ensures that only the project owner or admins can update the project.
    - **`delete`**:
        - **Functionality**:
            - Removes the project from the database.
            - May also handle cascading deletions of associated tasks.
        - **Authorization**:
            - Ensures that only the project owner or admins can delete the project.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies user authentication and authorization based on roles.
    - **Database Models**:
        - Interacts with the `Project` and `Task` models to manage specific project data.
- **Data Flow**:
    - **Incoming Request**:
        - User sends a `GET`, `PUT`, or `DELETE` request targeting a specific project via its `[id]`.
    - **Processing**:
        - The server authenticates and authorizes the user.
        - For `GET`: Retrieves the specific project from the database.
        - For `PUT`: Validates input data and updates the project.
        - For `DELETE`: Removes the project and handles any necessary cleanup.
    - **Response**:
        - Returns the project details, confirmation of update, or deletion status in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user lacks permission to perform the action.
    - **Not Found Errors**:
        - Returns `404 Not Found` if the project with the specified `[id]` does not exist.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid input data during project updates.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that all updated project details are valid and conform to expected formats and constraints.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/projects/[id]/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, interacts with the Project and Task models in MongoDB, validates input data, and handles errors appropriately.

```

---

## 21. `submissions/route.js`

**File Path in Next.js:**

```bash
app/api/submissions/route.js

```

**Purpose:**

Manages submission-related operations, allowing users to submit their work in response to tasks and enabling administrators to review and manage these submissions.

**Key Components/Functions:**

- **`GET`**: Retrieves a list of all submissions for the authenticated user.
- **`POST`**: Creates a new submission for a specific task.
- **`PUT`, `DELETE`**: Potentially handles updates to submissions or deletion of inappropriate ones.

**Implementation Guidelines:**

- **Purpose**: Facilitate the creation, retrieval, and management of user submissions in response to assigned tasks.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Retrieves all submissions associated with the authenticated user.
            - May include details such as submission status, feedback, and related task information.
        - **Authorization**:
            - Accessible only to authenticated users.
            - Admins may have the ability to view all submissions across users.
    - **`post`**:
        - **Functionality**:
            - Creates a new submission linked to a specific task.
            - Handles file uploads if the submission includes files.
            - Sets initial submission status (e.g., 'pending').
        - **Authorization**:
            - Ensures that only users assigned to the task can submit work.
    - **`put`**, **`delete`**:
        - **Potential Uses**:
            - Update submission status or feedback.
            - Delete inappropriate or erroneous submissions.
        - **Current State**:
            - If not immediately required, these can remain unimplemented or return a `405 Method Not Allowed` status.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the user is authenticated before allowing submission actions.
    - **Database Models**:
        - Interacts with the `Submission`, `Task`, and `User` models to manage submission data.
- **Data Flow**:
    - **Incoming Request**:
        - User sends a `GET` request to retrieve submissions or a `POST` request to create a new submission.
    - **Processing**:
        - For `GET`: Retrieves submissions from the database.
        - For `POST`: Validates input data, handles file uploads, and creates a new submission record.
    - **Response**:
        - Returns the list of submissions or confirmation of the new submission in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user is not assigned to the task they're trying to submit for.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid input data during submission creation.
    - **Not Found Errors**:
        - Returns `404 Not Found` if the related task does not exist.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that all required submission details (e.g., task ID, submission content) are provided and valid.
    - Validate file types and sizes if handling file uploads.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/submissions/route.js':

- get
- post
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, interacts with the Submission, Task, and User models in MongoDB, handles file uploads securely, validates input data, and manages errors appropriately.

```

---

## 22. `tasks/route.js`

**File Path in Next.js:**

```bash
app/api/tasks/route.js

```

**Purpose:**

Manages task-related operations, enabling users to create, retrieve, update, and delete tasks. Tasks are the fundamental units of work assigned to users within projects.

**Key Components/Functions:**

- **`GET`**: Retrieves a list of all tasks, potentially filtered by user or project.
- **`POST`**: Creates a new task.
- **`PUT`, `DELETE`**: Potentially handles bulk updates or deletions if necessary.

**Implementation Guidelines:**

- **Purpose**: Facilitate comprehensive task management, allowing for the creation and oversight of tasks within projects.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches all tasks from the database.
            - May include filtering options (e.g., by user, project, status).
        - **Authorization**:
            - Accessible to authenticated users.
            - Admins may have the ability to view all tasks, while regular users may only view their own.
    - **`post`**:
        - **Functionality**:
            - Creates a new task with details like prompt, difficulty, due date, required skills, etc.
            - Associates the task with a specific project and user.
        - **Authorization**:
            - Ensures that only authorized users (e.g., project owners or admins) can create tasks.
    - **`put`, `delete`**:
        - **Potential Uses**:
            - Handle bulk updates or deletions of tasks.
        - **Current State**:
            - If not immediately required, these can remain unimplemented or return a `405 Method Not Allowed` status.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the user is authenticated before allowing task actions.
    - **Database Models**:
        - Interacts with the `Task`, `Project`, and `User` models to manage task data.
- **Data Flow**:
    - **Incoming Request**:
        - User sends a `GET` request to retrieve tasks or a `POST` request to create a new task.
    - **Processing**:
        - For `GET`: Retrieves tasks from the database, possibly applying filters.
        - For `POST`: Validates input data and creates a new task record.
    - **Response**:
        - Returns the list of tasks or confirmation of the new task in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user lacks permission to perform the action.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid input data during task creation.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that all required task details (e.g., prompt, difficulty) are provided and valid during creation.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/tasks/route.js':

- get
- post
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, interacts with the Task, Project, and User models in MongoDB, validates input data, and handles errors appropriately.

```

---

## 23. `tasks/assign/route.js`

**File Path in Next.js:**

```bash
app/api/tasks/assign/route.js

```

**Purpose:**

Handles the assignment of tasks to users, enabling administrators to assign specific tasks to users within projects.

**Key Components/Functions:**

- **`POST`**: Assigns a new task to a user.
- **`PUT`, `DELETE`**: Potentially handles reassignments or cancellations of task assignments.

**Implementation Guidelines:**

- **Purpose**: Streamline the process of task allocation, ensuring that tasks are appropriately assigned to users based on project requirements and user capabilities.
- **Key Functions**:
    - **`post`**:
        - **Functionality**:
            - Assigns a new task to a specified user.
            - Handles details such as task prompt, difficulty, due date, and required skills.
            - Associates the task with a specific project.
        - **Authorization**:
            - Ensures that only authorized users (e.g., admins or project owners) can assign tasks.
    - **`put`, `delete`**:
        - **Potential Uses**:
            - Reassign tasks to different users.
            - Cancel or remove task assignments.
        - **Current State**:
            - If not immediately required, these can remain unimplemented or return a `405 Method Not Allowed` status.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the user is authenticated and authorized to assign tasks.
    - **Database Models**:
        - Interacts with the `Task`, `Project`, and `User` models to manage task assignments.
- **Data Flow**:
    - **Incoming Request**:
        - Admin sends a `POST` request to assign a task to a user.
    - **Processing**:
        - Validates input data.
        - Creates a new task record associated with the specified user and project.
    - **Response**:
        - Returns the details of the newly assigned task in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user lacks permission to assign tasks.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid input data during task assignment.
    - **Not Found Errors**:
        - Returns `404 Not Found` if the specified user or project does not exist.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that all required task assignment details (e.g., user ID, project ID, prompt) are provided and valid.

**Implementation Guidelines:**

- **Input Validation**:
    - Validate that the `user_id` and `project_id` exist in the database.
    - Ensure that the `prompt`, `difficulty`, and other task details meet the required formats and constraints.
- **Security Considerations**:
    - Prevent assignment of tasks to unauthorized users.
    - Ensure that sensitive information is not exposed in the response.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/tasks/assign/route.js':

- post
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, interacts with the Task, Project, and User models in MongoDB, validates input data, and handles errors appropriately.

```

---

## 24. `tasks/[id]/route.js`

**File Path in Next.js:**

```bash
app/api/tasks/[id]/route.js

```

**Purpose:**

Handles operations for a specific task identified by its unique ID. This includes retrieving, updating, and deleting individual tasks.

**Key Components/Functions:**

- **`GET`**: Retrieves details of a specific task.
- **`PUT`**: Updates the details or status of a specific task.
- **`DELETE`**: Deletes a specific task.

**Implementation Guidelines:**

- **Purpose**: Enable detailed management of individual tasks, allowing for retrieval, modification, and removal based on the task's unique identifier.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches the task identified by the `[id]` parameter.
            - May include associated project and user details.
        - **Authorization**:
            - Accessible to authenticated users.
            - Admins or assigned users may have different levels of access.
    - **`put`**:
        - **Functionality**:
            - Updates task details such as prompt, difficulty, due date, status, etc.
            - Can also handle status updates like marking a task as completed or in progress.
        - **Authorization**:
            - Ensures that only the task owner, assigned user, or admins can update the task.
    - **`delete`**:
        - **Functionality**:
            - Removes the task from the database.
            - May also handle cascading deletions of related submissions or comments.
        - **Authorization**:
            - Ensures that only the task owner or admins can delete the task.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the user is authenticated and authorized to perform actions on the task.
    - **Database Models**:
        - Interacts with the `Task`, `Project`, `Submission`, and `Comment` models to manage task data.
- **Data Flow**:
    - **Incoming Request**:
        - User sends a `GET`, `PUT`, or `DELETE` request targeting a specific task via its `[id]`.
    - **Processing**:
        - The server authenticates and authorizes the user.
        - For `GET`: Retrieves the specific task from the database.
        - For `PUT`: Validates input data and updates the task.
        - For `DELETE`: Removes the task and handles any necessary cleanup.
    - **Response**:
        - Returns the task details, confirmation of update, or deletion status in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user lacks permission to perform the action.
    - **Not Found Errors**:
        - Returns `404 Not Found` if the task with the specified `[id]` does not exist.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid input data during task updates.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that all updated task details are valid and conform to expected formats and constraints.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/tasks/[id]/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, interacts with the Task, Project, Submission, and Comment models in MongoDB, validates input data, and handles errors appropriately.

```

---

## 25. `upload/route.js`

**File Path in Next.js:**

```bash
app/api/upload/route.js

```

**Purpose:**

Handles file upload operations, allowing users to upload files associated with tasks or projects. This can include uploading documents, images, code files, etc.

**Key Components/Functions:**

- **`POST`**: Handles the uploading of files.
- **`GET`**, **`PUT`**, **`DELETE`**: Potentially handle retrieval, updating, or deletion of uploaded files.

**Implementation Guidelines:**

- **Purpose**: Enable users to upload and manage files related to their tasks or projects, ensuring secure and efficient file handling.
- **Key Functions**:
    - **`post`**:
        - **Functionality**:
            - Receives file uploads from users.
            - Stores files in a designated directory or cloud storage (e.g., AWS S3).
            - Associates uploaded files with specific tasks or projects in the database.
            - Validates file types and sizes to ensure security and compliance.
        - **Authorization**:
            - Ensures that only authorized users can upload files to specific tasks or projects.
    - **`get`**, **`put`**, **`delete`**:
        - **Potential Uses**:
            - Retrieve uploaded files.
            - Update file metadata.
            - Delete uploaded files if necessary.
        - **Current State**:
            - If not immediately required, these can remain unimplemented or return a `405 Method Not Allowed` status.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the user is authenticated before allowing file uploads.
    - **Database Models**:
        - Interacts with the `Task`, `Project`, and potentially a `File` model to manage file associations.
    - **File Storage Service**:
        - Utilizes services like `multer` for handling multipart/form-data or integrates with cloud storage APIs.
- **Data Flow**:
    - **Incoming Request**:
        - User sends a `POST` request with a file to upload.
    - **Processing**:
        - The server authenticates the user.
        - Validates the file type and size.
        - Stores the file in the designated storage.
        - Updates the relevant task or project record with the file's URL or reference.
    - **Response**:
        - Returns confirmation of the successful upload along with file details in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user lacks permission to upload files to the specified task or project.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid file types or oversized files.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues during file handling.
- **Security Considerations**:
    - **File Validation**:
        - Restrict allowed file types to prevent malicious uploads.
        - Limit file sizes to manage storage and performance.
    - **Storage Security**:
        - Store files in secure locations with appropriate access controls.
        - Sanitize file names to prevent directory traversal attacks.
- **Scalability**:
    - Consider integrating with cloud storage solutions for scalable and reliable file handling.

**Implementation Guidelines:**

- **File Handling**:
    - Utilize `multer` or similar middleware for handling file uploads in Next.js API routes.
    - Configure storage destinations and file naming conventions.
- **Associations**:
    - Update relevant database records (e.g., `Task`, `Project`) with references to the uploaded files.
- **Error Messaging**:
    - Provide clear and actionable error messages to users in case of upload failures.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/upload/route.js':

- post
- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, handles file uploads securely using appropriate middleware or services, interacts with the Task and Project models in MongoDB to associate files, validates file types and sizes, and manages errors appropriately.

```

---

## 26. `users/route.js`

**File Path in Next.js:**

```bash
app/api/users/route.js

```

**Purpose:**

Manages user-related operations, including fetching user information, updating user details, and deleting users. This route is primarily intended for administrative tasks, allowing admins to perform bulk user management actions.

**Key Components/Functions:**

- **`GET`**: Retrieves a list of all users with task summaries (admin only).
- **`POST`**, **`PUT`**, **`DELETE`**: Potentially handles user-related actions, though specific functionalities may be defined in sub-routes.

**Implementation Guidelines:**

- **Purpose**: Facilitate comprehensive user management, enabling administrators to retrieve, update, and delete user data as required.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches all users from the database along with summaries of their associated tasks.
        - **Authorization**:
            - Accessible only to users with the 'admin' role.
    - **`post`**, **`put`**, **`delete`**:
        - **Potential Uses**:
            - Handle bulk user creation, updates, or deletions.
            - Implement user activation/deactivation workflows.
        - **Current State**:
            - If not immediately required, these can remain unimplemented or return a `405 Method Not Allowed` status.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the requester has admin privileges.
    - **Database Models**:
        - Interacts with the `User` and `Task` models to manage user data and their associated tasks.
- **Data Flow**:
    - **Incoming Request**:
        - Admin sends a `GET` request to retrieve user data or a `POST` request for bulk actions.
    - **Processing**:
        - For `GET`: Retrieves users and aggregates their task summaries.
        - For `POST`: Processes bulk user actions as defined.
    - **Response**:
        - Returns the list of users with task summaries or confirmation of bulk actions in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the token is missing or invalid.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user lacks admin privileges.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that any data provided for user creation or updates is valid and conforms to required formats.

**Implementation Guidelines:**

- **Data Aggregation**:
    - Use MongoDB aggregation pipelines to compile task summaries for each user.
- **Security**:
    - Ensure that sensitive information (e.g., `password_hash`) is excluded from responses.
- **Pagination and Filtering**:
    - Implement pagination and filtering options for handling large user datasets efficiently.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/users/route.js':

- get
- post
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks for admin users, retrieves user data along with their task summaries from MongoDB, excludes sensitive information, and handles errors appropriately.

```

---

## 27. `users/login/route.js`

**File Path in Next.js:**

```bash
app/api/users/login/route.js

```

**Purpose:**

Handles user authentication by verifying credentials and issuing JWT tokens. This endpoint is essential for allowing users to securely log into the system.

**Key Components/Functions:**

- **`POST`**: Authenticates users by validating their email and password, then generates and returns a JWT token upon successful authentication.

**Implementation Guidelines:**

- **Purpose**: Enable users to securely log into the application by validating their credentials and providing authentication tokens for subsequent requests.
- **Key Functions**:
    - **`post`**:
        - **Functionality**:
            - Receives user login credentials (`email` and `password`).
            - Validates the credentials against the stored `User` data in MongoDB.
            - If valid, generates a JWT token containing user information.
            - Returns the token and user details (excluding sensitive information like `password_hash`).
        - **Security**:
            - Utilizes `bcrypt` to compare hashed passwords.
            - Ensures JWT tokens are signed with a secure secret key and have appropriate expiration times.
- **Integration Points**:
    - **Database Models**:
        - Interacts with the `User` model to retrieve and verify user credentials.
    - **Authentication Utilities**:
        - Uses utilities for hashing (`bcrypt`) and token generation (`jsonwebtoken`).
- **Data Flow**:
    - **Incoming Request**:
        - User sends a `POST` request with their `email` and `password`.
    - **Processing**:
        - The server retrieves the user by email.
        - Compares the provided password with the stored `password_hash`.
        - Generates a JWT token upon successful authentication.
    - **Response**:
        - Returns the JWT token and sanitized user information in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `400 Bad Request` if the user is not found or the password is incorrect.
    - **Validation Errors**:
        - Returns `400 Bad Request` for missing or invalid input data.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that both `email` and `password` are provided and conform to expected formats.
- **Security Considerations**:
    - Implement rate limiting to prevent brute-force attacks.
    - Use secure HTTP headers and HTTPS to protect data in transit.

**Implementation Guidelines:**

- **Password Handling**:
    - Use `bcrypt` for secure password hashing and comparison.
- **Token Generation**:
    - Use `jsonwebtoken` to create JWT tokens.
    - Store the secret key securely, preferably using environment variables.
- **Response Sanitization**:
    - Exclude sensitive fields like `password_hash` from the response.
- **Error Messaging**:
    - Provide generic error messages to prevent information leakage (e.g., "Invalid credentials" instead of specifying whether the email or password was incorrect).

**Implementation Prompt:**

```
Implement the following function for the file 'app/api/users/login/route.js':

- post

Ensure that the implementation follows Next.js 14 best practices, includes input validation, authenticates user credentials against the User model in MongoDB, generates secure JWT tokens, excludes sensitive information from responses, and handles errors appropriately.

```

---

## 28. `users/me/route.js`

**File Path in Next.js:**

```bash
app/api/users/me/route.js

```

**Purpose:**

Provides an endpoint for authenticated users to retrieve their own profile information. This allows users to view and manage their personal data within the system.

**Key Components/Functions:**

- **`GET`**: Retrieves the profile information of the authenticated user.
- **`PUT`**: Updates the profile information of the authenticated user.
- **`DELETE`**: Potentially allows users to delete their own accounts.

**Implementation Guidelines:**

- **Purpose**: Enable users to access and manage their personal profile information securely.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches the authenticated user's profile information from the database.
            - Excludes sensitive information like `password_hash`.
        - **Authorization**:
            - Accessible only to authenticated users.
    - **`put`**:
        - **Functionality**:
            - Allows users to update their profile details (e.g., username, bio, skills).
        - **Authorization**:
            - Ensures that users can only update their own profiles.
    - **`delete`**:
        - **Potential Uses**:
            - Allows users to delete their own accounts.
        - **Authorization**:
            - Ensures that users can only delete their own profiles.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the user is authenticated and attaches user information to the request.
    - **Database Models**:
        - Interacts with the `User` model to retrieve and update user data.
- **Data Flow**:
    - **Incoming Request**:
        - User sends a `GET` request to retrieve their profile or a `PUT` request to update their profile.
    - **Processing**:
        - For `GET`: Retrieves user data from the database.
        - For `PUT`: Validates input data and updates user information.
    - **Response**:
        - Returns the user's profile information or confirmation of updates in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user attempts to access or modify another user's profile.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid input data during profile updates.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that any data provided for profile updates (e.g., username, bio) is valid and conforms to required formats.

**Implementation Guidelines:**

- **Response Sanitization**:
    - Exclude sensitive fields like `password_hash` from the response.
- **Profile Updates**:
    - Allow users to update permissible fields only.
    - Implement checks to prevent users from modifying restricted fields like `role`.
- **Security Considerations**:
    - Protect against injection attacks by sanitizing input data.
    - Use HTTPS to secure data transmission.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/users/me/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks, retrieves and updates user data from the User model in MongoDB, excludes sensitive information from responses, validates input data, and handles errors appropriately.

```

---

## 29. `users/register/route.js`

**File Path in Next.js:**

```bash
app/api/users/register/route.js

```

**Purpose:**

Handles user registration by creating new user accounts. This endpoint allows new users to sign up by providing necessary details such as username, email, and password.

**Key Components/Functions:**

- **`POST`**: Registers a new user by creating a user account in the database.

**Implementation Guidelines:**

- **Purpose**: Enable new users to create accounts within the system, ensuring that user data is securely stored and validated.
- **Key Functions**:
    - **`post`**:
        - **Functionality**:
            - Receives user registration details (`username`, `email`, `password`, etc.).
            - Validates the input data for correctness and completeness.
            - Checks if the email already exists in the database to prevent duplicate accounts.
            - Hashes the user's password using `bcrypt` before storing it.
            - Creates a new user record in MongoDB.
            - Optionally assigns a default role (e.g., 'user') and initializes other fields.
            - Generates a JWT token upon successful registration.
            - Returns the token and sanitized user information.
        - **Security**:
            - Ensures that passwords are securely hashed.
            - Validates input to prevent injection attacks and other vulnerabilities.
- **Integration Points**:
    - **Database Models**:
        - Interacts with the `User` model to create new user records.
    - **Authentication Utilities**:
        - Uses `bcrypt` for password hashing and `jsonwebtoken` for token generation.
- **Data Flow**:
    - **Incoming Request**:
        - New user sends a `POST` request with registration details.
    - **Processing**:
        - Validates and sanitizes input data.
        - Checks for existing users with the same email.
        - Hashes the password and creates a new user record.
        - Generates a JWT token.
    - **Response**:
        - Returns the JWT token and user details (excluding `password_hash`) in JSON format.
- **Error Handling**:
    - **Validation Errors**:
        - Returns `400 Bad Request` for missing or invalid input data.
    - **Conflict Errors**:
        - Returns `409 Conflict` if a user with the provided email already exists.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that all required fields are provided and meet format requirements (e.g., valid email format).
    - Enforce password strength requirements to enhance security.

**Implementation Guidelines:**

- **Password Security**:
    - Use `bcrypt` to hash passwords before storing them.
    - Do not store plain-text passwords.
- **Token Generation**:
    - Use `jsonwebtoken` to create JWT tokens.
    - Store the secret key securely using environment variables.
- **Response Sanitization**:
    - Exclude sensitive fields like `password_hash` from the response.
- **Error Messaging**:
    - Provide clear and generic error messages to prevent information leakage (e.g., "Email already in use").

**Implementation Prompt:**

```
Implement the following function for the file 'app/api/users/register/route.js':

- post

Ensure that the implementation follows Next.js 14 best practices, includes input validation, securely hashes user passwords using bcrypt, checks for existing users to prevent duplicates, creates new user records in MongoDB, generates secure JWT tokens, excludes sensitive information from responses, and handles errors appropriately.

```

---

## 30. `users/[id]/route.js`

**File Path in Next.js:**

```bash
app/api/users/[id]/route.js

```

**Purpose:**

Handles operations for a specific user identified by their unique ID. This includes retrieving, updating, and deleting individual user accounts. Primarily intended for administrative actions, allowing admins to manage user accounts effectively.

**Key Components/Functions:**

- **`GET`**: Retrieves details of a specific user.
- **`PUT`**: Updates the details of a specific user.
- **`DELETE`**: Deletes a specific user account.

**Implementation Guidelines:**

- **Purpose**: Enable detailed management of individual user accounts, allowing for retrieval, modification, and removal based on the user's unique identifier.
- **Key Functions**:
    - **`get`**:
        - **Functionality**:
            - Fetches the user identified by the `[id]` parameter.
            - Includes user details and associated task summaries.
        - **Authorization**:
            - Accessible only to admins or the user themselves.
    - **`put`**:
        - **Functionality**:
            - Updates user details such as username, email, role, bio, and skills.
            - Allows admins to promote or demote users by changing roles.
        - **Authorization**:
            - Ensures that only admins or the user themselves can update the user details.
    - **`delete`**:
        - **Functionality**:
            - Removes the user from the database.
            - Handles cascading deletions of associated tasks, submissions, and comments.
        - **Authorization**:
            - Ensures that only admins or the user themselves can delete the user account.
- **Integration Points**:
    - **Authentication Middleware**:
        - Verifies that the requester has the necessary permissions (admin or user themselves).
    - **Database Models**:
        - Interacts with the `User`, `Task`, `Submission`, and `Comment` models to manage user data and associated records.
- **Data Flow**:
    - **Incoming Request**:
        - Admin sends a `GET`, `PUT`, or `DELETE` request targeting a specific user via their `[id]`.
    - **Processing**:
        - The server authenticates and authorizes the requester.
        - For `GET`: Retrieves the user from the database.
        - For `PUT`: Validates input data and updates user information.
        - For `DELETE`: Removes the user and handles cascading deletions.
    - **Response**:
        - Returns the user details, confirmation of updates, or deletion status in JSON format.
- **Error Handling**:
    - **Authentication Errors**:
        - Returns `401 Unauthorized` if the user is not authenticated.
    - **Authorization Errors**:
        - Returns `403 Forbidden` if the user lacks permission to perform the action.
    - **Not Found Errors**:
        - Returns `404 Not Found` if the user with the specified `[id]` does not exist.
    - **Validation Errors**:
        - Returns `400 Bad Request` for invalid input data during user updates.
    - **Server Errors**:
        - Returns `500 Internal Server Error` for unexpected issues.
- **Input Validation**:
    - Ensure that all updated user details are valid and conform to expected formats and constraints.
    - Prevent unauthorized fields from being updated (e.g., role changes restricted to admins).

**Implementation Guidelines:**

- **Response Sanitization**:
    - Exclude sensitive fields like `password_hash` from the response.
- **Role Management**:
    - Implement safeguards to prevent non-admin users from escalating privileges.
- **Data Integrity**:
    - Ensure that cascading deletions do not leave orphaned records in the database.
- **Security Considerations**:
    - Protect against injection attacks by sanitizing input data.
    - Use HTTPS to secure data transmission.

**Implementation Prompt:**

```
Implement the following functions for the file 'app/api/users/[id]/route.js':

- get
- put
- delete

Ensure that the implementation follows Next.js 14 best practices, includes authentication and authorization checks (admin or the user themselves), interacts with the User, Task, Submission, and Comment models in MongoDB, validates input data, excludes sensitive information from responses, manages cascading deletions, and handles errors appropriately.

```

---

## 31. Summary and Additional Considerations

Having detailed the core API routes, it's essential to consider the following aspects to ensure a robust and maintainable Next.js 14 application:

### **1. Middleware and Authentication**

- **Middleware Implementation**:
    - Utilize Next.js's built-in middleware to handle authentication and authorization.
    - Implement a global middleware to verify JWT tokens on protected routes.
- **Role-Based Access Control (RBAC)**:
    - Define user roles (e.g., 'user', 'admin') and assign permissions accordingly.
    - Ensure that role checks are enforced in API routes to protect sensitive operations.

### **2. Database Integration**

- **Mongoose Setup**:
    - Configure Mongoose to connect to your MongoDB instance.
    - Define schemas and models corresponding to `User`, `Project`, `Task`, `Submission`, and `Comment`.
- **Connection Management**:
    - Implement efficient connection pooling and error handling for database interactions.

### **3. File Uploads and Storage**

- **Handling File Uploads**:
    - Use `multer` or similar middleware within Next.js API routes to manage multipart/form-data.
    - Store uploaded files in a secure and scalable storage solution (e.g., AWS S3, Google Cloud Storage) if necessary.
- **Static File Serving**:
    - Configure Next.js to serve static files securely, ensuring that only authorized users can access them.

### **4. Frontend Components**

- **Page Structure**:
    - Utilize Next.js's `app/` directory for defining pages and layouts.
    - Create React components for user interfaces such as dashboards, task lists, project views, and admin panels.
- **Styling with Tailwind CSS**:
    - Integrate Tailwind CSS for rapid and responsive UI development.
    - Leverage Next.js's built-in support for PostCSS and Tailwind configurations.
- **State Management**:
    - Use React's Context API or state management libraries (e.g., Redux) to manage global state, such as user authentication status and application data.

### **5. Security Best Practices**

- **Input Sanitization**:
    - Sanitize all incoming data to prevent injection attacks and ensure data integrity.
- **HTTPS Enforcement**:
    - Ensure that the application is served over HTTPS to secure data in transit.
- **Secure Storage of Secrets**:
    - Store sensitive information like JWT secret keys and database credentials in environment variables.

### **6. Error Handling and Logging**

- **Consistent Error Responses**:
    - Implement a standardized error response format across all API routes.
- **Logging Mechanisms**:
    - Use logging libraries (e.g., `winston`, `pino`) to log errors and important events for monitoring and debugging.
- **User-Friendly Error Messages**:
    - Provide clear and concise error messages to users without exposing sensitive information.

### **7. Performance Optimization**

- **API Route Optimization**:
    - Optimize database queries to reduce latency and improve response times.
- **Caching Strategies**:
    - Implement caching for frequently accessed data to enhance performance.
- **Code Splitting and Lazy Loading**:
    - Utilize Next.js's features to split code and lazy load components as needed, improving initial load times.

### **8. Testing and Deployment**

- **Testing Frameworks**:
    - Use testing frameworks like Jest and React Testing Library to write unit and integration tests.
- **Continuous Integration/Continuous Deployment (CI/CD)**:
    - Set up CI/CD pipelines to automate testing and deployment processes.
- **Monitoring and Analytics**:
    - Integrate monitoring tools (e.g., Sentry, New Relic) to track application performance and errors in real-time.

### **9. Documentation**

- **API Documentation**:
    - Use tools like Swagger or API Blueprint to document API endpoints, request/response structures, and authentication mechanisms.
- **Code Documentation**:
    - Maintain comprehensive inline comments and documentation for ease of maintenance and onboarding.

### **10. Scalability Considerations**

- **Horizontal Scaling**:
    - Design the application to support horizontal scaling, allowing it to handle increased load by adding more instances.
- **Database Scaling**:
    - Implement database indexing and sharding strategies to manage large datasets efficiently.
- **Load Balancing**:
    - Use load balancers to distribute incoming traffic evenly across server instances.

---

## 32. Conclusion

By following this comprehensive guide, you can effectively transition your existing Express.js project to Next.js 14, leveraging its modern features for both frontend and backend development. Each API route has been meticulously detailed to ensure proper implementation, security, and scalability. Additionally, considering middleware, database integration, frontend components, security best practices, error handling, performance optimization, testing, deployment, documentation, and scalability will contribute to building a robust and maintainable application.

Remember to continuously refer to Next.js 14's official documentation and best practices to stay updated with the latest features and recommendations.

If you require further assistance with specific implementations or have additional questions, feel free to ask!