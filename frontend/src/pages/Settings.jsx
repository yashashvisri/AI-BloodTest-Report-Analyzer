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

function ProfileForm({ user }) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  
  async function handleSave(e) {
    e.preventDefault();
    try {
      await api.put('/users/me', { name, email });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  }
  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-md">
      <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Profile Details</h3>
      <div><label className="block text-gray-600 mb-1 font-semibold">Username</label><input disabled value={user.username || ''} className="w-full border p-2 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"/></div>
      <div><label className="block text-gray-600 mb-1 font-semibold">Full Name</label><input required value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded-lg focus:outline-emerald-500"/></div>
      <div><label className="block text-gray-600 mb-1 font-semibold">Email Address</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded-lg focus:outline-emerald-500"/></div>
      <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition mt-4">Save Changes</button>
    </form>
  );
}
function SecurityForm() {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  
  async function handleSave(e) {
    e.preventDefault();
    try {
      await api.put('/users/me/password', { current_password: current, new_password: newPw });
      toast.success('Password changed successfully!');
      setCurrent(''); setNewPw('');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update password');
    }
  }
  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-md">
      <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Security</h3>
      <div><label className="block text-gray-600 mb-1 font-semibold">Current Password</label><input required type="password" value={current} onChange={e=>setCurrent(e.target.value)} className="w-full border p-2 rounded-lg focus:outline-emerald-500"/></div>
      <div><label className="block text-gray-600 mb-1 font-semibold">New Password</label><input required type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} className="w-full border p-2 rounded-lg focus:outline-emerald-500"/></div>
      <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition mt-4">Change Password</button>
    </form>
  );
}