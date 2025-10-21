import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

const AddUsers = () => {
  const addUser = useStore((state) => state.addUser);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone1: "",
    phone2: "",
    location: "",
    userType: "" as "employee" | "driver" | "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.phone1 || !formData.location || !formData.userType) {
      toast.error("Please fill in all required fields");
      return;
    }

    addUser({
      name: formData.name,
      age: parseInt(formData.age),
      phone1: formData.phone1,
      phone2: formData.phone2,
      location: formData.location,
      userType: formData.userType as "employee" | "driver",
    });

    toast.success(`${formData.userType === "employee" ? "Employee" : "Driver"} added successfully!`);
    
    // Reset form
    setFormData({
      name: "",
      age: "",
      phone1: "",
      phone2: "",
      location: "",
      userType: "",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add Users</h1>
        <p className="text-muted-foreground mt-1">Add new employees or drivers to the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            User Information
          </CardTitle>
          <CardDescription>Enter the details of the new user</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min="18"
                max="100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone1">Phone Number 1 *</Label>
                <Input
                  id="phone1"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone1}
                  onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone2">Phone Number 2</Label>
                <Input
                  id="phone2"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone2}
                  onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">User Type *</Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => setFormData({ ...formData, userType: value as "employee" | "driver" })}
              >
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUsers;
