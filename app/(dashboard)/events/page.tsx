'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
  tags: string;
  is_active: boolean;
  organizers: string;
  register_url: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '', description: '', date: '', time: '', location: '',
    image_url: '', tags: '', is_active: true, organizers: '', register_url: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase.from('events').select('*');
    if (error) console.error(error);
    else setEvents(data as Event[]);
  }

  async function addEvent() {
    const { data, error } = await supabase.from('events').insert([newEvent]);
    if (error) console.error(error);
    else {
      if (data) {
        setEvents([...events, data[0] as Event]);
      }
      setNewEvent({ title: '', description: '', date: '', time: '', location: '',
        image_url: '', tags: '', is_active: true, organizers: '', register_url: '' });
      setIsModalOpen(false);
    }
  }

  async function updateEvent() {
    if (!editingEvent || !editingEvent.id) return;
    const { error } = await supabase.from('events').update(editingEvent).eq('id', editingEvent.id);
    if (error) console.error(error);
    else {
      setEvents(events.map(event => (event.id === editingEvent.id ? { ...event, ...editingEvent } : event)));
      setIsEditModalOpen(false);
      setEditingEvent(null);
    }
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) console.error(error);
    else setEvents(events.filter(event => event.id !== id));
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">College Events</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-6" onClick={() => setIsModalOpen(true)}>Add Event</button>
      
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">{isEditModalOpen ? 'Edit Event' : 'Add Event'}</h2>
            <input className="border p-2 rounded w-full mb-2" type="text" placeholder="Title" value={isEditModalOpen ? editingEvent?.title : newEvent.title}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, title: e.target.value }) : setNewEvent({ ...newEvent, title: e.target.value }))} />
            <input className="border p-2 rounded w-full mb-2" type="text" placeholder="Description" value={isEditModalOpen ? editingEvent?.description : newEvent.description}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, description: e.target.value }) : setNewEvent({ ...newEvent, description: e.target.value }))} />
            <input className="border p-2 rounded w-full mb-2" type="date" value={isEditModalOpen ? editingEvent?.date : newEvent.date}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, date: e.target.value }) : setNewEvent({ ...newEvent, date: e.target.value }))} />
            <input className="border p-2 rounded w-full mb-2" type="text" placeholder="Time" value={isEditModalOpen ? editingEvent?.time : newEvent.time}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, time: e.target.value }) : setNewEvent({ ...newEvent, time: e.target.value }))} />
            <input className="border p-2 rounded w-full mb-2" type="text" placeholder="Location" value={isEditModalOpen ? editingEvent?.location : newEvent.location}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, location: e.target.value }) : setNewEvent({ ...newEvent, location: e.target.value }))} />
            <input className="border p-2 rounded w-full mb-2" type="text" placeholder="Image URL" value={isEditModalOpen ? editingEvent?.image_url : newEvent.image_url}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, image_url: e.target.value }) : setNewEvent({ ...newEvent, image_url: e.target.value }))} />
            <input className="border p-2 rounded w-full mb-2" type="text" placeholder="Tags" value={isEditModalOpen ? editingEvent?.tags : newEvent.tags}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, tags: e.target.value }) : setNewEvent({ ...newEvent, tags: e.target.value }))} />
            <input className="border p-2 rounded w-full mb-2" type="text" placeholder="Organizers" value={isEditModalOpen ? editingEvent?.organizers : newEvent.organizers}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, organizers: e.target.value }) : setNewEvent({ ...newEvent, organizers: e.target.value }))} />
            <input className="border p-2 rounded w-full mb-2" type="text" placeholder="Registration URL" value={isEditModalOpen ? editingEvent?.register_url : newEvent.register_url}
              onChange={(e) => (isEditModalOpen ? setEditingEvent({ ...editingEvent, register_url: e.target.value }) : setNewEvent({ ...newEvent, register_url: e.target.value }))} />
            <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={isEditModalOpen ? updateEvent : addEvent}>{isEditModalOpen ? 'Update' : 'Save'}</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}>Cancel</button>
          </div>
        </div>
      )}
      {/**/ }
    </div>
  );
}
