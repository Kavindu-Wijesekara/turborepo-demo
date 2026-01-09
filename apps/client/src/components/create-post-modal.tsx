"use client";

import { Button } from "@acme/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/components/dialog";
import { Input } from "@acme/ui/components/input";
import { Label } from "@acme/ui/components/label";
import { Textarea } from "@acme/ui/components/textarea";
import { useActionState, useEffect, useState } from "react";

import { createPost } from "@/app/(dashboard)/dashboard/actions";

export function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createPost, null);

  // Close modal on successful submission
  useEffect(() => {
    if (state?.success) {
      const id = window.setTimeout(() => setOpen(false), 0);
      return () => window.clearTimeout(id);
    }
  }, [state?.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Write a new post to share with your team.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Enter post title" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your post content..."
                rows={5}
                required
              />
            </div>
            {state?.message && !state.success && (
              <p className="text-sm text-red-600">{state.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
