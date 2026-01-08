'use client'

import { createPost } from '../actions'
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card"

export default function NewPostPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPost} className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="My awesome post" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="content">Content</Label>
              <Input id="content" name="content" required placeholder="What's on your mind?" />
            </div>
            <Button type="submit">Create Post</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
