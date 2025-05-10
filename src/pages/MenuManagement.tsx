
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useMenu } from '@/context/MenuContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  category: z.string().min(1, { message: "Category is required" }),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MenuManagement = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  // Form for adding/editing menu items
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: categories[0] || "",
      imageUrl: "/placeholder.svg"
    },
  });

  // Handle add dialog
  const openAddDialog = () => {
    form.reset({
      name: "",
      description: "",
      price: 0,
      category: categories[0] || "",
      imageUrl: "/placeholder.svg"
    });
    setIsAddDialogOpen(true);
  };

  // Handle edit dialog
  const openEditDialog = (id: string) => {
    const item = menuItems.find(item => item.id === id);
    if (item) {
      form.reset({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl || "/placeholder.svg"
      });
      setCurrentItem(id);
      setIsEditDialogOpen(true);
    }
  };

  // Handle delete dialog
  const openDeleteDialog = (id: string) => {
    setCurrentItem(id);
    setIsDeleteDialogOpen(true);
  };

  // Submit handler for add form
  const onSubmitAdd = (data: FormValues) => {
    const finalCategory = showNewCategoryInput && newCategory ? newCategory : data.category;
    addMenuItem({
      name: data.name,
      description: data.description,
      price: data.price,
      category: finalCategory,
      imageUrl: data.imageUrl
    });
    setIsAddDialogOpen(false);
    setShowNewCategoryInput(false);
    setNewCategory("");
  };

  // Submit handler for edit form
  const onSubmitEdit = (data: FormValues) => {
    if (currentItem) {
      const finalCategory = showNewCategoryInput && newCategory ? newCategory : data.category;
      updateMenuItem(currentItem, {
        name: data.name,
        description: data.description,
        price: data.price,
        category: finalCategory,
        imageUrl: data.imageUrl
      });
      setIsEditDialogOpen(false);
      setCurrentItem(null);
      setShowNewCategoryInput(false);
      setNewCategory("");
    }
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (currentItem) {
      deleteMenuItem(currentItem);
      setIsDeleteDialogOpen(false);
      setCurrentItem(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Menu Management</h2>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2" /> Add Item
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map(category => (
            <Card key={category} className="shadow-sm">
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                          <AspectRatio ratio={1/1} className="bg-muted">
                            {item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </AspectRatio>
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-lg mr-4">${item.price.toFixed(2)}</div>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(item.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Menu Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Item description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Category</FormLabel>
                {!showNewCategoryInput ? (
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                            >
                              {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewCategoryInput(true)}
                    >
                      New Category
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        setNewCategory("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Item description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Category</FormLabel>
                {!showNewCategoryInput ? (
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                            >
                              {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewCategoryInput(true)}
                    >
                      New Category
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        setNewCategory("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Update Item</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default MenuManagement;
