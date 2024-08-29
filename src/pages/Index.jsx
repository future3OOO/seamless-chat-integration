import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const Index = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center space-x-4">
          <img src="/logo.svg" alt="Logo" className="w-12 h-12" />
          <div>
            <CardTitle className="text-2xl font-bold">Submit Details</CardTitle>
            <CardDescription>Please fill out the form below to submit your details.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input type="text" id="full_name" name="full_name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input type="text" id="address" name="address" placeholder="123 Main St, City, Country" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue">Issue</Label>
              <Textarea id="issue" name="issue" placeholder="Describe your issue here..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <Input type="file" id="image" name="image" accept="image/*" />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
