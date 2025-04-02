'use client'
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  organizer: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<{
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  organizer: string;}[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Event>({ id: "", title: "", date: "", location: "", description: "", organizer: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (!error) setEvents(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingEvent) {
      await supabase.from("events").update(formData).eq("id", editingEvent.id);
    } else {
      await supabase.from("events").insert([formData]);
    }
    setOpenModal(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData(event);
    setOpenModal(true);
  };


  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("notice").delete().eq("id", id);

    if (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    } else {
      setEvents((prev) => prev.filter((item) => item.id !== id));
    }
  };
  return (
    <div className="bg-neutral-950 text-amber-50 p-6 w-full rounded-l-2xl  m-1">
        <h1 className="text-4xl text-white my-8 font-bold">Events</h1>
      <Button onClick={() => setOpenModal(true)}>Add Event</Button>
      <div  className="mt-4 p-4 border rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow >
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{event.organizer}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(event)}>Edit</Button>
                <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <Input name="name" placeholder="Event Name" value={formData.title} onChange={handleInputChange} required/>
          <Input name="date" type="date" value={formData.date} onChange={handleInputChange} />
          <Input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
          <Input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
          <Input name="organizer" placeholder="Organizer" value={formData.organizer} onChange={handleInputChange} />
          <Button onClick={handleSubmit}>{editingEvent ? "Update" : "Create"} Event</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
