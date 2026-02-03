import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ClusterList from './pages/ClusterList'
import ClusterForm from './pages/ClusterForm'
import ClusterDetail from './pages/ClusterDetail'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/clusters" replace />} />
          <Route path="/clusters" element={<ClusterList />} />
          <Route path="/clusters/new" element={<ClusterForm />} />
          <Route path="/clusters/:id" element={<ClusterDetail />} />
          <Route path="/clusters/:id/edit" element={<ClusterForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
