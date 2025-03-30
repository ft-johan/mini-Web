'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Supabase Client Setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// User Interface
interface User {
  id: string;
  name: string;
  email: string;
  collegeid: string;
  bio?: string;
  profile_pic_path?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    collegeid: '',
    bio: '',
    profile_pic_path: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch Users from Supabase
  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) console.error('Fetch Error:', error);
    else setUsers(data as User[]);
  }

  // Add a New User
  async function addUser() {
    const { error } = await supabase.from('users').insert([newUser]);
    if (error) console.error('Add User Error:', error);
    else {
      fetchUsers(); // Refresh list after adding
      setNewUser({ name: '', email: '', collegeid: '', bio: '', profile_pic_path: '' });
    }
  }

  // Update a User
  async function updateUser(id: string, updatedData: Partial<User>) {
    const { error } = await supabase.from('users').update(updatedData).eq('id', id);
    if (error) console.error('Update Error:', error);
    else fetchUsers(); // Refresh list after updating
  }

  // Delete a User
  async function deleteUser(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error('Delete Error:', error);
    else fetchUsers(); // Refresh list after deleting
  }

  return (
    <div className="bg-black text-amber-50 p-4 rounded-lg">
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      {/* Add User Form */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="College ID"
          value={newUser.collegeid}
          onChange={(e) => setNewUser({ ...newUser, collegeid: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Bio"
          value={newUser.bio}
          onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Profile Picture URL"
          value={newUser.profile_pic_path}
          onChange={(e) => setNewUser({ ...newUser, profile_pic_path: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white"
        />
        <button onClick={addUser} className="bg-green-500 p-2 rounded text-white hover:bg-green-600">
          Add User
        </button>
      </div>

      {/* Users Table */}
      <table className="w-full border-collapse border border-gray-500 text-white">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-600 p-2">ID</th>
            <th className="border border-gray-600 p-2">Name</th>
            <th className="border border-gray-600 p-2">Email</th>
            <th className="border border-gray-600 p-2">College ID</th>
            <th className="border border-gray-600 p-2">Bio</th>
            <th className="border border-gray-600 p-2">Profile Picture</th>
            <th className="border border-gray-600 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-gray-900">
              <td className="border border-gray-600 p-2">{user.id}</td>
              <td className="border border-gray-600 p-2">{user.name}</td>
              <td className="border border-gray-600 p-2">{user.email}</td>
              <td className="border border-gray-600 p-2">{user.collegeid}</td>
              <td className="border border-gray-600 p-2">{user.bio || 'N/A'}</td>
              <td className="border border-gray-600 p-2">
                {user.profile_pic_path ? (
                  <Image
                    src={user.profile_pic_path}
                    alt={user.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td className="border border-gray-600 p-2 flex gap-2">
                <button
                  onClick={() => updateUser(user.id, { name: 'Updated Name' })}
                  className="bg-blue-500 px-2 py-1 rounded text-white hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
