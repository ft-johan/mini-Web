'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    const { data, error } = await supabase.from('useful_links').select('*');
    if (error) console.error(error);
    else setLinks(data as UsefulLink[]);
  }

  async function addLink() {
    const { data, error } = await supabase.from('useful_links').insert([newLink]);
    if (error) console.error(error);
    else {
      if (data) {
        setLinks([...links, data[0] as UsefulLink]);
      }
      setNewLink({ name: '', link: '' });
    }
  }

  async function updateLink(id: string, updatedData: Partial<UsefulLink>) {
    const { error } = await supabase.from('useful_links').update(updatedData).eq('id', id);
    if (error) console.error(error);
    else setLinks(links.map(link => (link.id === id ? { ...link, ...updatedData } : link)));
  }

  async function deleteLink(id: string) {
    const { error } = await supabase.from('useful_links').delete().eq('id', id);
    if (error) console.error(error);
    else setLinks(links.filter(link => link.id !== id));
  }

  return (
    <div>
      <h1>Useful Links</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newLink.name}
          onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Link"
          value={newLink.link}
          onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
        />
        <button onClick={addLink}>Add Link</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              <td>{link.name}</td>
              <td>
                <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a>
              </td>
              <td>
                <button onClick={() => updateLink(link.id, { name: 'Updated Name' })}>Edit</button>
                <button onClick={() => deleteLink(link.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}