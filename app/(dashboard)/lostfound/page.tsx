'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LostItem {
  id: string;
  title: string;
  description: string;
  image_path: string;
}

export default function LostAndFound() {
  const [items, setItems] = useState<LostItem[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase.from('lostandfound').select('*');
    if (error) console.error('Fetch Error:', error);
    else setItems(data as LostItem[]);
  }

  async function deleteItem(id: string) {
    const { error } = await supabase.from('lostandfound').delete().eq('id', id);
    if (error) console.error('Delete Error:', error);
    else setItems(items.filter(item => item.id !== id));
  }

 

  return (
    <div className="p-6 w-full">
      <h1 className="text-4xl font-bold mb-6">Lost & Found</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="shadow-md rounded-lg overflow-hidden">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src="https://lkkesknegtnajxfftnqf.supabase.co/storage/v1/object/public/lostandfound/3c8e0247-995f-4ea5-9967-6c67ed59251b/f8f3af2c-f8c2-430f-a694-6ac8a838c378.jpg"
                alt={item.title}
                width={300}
                height={200}
                className="rounded-md w-full object-cover"
              />
              <p className="mt-2 text-gray-600">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="destructive" onClick={() => deleteItem(item.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}