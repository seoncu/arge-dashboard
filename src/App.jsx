import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import ArGeDashboard from "./Dashboard";

function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <ArGeDashboard
      role={user.role}
      user={user}
      onLogout={logout}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
