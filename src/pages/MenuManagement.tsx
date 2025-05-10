
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useMenu } from '@/context/MenuContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MenuManagement = () => {
  const { menu } = useMenu();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Menu Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map(category => (
            <Card key={category.id} className="shadow-sm">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="font-medium">${item.price.toFixed(2)}</div>
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
