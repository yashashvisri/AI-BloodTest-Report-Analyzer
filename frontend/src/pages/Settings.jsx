import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    api.get('/users/me').then(res => setUser(res.data)).catch(() => toast.error('Failed to load profile'));
  }, []);

  if (!user) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow overflow-hidden flex min-h-[500px]">
        <div className="w-1/4 bg-slate-50 p-6 border-r">
          <h2 className="font-bold text-xl mb-6 text-gray-800">Settings</h2>
          <nav className="flex flex-col gap-2">
            <button onClick={() => setActiveTab('profile')} className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === 'profile' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}>Profile</button>
            <button onClick={() => setActiveTab('security')} className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === 'security' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}>Security</button>
            <button onClick={() => setActiveTab('account')} className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === 'account' ? 'bg-rose-100 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}>Account</button>
          </nav>
        </div>
        <div className="w-3/4 p-8">
          {activeTab === 'profile' && <ProfileForm user={user} />}
          {activeTab === 'security' && <SecurityForm />}
          {activeTab === 'account' && <AccountForm />}
        </div>
      </div>
    </div>
  );
}
