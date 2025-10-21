import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, CheckSquare, ArrowRight, RotateCw } from "lucide-react";
import { toast } from "sonner";

const Tasks = () => {
  const { tasks, addTask, updateTask, users } = useStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: [] as string[],
    status: "main" as "main" | "reassigned" | "reuse",
    dueDate: "",
  });

  const mainTasks = tasks.filter(t => t.status === "main");
  const reassignedTasks = tasks.filter(t => t.status === "reassigned");
  const reuseTasks = tasks.filter(t => t.status === "reuse");

  const handleSubmit = () => {
    if (!formData.title || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    addTask({
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      status: formData.status,
      dueDate: formData.dueDate,
    });

    toast.success("Task added successfully!");
    setIsAddingTask(false);
    setFormData({
      title: "",
      description: "",
      assignedTo: [],
      status: "main",
      dueDate: "",
    });
  };

  const moveTask = (taskId: string, newStatus: "main" | "reassigned" | "reuse") => {
    updateTask(taskId, { status: newStatus });
    toast.success(`Task moved to ${newStatus} category!`);
  };

  const TaskCard = ({ task }: { task: typeof tasks[0] }) => {
    const assignedUsers = users.filter(u => task.assignedTo.includes(u.id));
    
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {assignedUsers.map(user => (
                <Badge key={user.id} variant="secondary">
                  {user.name}
                </Badge>
              ))}
              {assignedUsers.length === 0 && (
                <Badge variant="outline">Unassigned</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              
              <div className="flex gap-2">
                {task.status === "main" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveTask(task.id, "reassigned")}
                  >
                    <ArrowRight className="w-4 h-4 mr-1" />
                    Reassign
                  </Button>
                )}
                {task.status === "reassigned" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveTask(task.id, "reuse")}
                  >
                    <RotateCw className="w-4 h-4 mr-1" />
                    To Reuse
                  </Button>
                )}
                {task.status === "reuse" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveTask(task.id, "main")}
                  >
                    <ArrowRight className="w-4 h-4 mr-1" />
                    Reactivate
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
          <p className="text-muted-foreground mt-1">Organize and track tasks through workflow stages</p>
        </div>
        <Button onClick={() => setIsAddingTask(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Main Tasks
              <Badge>{mainTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mainTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No main tasks</p>
            ) : (
              mainTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-accent" />
              Reassigned Tasks
              <Badge variant="secondary">{reassignedTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reassignedTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reassigned tasks</p>
            ) : (
              reassignedTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-secondary-foreground" />
              Reuse Tasks
              <Badge variant="outline">{reuseTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reuseTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reuse tasks</p>
            ) : (
              reuseTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a new task and assign it to team members</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Category</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "main" | "reassigned" | "reuse" })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Task</SelectItem>
                  <SelectItem value="reassigned">Reassigned Task</SelectItem>
                  <SelectItem value="reuse">Reuse Task</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Add Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
