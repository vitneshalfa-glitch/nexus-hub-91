import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Task, TaskAssignment } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

const Drivers = () => {
  const [drivers, setDrivers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [editingDriver, setEditingDriver] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone1: "",
    phone2: "",
    location: "",
  });

  useEffect(() => {
    fetchDrivers();
    fetchTasks();
  }, []);

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_type", "driver")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load drivers");
      return;
    }

    setDrivers(data || []);
  };

  const fetchTasks = async () => {
    const { data: tasksData } = await supabase.from("tasks").select("*");
    const { data: assignmentsData } = await supabase.from("task_assignments").select("*");
    
    setTasks(tasksData || []);
    setTaskAssignments(assignmentsData || []);
  };

  const getDriverTasks = (userId: string) => {
    const userTaskIds = taskAssignments
      .filter(ta => ta.user_id === userId)
      .map(ta => ta.task_id);
    return tasks.filter(t => userTaskIds.includes(t.id));
  };

  const handleEdit = (driver: User) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      age: driver.age.toString(),
      phone1: driver.phone1,
      phone2: driver.phone2 || "",
      location: driver.location,
    });
  };

  const handleUpdate = async () => {
    if (!editingDriver) return;

    const { error } = await supabase
      .from("users")
      .update({
        name: formData.name,
        age: parseInt(formData.age),
        phone1: formData.phone1,
        phone2: formData.phone2 || null,
        location: formData.location,
      })
      .eq("id", editingDriver.id);

    if (error) {
      toast.error("Failed to update driver");
      return;
    }

    toast.success("Driver updated successfully!");
    setEditingDriver(null);
    fetchDrivers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete driver");
      return;
    }

    toast.success("Driver deleted successfully!");
    fetchDrivers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drivers</h1>
          <p className="text-muted-foreground mt-1">Manage your driver records</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Truck className="w-4 h-4 mr-2" />
          {drivers.length} Drivers
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Phone 1</TableHead>
                  <TableHead>Phone 2</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned Tasks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No drivers found
                    </TableCell>
                  </TableRow>
                ) : (
                  drivers.map((driver) => {
                    const driverTasks = getDriverTasks(driver.id);
                    return (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.age}</TableCell>
                        <TableCell>{driver.phone1}</TableCell>
                        <TableCell>{driver.phone2 || "-"}</TableCell>
                        <TableCell>{driver.location}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {driverTasks.length === 0 ? (
                              <Badge variant="outline">No tasks</Badge>
                            ) : (
                              driverTasks.map((task) => (
                                <Badge key={task.id} variant="secondary" className="text-xs">
                                  {task.title}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(driver)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(driver.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingDriver} onOpenChange={() => setEditingDriver(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-age">Age *</Label>
              <Input
                id="edit-age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone1">Phone Number 1 *</Label>
              <Input
                id="edit-phone1"
                type="tel"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone2">Phone Number 2</Label>
              <Input
                id="edit-phone2"
                type="tel"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <Button onClick={handleUpdate} className="w-full">
              Update Driver
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Drivers;
