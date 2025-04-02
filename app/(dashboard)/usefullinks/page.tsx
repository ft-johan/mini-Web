'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UsefulLink {
  id: string;
  name: string;
  link: string;
}

export default function UsefulLinks() {
  const [links, setLinks] = useState<UsefulLink[]>([]);
  const [newLink, setNewLink] = useState({ name: '', link: '' });
  const [editLink, setEditLink] = useState<UsefulLink | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    const { data, error } = await supabase.from('useful_links').select('*');
    if (error) console.error(error);
    else setLinks(data as UsefulLink[]);
  }

  async function addLink() {
    if (!newLink.name || !newLink.link) {
      alert("Please fill in all fields!");
      return;
    }

    const { error } = await supabase.from('useful_links').insert([newLink]);
    if (error) console.error(error);
    else {
      fetchLinks(); // Refresh after adding
      setNewLink({ name: '', link: '' });
      setIsAddModalOpen(false); // Close the modal
    }
  }

  async function updateLink() {
    if (!editLink) return;
    
    const { error } = await supabase.from('useful_links').update({
      name: editLink.name,
      link: editLink.link,
    }).eq('id', editLink.id);

    if (error) console.error(error);
    else {
      fetchLinks(); // Refresh after updating
      setIsEditModalOpen(false);
      setEditLink(null);
    }
  }

  async function deleteLink(id: string) {
    const { error } = await supabase.from('useful_links').delete().eq('id', id);
    if (error) console.error(error);
    else fetchLinks(); // Refresh after deleting
  }

  return (
    <div className="bg-neutral-950 text-amber-50 p-6 w-full rounded-l-2xl m-1">
      <h1 className="text-4xl text-white my-8 font-bold">Useful Links</h1>

      {/* Add Link Button */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <button className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700">Add New Link</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Useful Link</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newLink.name}
              onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Link"
              value={newLink.link}
              onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
              className="border rounded p-2"
            />
            <button className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700" onClick={addLink}>
              Add Link
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Useful Links Table */}
      <div className="mt-4 p-4 border rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>{link.name}</TableCell>
                <TableCell>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {link.link}
                  </a>
                </TableCell>
                <TableCell className="flex gap-2">
                  {/* Edit Button */}
                  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogTrigger asChild>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => setEditLink(link)}
                      >
                        Edit
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Useful Link</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={editLink?.name || ''}
                          onChange={(e) => setEditLink((prev) => prev ? { ...prev, name: e.target.value } : null)}
                          className="border rounded p-2"
                        />
                        <input
                          type="text"
                          placeholder="Link"
                          value={editLink?.link || ''}
                          onChange={(e) => setEditLink((prev) => prev ? { ...prev, link: e.target.value } : null)}
                          className="border rounded p-2"
                        />
                        <button className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700" onClick={updateLink}>
                          Update Link
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Button */}
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => deleteLink(link.id)}>
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
