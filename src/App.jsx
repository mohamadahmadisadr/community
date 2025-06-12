import './App.css';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import BaseLayout from './layouts/BaseLayout';
import { CssBaseline, CircularProgress, Box } from '@mui/material';

// Lazy load components for better code splitting
const LoginComponent = lazy(() => import('./components/LoginComponent'));
const RegisterComponent = lazy(() => import('./components/RegisterComponent'));
const HomePageComponent = lazy(() => import('./components/home/HomePageComponent'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const JobDetailPage = lazy(() => import('./components/JobDetail/JobDetailComponent'));
const AddJobPage = lazy(() => import('./components/AddJobPage'));
const EventsPage = lazy(() => import('./components/events/EventsPage'));
const AddEventPage = lazy(() => import('./components/events/AddEventPage'));
const DiningPage = lazy(() => import('./components/dining/DiningPage'));
const RestaurantDetailPage = lazy(() => import('./components/restaurants/RestaurantDetailPage'));
const CafeDetailPage = lazy(() => import('./components/cafes/CafeDetailPage'));
const EventDetailPage = lazy(() => import('./components/events/EventDetailPage'));
const AddRestaurantPage = lazy(() => import('./components/restaurants/AddRestaurantPage'));
const AddCafePage = lazy(() => import('./components/cafes/AddCafePage'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh'
    }}
  >
    <CircularProgress size={60} sx={{ color: 'primary.main' }} />
  </Box>
);

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <BaseLayout>
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </BaseLayout>
      </AuthProvider>
    </CustomThemeProvider>
  )
}

export default App
