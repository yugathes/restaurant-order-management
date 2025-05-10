
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useMenu } from '@/context/MenuContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const MenuManagement = () => {
  const { menuItems, categories } = useMenu();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Menu Management</h2>
        
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
                      <div className="font-medium text-lg">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default MenuManagement;
