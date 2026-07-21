const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Category = require("../models/Category");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

async function getOrCreateUser(email, firstName, lastName, accountType, passwordText) {
    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(passwordText, 10);
    const initials = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
    if (!user) {
        console.log(`Creating ${accountType} user: ${email}...`);
        const profile = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: `Hello, I am a ${accountType} on EduMotion.`,
            contactNumber: null,
        });
        user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            approved: true,
            active: true,
            additionalDetails: profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(initials)}`,
            courses: [],
            courseProgress: [],
        });
    } else {
        console.log(`Resetting credentials for existing user: ${email}...`);
        user.password = hashedPassword;
        user.accountType = accountType;
        user.approved = true;
        user.active = true;
        await user.save();
    }
    return user;
}

async function getOrCreateCategory(name, description) {
    let category = await Category.findOne({ name });
    if (!category) {
        console.log(`Creating Category: ${name}...`);
        category = await Category.create({ name, description, courses: [] });
    }
    return category;
}

const coursesData = {
    "Web Development": [
        {
            courseName: "React JS Masterclass",
            courseDescription: "Master React.js from scratch. Learn components, hooks, routing, Redux, and build production-ready apps.",
            whatYouWillLearn: "Learn React Components, state, props, JSX, standard hooks (useState, useEffect, useContext), custom hooks, routing with React Router, and state management with Redux Toolkit.",
            price: 499,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
            tag: ["React", "Web Development", "Frontend"],
            instructions: ["Basic JavaScript knowledge required", "Access to a modern computer and text editor", "Enthusiasm to build cool frontend applications"],
            reviews: [
                { rating: 5, review: "An absolute masterclass! Extremely thorough explanation of React hooks and state management.", studentIndex: 0 },
                { rating: 4, review: "Loved the hands-on projects. Explains Redux Toolkit very clearly.", studentIndex: 1 }
            ]
        },
        {
            courseName: "Node.js Backend Bootcamp",
            courseDescription: "Learn to build scalable backend systems with Node.js, Express, MongoDB, and deploy them to the cloud.",
            whatYouWillLearn: "Understand REST APIs, asynchronous programming, Express framework, database modeling with Mongoose, JWT authentication, and file upload systems.",
            price: 599,
            thumbnail: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=600&auto=format&fit=crop",
            tag: ["Nodejs", "Backend", "Express"],
            instructions: ["Basic JavaScript knowledge required", "Familiarity with command line basics", "Willingness to learn backend mechanics"],
            reviews: [
                { rating: 5, review: "Brilliant backend guide. Everything connects so nicely.", studentIndex: 0 },
                { rating: 5, review: "The authentication and file-upload section is worth every penny.", studentIndex: 1 }
            ]
        },
        {
            courseName: "Full Stack Web Development (MERN)",
            courseDescription: "Become a professional MERN stack developer. Learn MongoDB, Express, React, and Node.js with hands-on projects.",
            whatYouWillLearn: "End-to-end full stack developer training. Build, test, and deploy single-page applications connected to a secure backend REST API.",
            price: 999,
            thumbnail: "https://images.unsplash.com/photo-1484417894907-623942c8ea29?q=80&w=600&auto=format&fit=crop",
            tag: ["MERN", "Full Stack", "MongoDB"],
            instructions: ["No prior programming experience required!", "We teach everything from the absolute basics up to deployment", "Must have a laptop/PC with internet access"],
            reviews: [
                { rating: 5, review: "Excellent end-to-end full stack course. Built a massive project!", studentIndex: 0 },
                { rating: 4.5, review: "Highly interactive and very structured. Recommended for beginners.", studentIndex: 1 }
            ]
        }
    ],
    "DSA": [
        {
            courseName: "DSA in C++: Zero to Hero",
            courseDescription: "Complete path to mastering Data Structures & Algorithms using C++. Perfect for college students and job seekers.",
            whatYouWillLearn: "Solve complex programming challenges. Master time complexity analysis, arrays, strings, recursion, linked lists, stacks, queues, trees, graphs, and dynamic programming in C++.",
            price: 699,
            thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
            tag: ["DSA", "C++", "Algorithms"],
            instructions: ["Basic C++ syntax knowledge is helpful but not mandatory", "A computer to run C++ programs", "Dedication to solving coding problems daily"],
            reviews: [
                { rating: 5, review: "Best DSA course online. Visually explains recursion and tree traversal beautifully.", studentIndex: 0 },
                { rating: 4, review: "Very helpful for placements. Dynamic programming section is a lifesaver.", studentIndex: 1 }
            ]
        },
        {
            courseName: "Data Structures & Algorithms in Java",
            courseDescription: "Learn core data structures and algorithm analysis using Java. Covers arrays, trees, graphs, and dynamic programming.",
            whatYouWillLearn: "Master Java collection framework. Build custom implementation of data structures and write clean, optimized code for placements.",
            price: 699,
            thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
            tag: ["DSA", "Java", "Interview Prep"],
            instructions: ["Familiarity with Object-Oriented Programming (OOP) in Java", "IDE installed (IntelliJ IDEA or Eclipse)", "Ready to solve lots of interview questions"],
            reviews: [
                { rating: 5, review: "Top notch structure. The instructor explains every edge case.", studentIndex: 0 },
                { rating: 5, review: "Solved over 150+ problems in Java. Fully prepared me for technical rounds.", studentIndex: 1 }
            ]
        },
        {
            courseName: "Python for Coding Interviews",
            courseDescription: "Ace your coding interviews with Python. Master arrays, strings, hash maps, two pointers, and sliding window techniques.",
            whatYouWillLearn: "Solve LeetCode/Hackerrank questions in Python efficiently. Master Python built-ins like collections, heaps, and writing readable logic.",
            price: 399,
            thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
            tag: ["DSA", "Python", "Interviews"],
            instructions: ["Basic Python knowledge is expected", "Curiosity to learn optimized algorithms", "Active account on coding platforms (optional but recommended)"],
            reviews: [
                { rating: 5, review: "Extremely useful for fast-paced coding rounds. Python code is clean and concise.", studentIndex: 0 },
                { rating: 4, review: "Short, crisp, and to the point. Great for last minute review.", studentIndex: 1 }
            ]
        }
    ],
    "Freelancing": [
        {
            courseName: "Upwork & Fiverr Blueprint",
            courseDescription: "Learn the secrets to creating high-converting profiles, writing winning proposals, and earning six figures on Upwork and Fiverr.",
            whatYouWillLearn: "Optimize Upwork profile, pass vetting, design gigs on Fiverr, write custom proposals, set pricing, negotiate with clients, and maintain a 5-star rating.",
            price: 299,
            thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
            tag: ["Freelancing", "Upwork", "Fiverr"],
            instructions: ["You must have a skill to offer (design, development, writing, etc.)", "Basic communication skills", "Access to high-speed internet"],
            reviews: [
                { rating: 5, review: "Changed my freelancing career. Got my first $500 client within a week!", studentIndex: 0 },
                { rating: 5, review: "Invaluable advice on proposal writing. Worth every penny.", studentIndex: 1 }
            ]
        },
        {
            courseName: "Freelance Web Design Masterclass",
            courseDescription: "Build a profitable freelance web design business. Learn design principles, Figma, client management, and pricing strategies.",
            whatYouWillLearn: "Web design principles (layouts, colors, typography), Figma prototyping, onboarding clients, drawing up contracts, and charging thousands for website designs.",
            price: 499,
            thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop",
            tag: ["Freelancing", "Web Design", "Figma"],
            instructions: ["No coding required!", "A free Figma account", "Ready to talk to clients and show design value"],
            reviews: [
                { rating: 4.5, review: "Great breakdown of designing in Figma and landing clients.", studentIndex: 0 },
                { rating: 5, review: "I love the business templates and email copy provided in the resources.", studentIndex: 1 }
            ]
        },
        {
            courseName: "Client Acquisition & Copywriting",
            courseDescription: "Master cold emailing, LinkedIn networking, and persuasive copywriting to close high-ticket freelance clients.",
            whatYouWillLearn: "Find high-value leads on LinkedIn, run automated cold email campaigns, write persuasive copy, handle sales calls, and pitch retainer services.",
            price: 399,
            thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
            tag: ["Freelancing", "Copywriting", "Sales"],
            instructions: ["Willingness to send cold outreach emails", "Basic English writing skills", "A LinkedIn profile"],
            reviews: [
                { rating: 5, review: "Super high-value templates. Closed a retainer client using the LinkedIn framework.", studentIndex: 0 },
                { rating: 4, review: "Good sales techniques. Requires effort to implement, but it works.", studentIndex: 1 }
            ]
        }
    ]
};

exports.seedData = async () => {
    try {
        console.log("Starting DB seeding...");

        // 1. Seed Users
        const instructor = await getOrCreateUser("instructor@edumotion.com", "Demo", "Instructor", "Instructor", "password123");
        const student1 = await getOrCreateUser("student1@edumotion.com", "Jane", "Student", "Student", "password123");
        const student2 = await getOrCreateUser("student2@edumotion.com", "John", "Scholar", "Student", "password123");
        const students = [student1, student2];

        // 2. Seed Categories
        const categoriesMap = {};
        categoriesMap["Web Development"] = await getOrCreateCategory(
            "Web Development",
            "Learn to build modern, responsive web applications using the latest technologies."
        );
        categoriesMap["DSA"] = await getOrCreateCategory(
            "DSA",
            "Master Data Structures and Algorithms to ace coding interviews and build efficient software."
        );
        categoriesMap["Freelancing"] = await getOrCreateCategory(
            "Freelancing",
            "Learn how to build a successful freelancing career, win clients, and scale your business."
        );

        // 3. Seed Courses for each Category
        for (const [categoryName, coursesList] of Object.entries(coursesData)) {
            const category = categoriesMap[categoryName];

            for (const cData of coursesList) {
                // Check if course already exists
                let course = await Course.findOne({ courseName: cData.courseName });
                if (!course) {
                    console.log(`Creating course: ${cData.courseName}...`);

                    // Create SubSection (Lecture)
                    const subSec = await SubSection.create({
                        title: "Introduction Lecture",
                        timeDuration: "10:15",
                        description: `Welcome to the ${cData.courseName} course overview lecture.`,
                        videoUrl: "https://res.cloudinary.com/ducgaxzyy/video/upload/v1672531122/demo_lecture.mp4",
                    });

                    // Create Section
                    const sec = await Section.create({
                        sectionName: "Course Overview",
                        subSection: [subSec._id],
                    });

                    // Create Course
                    course = await Course.create({
                        courseName: cData.courseName,
                        courseDescription: cData.courseDescription,
                        instructor: instructor._id,
                        whatYouWillLearn: cData.whatYouWillLearn,
                        courseContent: [sec._id],
                        ratingAndReviews: [],
                        price: cData.price,
                        thumbnail: cData.thumbnail,
                        tag: cData.tag,
                        category: category._id,
                        studentsEnrolled: [],
                        instructions: cData.instructions,
                        status: "Published",
                    });

                    // Create Reviews & Enrolled Students
                    const reviewIds = [];
                    const enrolledStudentIds = [];

                    for (const r of cData.reviews) {
                        const studentUser = students[r.studentIndex];
                        
                        // Create RatingAndReview
                        const reviewObj = await RatingAndReview.create({
                            user: studentUser._id,
                            rating: r.rating,
                            review: r.review,
                            course: course._id,
                        });

                        reviewIds.push(reviewObj._id);
                        enrolledStudentIds.push(studentUser._id);

                        // Add course to student's courses array
                        await User.findByIdAndUpdate(studentUser._id, {
                            $addToSet: { courses: course._id }
                        });
                    }

                    // Update Course with reviews and enrolled students
                    course.ratingAndReviews = reviewIds;
                    course.studentsEnrolled = enrolledStudentIds;
                    await course.save();

                    // Add course to category courses array
                    await Category.findByIdAndUpdate(category._id, {
                        $addToSet: { courses: course._id }
                    });

                    // Add course to instructor courses array
                    await User.findByIdAndUpdate(instructor._id, {
                        $addToSet: { courses: course._id }
                    });
                }
            }
        }
        // 4. Delete all categories except the default three
        const deleteResult = await Category.deleteMany({
            name: { $nin: ["Web Development", "DSA", "Freelancing"] }
        });
        console.log(`Deleted ${deleteResult.deletedCount} non-default categories.`);

        console.log("DB seeding completed successfully.");
    } catch (err) {
        console.error("Error during DB seeding:", err);
    }
};
