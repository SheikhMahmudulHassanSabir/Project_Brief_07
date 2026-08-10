# Project Planning and Requirement Analysis

## Project Title: Job Portal System

### 1 Problem Statement

#### What Problem Exists?

The traditional recruitment process is often time-consuming, inefficient, and difficult to manage. Companies may face challenges in creating and managing job postings, reviewing applications, organizing candidate information, and tracking recruitment progress. On the other hand, job seekers often experience difficulties in finding suitable employment opportunities, submitting applications, and monitoring the status of their applications.

Traditional recruitment methods frequently depend on manual communication, paperwork, emails, and scattered candidate information. These practices can lead to delays, information duplication, poor organization, and difficulties in maintaining accurate recruitment records.

#### Why Does It Need to Be Solved?

A centralized and efficient recruitment platform is required to simplify and organize the hiring process. The proposed Job Portal System will provide a single platform where employers and job seekers can interact throughout the recruitment process.

The system will support secure authentication, job posting and management, job searching, application submission, application tracking, recruitment management, and role-based access control. By centralizing these activities, the system aims to reduce manual effort, improve communication and organization, and make the overall recruitment process more efficient.

---

### 2 Objectives

The main objectives of the Job Portal System are:

* To design and develop a centralized job portal that enables employers to post job vacancies and job seekers to search and apply for suitable positions.
* To provide secure user authentication and role-based authorization for administrators, employers, recruiters, and job seekers.
* To simplify the recruitment process through application management, candidate tracking, and recruitment status updates.
* To provide employers and recruiters with tools for reviewing, shortlisting, and managing applicants.
* To enable job seekers to maintain their profiles, manage their skills and education information, and track their job applications.
* To provide dashboards and reports that display relevant recruitment and application statistics.
* To develop a responsive and user-friendly web application using the MERN stack.

---

### 3 Stakeholders

The major stakeholders involved in the Job Portal System are:

1. **Administrator (Admin)**
   Responsible for managing users, companies, system activities, and overall platform administration.

2. **Employer / Company**
   Responsible for registering company information, posting job vacancies, managing job listings, and reviewing applicants.

3. **Recruiter**
   Responsible for reviewing applications, shortlisting candidates, updating recruitment statuses, and supporting the hiring process.

4. **Job Seeker (Applicant)**
   Responsible for creating and maintaining a profile, searching for suitable jobs, submitting applications, and tracking application progress.

---

### 4 Scope of Features

#### Included Features

The Job Portal System will include the following features:

* User registration and login
* Secure authentication and authorization
* Role-based access control
* Company registration and management
* Company profile management
* Job posting and management
* Job searching and filtering
* Job applications
* Applicant profile management
* Skills and education management
* Resume information and optional resume upload
* Application tracking
* Application history
* Application withdrawal
* Recruitment management
* Candidate shortlisting
* Recruitment status updates
* User and recruitment dashboards
* Recruitment and application reports
* Job-related reports

#### Excluded Features

The following features are outside the scope of the current project:

* AI-based resume screening
* Interview scheduling
* Video interviews
* Email integration
* Integration with third-party job boards
* Dedicated mobile application

These features may be considered as future enhancements.

---

### 4.5 Functional Requirements

The functional requirements define the main operations and services that the Job Portal System must provide.

#### 1. User Authentication

The system shall provide secure registration and login functionality for administrators, employers, recruiters, and job seekers. JWT-based authentication will be used to verify user identities and protect restricted resources.

#### 2. Company Management

Employers shall be able to register companies, create and update company profiles, manage company information, and view company details.

#### 3. Job Management

Employers shall be able to create, edit, delete, and publish job vacancies. They shall also be able to manage existing job postings according to their recruitment requirements.

#### 4. Applicant Management

Job seekers shall be able to create and manage their profiles. They shall be able to update personal information, skills, and educational qualifications and optionally provide or upload resume information.

#### 5. Application Management

Job seekers shall be able to apply for available jobs, view their application history, track the status of submitted applications, and withdraw applications when permitted.

#### 6. Recruitment Management

Employers and recruiters shall be able to review submitted applications, evaluate applicants, shortlist suitable candidates, update recruitment statuses, and generate recruitment-related reports.

#### 7. Dashboard

The system shall provide role-specific dashboards. These dashboards will display relevant information such as recruitment statistics, job listings, applications, user activities, and application statuses.

#### 8. Search and Filter

Job seekers shall be able to search and filter available jobs using different criteria, including:

* Keywords
* Job categories
* Company names
* Locations

#### 9. Reports

The system shall generate reports containing relevant recruitment and hiring information, including job statistics, application statistics, and recruitment activities.

#### 10. Notifications — Future Enhancement

A notification system may be implemented in a future version to notify users about application status changes, new job opportunities, and other relevant recruitment activities.

---

### 4.6 Non-Functional Requirements

#### 11. Performance

The system should provide fast and efficient job searching, page loading, and application processing. The system should be designed to handle multiple users and recruitment activities efficiently.

#### 12. Security

The system shall protect user and application data from unauthorized access. JWT authentication and role-based authorization shall be implemented to ensure that users can access only the resources and functions permitted for their roles.

#### 13. Reliability

The system should provide reliable access to recruitment services and ensure that important user, job, and application data is stored securely and consistently.

#### 14. Usability

The system should provide a clean, intuitive, responsive, and user-friendly interface. Users should be able to perform common tasks such as searching for jobs, applying for positions, and managing applications with minimal difficulty.

#### 15. Backup and Recovery

Regular database backups should be maintained to minimize the risk of data loss. Appropriate recovery mechanisms should be considered to restore important system data in the event of failures.

---

### 4.7 Core Modules

The Job Portal System will consist of the following major modules:

#### 1. User Management Module

This module manages user accounts and authentication-related activities.

**Main functions:**

* User registration
* User login
* Profile management
* Password management
* Role management
* Authentication and authorization

#### 2. Company Management Module

This module allows employers to manage their company-related information.

**Main functions:**

* Company registration
* Company profile creation
* Updating company information
* Viewing company details

#### 3. Job Management Module

This module manages job vacancies and job-related activities.

**Main functions:**

* Create job postings
* Update job postings
* Delete job postings
* Publish job vacancies
* Search jobs
* Filter jobs

#### 4. Applicant Management Module

This module allows job seekers to create and maintain their professional profiles.

**Main functions:**

* Applicant profile management
* Resume information
* Skills management
* Education details
* Personal information management

#### 5. Application Management Module

This module manages the process of applying for jobs and tracking applications.

**Main functions:**

* Apply for jobs
* Track application status
* View application history
* Withdraw applications

#### 6. Recruitment Management Module

This module supports employers and recruiters throughout the candidate selection process.

**Main functions:**

* Review applications
* Shortlist candidates
* Update recruitment status
* Manage candidate progress
* Generate recruitment reports

#### 7. Dashboard Module

The dashboard module provides role-specific information and statistics.

**Main dashboards:**

* Admin Dashboard
* Employer Dashboard
* Job Seeker Dashboard

#### 8. Report Module

The report module provides summarized information about recruitment activities.

**Main reports:**

* Recruitment reports
* Job reports
* Application reports
* Hiring statistics

---

### 4.8 Project Scope

The Job Portal System is a web-based recruitment platform designed to centralize and simplify the hiring process. The system will allow employers and recruiters to create and manage job vacancies, review applicants, and monitor recruitment activities.

At the same time, job seekers will be able to create professional profiles, search and filter available job opportunities, apply for suitable positions, and track their application status.

Administrators will be responsible for managing users, companies, and overall system activities. The system will use secure authentication and role-based access control to ensure that each stakeholder can access the appropriate features and information.

The project will be developed as a responsive web application using the MERN stack, consisting of **MongoDB, Express.js, React.js, and Node.js**.

---

### 4.9 Expected Outcome

The expected outcome of the Job Portal System is a secure, centralized, user-friendly, and efficient recruitment platform that improves the overall hiring process.

The system is expected to:

* Simplify job posting and job searching.
* Reduce manual recruitment activities.
* Allow job seekers to apply for suitable positions easily.
* Provide transparent application tracking.
* Help employers and recruiters efficiently manage applicants.
* Improve the organization of candidate and recruitment information.
* Provide useful recruitment statistics and reports.
* Ensure secure access through authentication and role-based authorization.
* Provide a responsive interface that can be accessed across different devices.

Overall, the system aims to make the recruitment process **faster, more organized, transparent, and efficient** for administrators, employers, recruiters, and job seekers.

---

# 5. Conclusion

During **Sprint 1 and Sprint 2**, the foundational infrastructure and requirement framework for the Job Portal System were successfully established. The development environment and version control setup were prepared, while the project documentation and initial planning activities were completed.

A comprehensive analysis of the system requirements was also carried out. The major stakeholders, including administrators, employers, recruiters, and job seekers, were identified, and their respective roles and responsibilities were defined. The functional and non-functional requirements of the system were documented, along with the project scope, expected outcomes, and major system modules.

The identification of core modules such as User Management, Company Management, Job Management, Applicant Management, Application Management, Recruitment Management, Dashboard, and Reporting provides a clear structure for the development process.

Overall, Sprint 1 and Sprint 2 have established a strong and well-organized foundation for the Job Portal System. The outcomes of these sprints will guide the **UI/UX design, database design, system development, implementation, and testing activities in the subsequent sprints**.
