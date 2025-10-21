import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Employees = () => {
  const { users, updateUser, deleteUser, tasks } = useStore();
  const employees = users.filter(u => u.userType === "employee");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone1: "",
    phone2: "",
    location: "",
  });

  const handleEdit = (user: typeof employees[0]) => {
    setEditingUser(user.id);
    setFormData({
      name: user.name,
      age: user.age.toString(),
      phone1: user.phone1,
      phone2: user.phone2,
      location: user.location,
    });
  };

  const handleSave = () => {
    if (editingUser) {
      updateUser(editingUser, {
        name: formData.name,
        age: parseInt(formData.age),
        phone1: formData.phone1,
        phone2: formData.phone2,
        location: formData.location,
      });
      toast.success("Employee updated successfully!");
      setEditingUser(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteUser(id);
      toast.success("Employee deleted successfully!");
    }
  };

  const getUserTasks = (userId: string) => {
    return tasks.filter(task => task.assignedTo.includes(userId));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Employees</h1>
        <p className="text-muted-foreground mt-1">Manage your employee records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Employee List ({employees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No employees added yet. Add your first employee from the Add Users page.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Phone 1</TableHead>
                    <TableHead>Phone 2</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => {
                    const userTasks = getUserTasks(employee.id);
                    const attendance = employee.attendance || [];
                    const presentDays = attendance.filter(a => a.status === "present").length;
                    
                    return (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.age}</TableCell>
                        <TableCell>{employee.phone1}</TableCell>
                        <TableCell>{employee.phone2 || "-"}</TableCell>
                        <TableCell>{employee.location}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {userTasks.length} task{userTasks.length !== 1 ? "s" : ""}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {presentDays} days
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(employee)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(employee.id, employee.name)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editingUser !== null} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone1">Phone 1</Label>
              <Input
                id="edit-phone1"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone2">Phone 2</Label>
              <Input
                id="edit-phone2"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
