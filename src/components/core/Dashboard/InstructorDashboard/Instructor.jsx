import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

export default function Instructor() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false)
    const [instructorData, setInstructorData] = useState([])
    const [courses, setCourses] = useState([])
  
    useEffect(() => {
      ;(async () => {
        setLoading(true)
        const instructorApiData = await getInstructorData(token)
        const result = await fetchInstructorCourses(token)
        console.log(instructorApiData)
        if (instructorApiData) {
          setInstructorData(instructorApiData)
        }
        if (result) {
          setCourses(result)
        }
        setLoading(false)
      })()
    }, [])
  
    const totalAmount = instructorData?.reduce(
      (acc, curr) => acc + (curr.totalAmountGenerated || 0),
      0
    ) || 0
  
    const totalStudents = instructorData?.reduce(
      (acc, curr) => acc + (curr.totalStudentsEnrolled || 0),
      0
    ) || 0

    // Additional Stats
    const bestSellingCourse = instructorData?.reduce(
      (prev, curr) => ((curr.totalStudentsEnrolled || 0) > (prev?.totalStudentsEnrolled || 0)) ? curr : prev,
      instructorData[0]
    )

    const avgPrice = courses.length > 0
      ? (courses.reduce((acc, curr) => acc + (curr.price || 0), 0) / courses.length).toFixed(0)
      : 0;
  
    return (
      <div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-richblack-5">
            Hi {user?.firstName} 👋
          </h1>
          <p className="font-medium text-richblack-200">
            Let's start something new
          </p>
        </div>
        {loading ? (
          <div className="spinner"></div>
        ) : courses.length > 0 ? (
          <div>
            <div className="my-4 flex h-[450px] space-x-4">
              {/* Render chart / graph */}
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="flex-1 rounded-md bg-richblack-800 p-6">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-xl font-medium text-richblack-50">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}
              {/* Total Statistics */}
              <div className="flex min-w-[260px] flex-col rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Statistics</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-richblack-300">Total Courses</p>
                    <p className="text-3xl font-semibold text-richblack-50">
                      {courses.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-richblack-300">Total Students</p>
                    <p className="text-3xl font-semibold text-richblack-50">
                      {totalStudents}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-richblack-300">Total Income</p>
                    <p className="text-3xl font-semibold text-richblack-50">
                      Rs. {totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-richblack-300">Avg Course Price</p>
                    <p className="text-2xl font-semibold text-richblack-50">
                      Rs. {avgPrice}
                    </p>
                  </div>
                  {bestSellingCourse && (
                    <div className="border-t border-richblack-700 pt-3">
                      <p className="text-sm text-richblack-300">Best Seller</p>
                      <p className="text-sm font-semibold text-yellow-50 truncate max-w-[200px]" title={bestSellingCourse.courseName}>
                        {bestSellingCourse.courseName}
                      </p>
                      <p className="text-xs text-richblack-400">
                        ({bestSellingCourse.totalStudentsEnrolled} students)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-md bg-richblack-800 p-6">
              {/* Render 3 courses */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                <Link to="/dashboard/my-courses">
                  <p className="text-xs font-semibold text-yellow-50">View All</p>
                </Link>
              </div>
              <div className="my-4 flex items-stretch space-x-6">
                {courses.slice(0, 3).map((course) => (
                  <div key={course._id} className="group flex w-1/3 flex-col rounded-lg bg-richblack-900 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-richblack-700 hover:shadow-md">
                    <div className="overflow-hidden rounded-md">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-[180px] w-full rounded-md object-cover transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3 flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm font-semibold text-richblack-50 group-hover:text-yellow-50 transition-colors duration-200 line-clamp-2">
                          {course.courseName}
                        </p>
                        <p className="mt-1 text-xs text-richblack-300">
                          {course.studentsEnrolled?.length || 0} students enrolled
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-richblack-800 pt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          course.status === "Published" ? "bg-[#005B41] text-[#00FFAB]" : "bg-[#5B0017] text-[#FF004D]"
                        }`}>
                          {course.status || "Draft"}
                        </span>
                        <p className="text-sm font-semibold text-yellow-50">Rs. {course.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
            <p className="text-center text-2xl font-bold text-richblack-5">
              You have not created any courses yet
            </p>
            <Link to="/dashboard/add-course">
              <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
                Create a course
              </p>
            </Link>
          </div>
        )}
      </div>
    )
  }