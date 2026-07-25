import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import InboxPage from '../pages/InboxPage'
import InquiryDetailPage from '../pages/InquiryDetailPage'
import SettingsPage from '../pages/SettingsPage'
import ActivityLogPage from '../pages/ActivityLogPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/inquiries/:id" element={<InquiryDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/activity-log" element={<ActivityLogPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/inbox" replace />} />
    </Routes>
  )
}

export default AppRoutes
