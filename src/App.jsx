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
import DiningPage from './components/dining/DiningPage';
import RestaurantDetailPage from './components/restaurants/RestaurantDetailPage';
import CafeDetailPage from './components/cafes/CafeDetailPage';
import EventDetailPage from './components/events/EventDetailPage';
import AddRestaurantPage from './components/restaurants/AddRestaurantPage';
import AddCafePage from './components/cafes/AddCafePage';
import ProfilePage from './components/profile/ProfilePage';
import BaseLayout from './layouts/BaseLayout';
import { ThemeProvider, CssBaseline } from '@mui/material';
import telegramTheme from './theme/telegramTheme';

function App() {
  return (
    <ThemeProvider theme={telegramTheme}>
      <CssBaseline />
      <AuthProvider>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<HomePageComponent/>}/>
            <Route path="/jobs" element={<HomePageComponent/>}/>
            <Route path="/events" element={<EventsPage/>}/>
          <Route path="/dining" element={<DiningPage/>}/>
            <Route path="/restaurants" element={<DiningPage/>}/>
            <Route path="/cafes" element={<DiningPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/login" element={<LoginComponent/>}/>
            <Route path="/register" element={<RegisterComponent/>}/>
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/job/:id" element={<JobDetailPage/>}/>
          <Route path="/event/:id" element={<EventDetailPage/>}/>
          <Route path="/restaurant/:id" element={<RestaurantDetailPage/>}/>
          <Route path="/cafe/:id" element={<CafeDetailPage/>}/>
            <Route path='/addJob' element={<AddJobPage/>}/>
            <Route path='/addEvent' element={<AddEventPage/>}/>
            <Route path='/addRestaurant' element={<AddRestaurantPage/>}/>
            <Route path='/addCafe' element={<AddCafePage/>}/>
            <Route path="*" element={<div>404 Not Found</div>}/>
          </Routes>
        </BaseLayout>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
