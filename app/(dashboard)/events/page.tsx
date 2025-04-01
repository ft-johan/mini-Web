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

// Define the Event interface based on the Supabase schema
interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description?: string;
  organizer?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Event>({ id: 0, name: "", date: "", location: "", description: "", organizer: "" });

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

  const handleDelete = async (id: number) => {
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  return (
    <div className="p-6">
      <Button onClick={() => setOpenModal(true)}>Add Event</Button>
      <Table className="mt-4 w-full">
        <TableHeader>
          <TableRow>
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
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{event.organizer}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => handleEdit(event)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(event.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <Input name="name" placeholder="Event Name" value={formData.name} onChange={handleInputChange} />
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
