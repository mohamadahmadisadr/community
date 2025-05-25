import './App.css';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import HomePageComponent from './components/home/HomePageComponent';
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import  AboutPage  from './pages/AboutPage';
import JobDetailPage from './components/JobDetail/JobDetailComponent';
import AddJobPage from './components/AddJobPage';
import EventsPage from './components/events/EventsPage';
import AddEventPage from './components/events/AddEventPage';
import RestaurantsPage from './components/restaurants/RestaurantsPage';
import AddRestaurantPage from './components/restaurants/AddRestaurantPage';
import CafesPage from './components/cafes/CafesPage';
import AddCafePage from './components/cafes/AddCafePage';
import BottomNavigation from './components/BottomNavigation';
import { Box } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <Box sx={{
        m: 0,
        p: 0,
        pb: 8, // Only bottom padding for bottom navigation
        minHeight: '100vh',
        width: '100%'
      }}>
        <Routes>
          <Route path="/" element={<HomePageComponent/>}/>
          <Route path="/jobs" element={<HomePageComponent/>}/>
          <Route path="/events" element={<EventsPage/>}/>
          <Route path="/restaurants" element={<RestaurantsPage/>}/>
          <Route path="/cafes" element={<CafesPage/>}/>
          <Route path="/login" element={<LoginComponent/>}/>
          <Route path="/register" element={<RegisterComponent/>}/>
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/job/:id" element={<JobDetailPage/>}/>
          <Route path='/addJob' element={<AddJobPage/>}/>
          <Route path='/addEvent' element={<AddEventPage/>}/>
          <Route path='/addRestaurant' element={<AddRestaurantPage/>}/>
          <Route path='/addCafe' element={<AddCafePage/>}/>
          <Route path="*" element={<div>404 Not Found</div>}/>
        </Routes>
      </Box>
      <BottomNavigation />
    </AuthProvider>
  )
}

export default App
