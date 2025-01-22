import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
    useNavigate
} from 'react-router-dom'
import NavBar from './components/NavBar.js';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AsCreation from './pages/AssignmentCreation.js';
import CoCreation from './pages/CourseCreation.js'
import CoOverview from './pages/CourseOverview.js'
import Schedule from './pages/Schedule';
import Questions from './pages/Questions';
import Login from './pages/Login';
import Grades from './pages/Grades';
import './App.css';
import Assignment from './pages/Assignment';  // Adjust this path based on your directory structure
import Review from './pages/Review';  // Adjust this path based on your directory structure
import StudentAssignment from './pages/StudentAssignment';
// Zeer goed mogelijk dat ik dit veels te druk heb gemaakt en dat dit elders
// moet staan, maar ik wil het vooral gewoon aan de praat krijgen nu.
function App() {
    const location = useLocation()
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        async function checkAuth() {
            try {
                // Not sure what this should be set to on an actual server, but this
                // works for testing.
                const response = await fetch('/api/authenticate')
                const data = await response.json()
                if (response.ok) {
                    setIsAuthenticated(data.logged_in);
                    if (!data.logged_in) {
                        navigate('/login')
                    }
                } else {
                    console.error(data.message)
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Fetch error:', error)
                setIsAuthenticated(false);
            }
        }
        checkAuth()
    }, [])
    if (isAuthenticated === null) {
        return <div>Authenticating...</div>
    }
    // if (!isAuthenticated) {
    //     console.log("navigating to login")
    //     return <Navigate to="/Login" replace={false} />
    // }
    return (
        <div className='App'>
            {location.pathname !== '/login' && <NavBar />}
            <div className='content'>
                <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/login' element={<Login  />} />
                    <Route path='/Profile' element={<Profile />} />
                    <Route path='/Grades' element={<Grades />} />
                    <Route path='/:courseName/:assignmentName/create' element={<AsCreation />} />
                    <Route path='/CourseCreation' element={<CoCreation />} />
                    <Route path='/CourseOverview/:courseName' element={<CoOverview />} />
                    <Route path='/Schedule' element={<Schedule />} />
                    <Route path='/Questions' element={<Questions />} />
                    <Route path='/:courseName/:assignmentName/create_question' element={<Questions />} />
                    <Route path='/Questions/edit/:questionId/:questionType' element={<Questions />} />
                    <Route path='/Assignment' element={<Assignment />} />
                    <Route path='/review/:assignmentName/:studentId' element={<Review />} />
                    <Route path='/' element={<Assignment />} />
                    <Route path='/:courseName/:assignmentName/answer' element={<StudentAssignment />} />
                    <Route path="/Schedule/:courseName" element={<Schedule />} />
                </Routes>
            </div>
        </div>
    )
}

// Without this uselocation cant use the router context.
function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    )
}

export default AppWrapper
