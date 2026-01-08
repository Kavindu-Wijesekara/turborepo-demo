
'use client'

import { useActionState } from 'react'
import { login, signInWithGoogle } from "../auth/actions";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-87.5">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Choose your preferred login method.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email OTP</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form action={formAction}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder="name@example.com" required />
                  </div>
                  {state?.message && (
                    <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                      {state.message}
                    </p>
                  )}
                  <Button type="submit" className="w-full">Send Login Link</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="google" className="flex flex-col gap-4">
               <p className="text-sm text-muted-foreground text-center mb-2">
                  Sign in with your Google account.
               </p>
               <form action={signInWithGoogle}>
                 <Button variant="outline" className="w-full" type="submit">
                   Sign in with Google
                 </Button>
               </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
