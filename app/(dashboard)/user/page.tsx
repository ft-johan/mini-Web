'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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


  // Update a User

  // Delete a User
  async function deleteUser(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error('Delete Error:', error);
    else fetchUsers(); // Refresh list after deleting
  }

  return (
    <div className="bg-neutral-950 text-amber-50 p-6 w-full rounded-l-2xl  m-1">
      <h1 className="text-4xl font-bold my-8">User Management</h1>


      {/* Users Table */}
     <div className='rounded-md p-4 border-2'>
   
      <Table>
      <TableCaption>A list of your recent Users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>College Id</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.name}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.collegeid}</TableCell>
            <TableCell className="text-right"><button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                >
                  Delete
                </button></TableCell>
          </TableRow>
        ))}
      </TableBody>
      
    </Table>
    </div>
    </div>
  );
}
