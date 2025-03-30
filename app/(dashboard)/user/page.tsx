'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [newUser, setNewUser] = useState({ name: '', email: '', collegeid: '', bio: '', profile_pic_path: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('id, name, email, collegeid, bio, profile_pic_path');
    if (error) console.error(error);
    else setUsers(data as User[]);
  }

  async function addUser() {
    const { data, error } = await supabase.from('users').insert([newUser]);
    if (error) console.error(error);
    else {
      if (data) {
        setUsers([...users, data[0] as User]);
      }
      setNewUser({ name: '', email: '', collegeid: '', bio: '', profile_pic_path: '' });
    }
  }

  async function updateUser(id: string, updatedData: Partial<User>) {
    const { data, error } = await supabase.from('users').update(updatedData).eq('id', id);
    if (error) console.error(error);
    else setUsers(users.map(user => (user.id === id ? { ...user, ...updatedData } : user)));
  }

  async function deleteUser(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error(error);
    else setUsers(users.filter(user => user.id !== id));
  }

  return (
    <div className='bg-black text-amber-50 p-4 rounded-l-2xl '>
      <h1>User Management</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="College ID"
          value={newUser.collegeid}
          onChange={(e) => setNewUser({ ...newUser, collegeid: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bio"
          value={newUser.bio}
          onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
        />
        <input
          type="text"
          placeholder="Profile Picture URL"
          value={newUser.profile_pic_path}
          onChange={(e) => setNewUser({ ...newUser, profile_pic_path: e.target.value })}
        />
        <button onClick={addUser}>Add User</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>College ID</th>
            <th>Bio</th>
            <th>Profile Picture</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.collegeid}</td>
              <td>{user.bio}</td>
              <td>
                {user.profile_pic_path && <img src={user.profile_pic_path} alt={user.name} width="50" height="50" style={{ borderRadius: '50%' }} />}
              </td>
              <td>
                <button onClick={() => updateUser(user.id, { name: 'Updated Name' })}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
