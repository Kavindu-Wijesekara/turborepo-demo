"use client";

import { useActionState, useState, useEffect } from "react";
import { completeProfile, getServices } from "./actions";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@repo/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

type Service = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
};

export default function CompleteProfilePage() {
  const [step, setStep] = useState(1);
  const [orgMode, setOrgMode] = useState<"create" | "join">("create");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orgName: "",
    inviteCode: "",
  });
  const [state, formAction] = useActionState(completeProfile, null);

  useEffect(() => {
    async function loadServices() {
      const data = await getServices();
      setServices(data);
    }
    loadServices();
  }, []);

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const canProceedStep1 = formData.name.trim() && formData.phone.trim();
  const canProceedStep2 =
    orgMode === "create" ? formData.orgName.trim() : formData.inviteCode.trim();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Step {step} of 3</CardTitle>
            <CardDescription>
              {step === 1 && "Personal Information"}
              {step === 2 && "Organization Setup"}
              {step === 3 && "Select Services"}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${s <= step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          {/* Hidden fields to pass all data */}
          <input type="hidden" name="name" value={formData.name} />
          <input type="hidden" name="phone" value={formData.phone} />
          <input type="hidden" name="orgMode" value={orgMode} />
          <input type="hidden" name="orgName" value={formData.orgName} />
          <input type="hidden" name="inviteCode" value={formData.inviteCode} />
          {selectedServices.map((id) => (
            <input key={id} type="hidden" name="services" value={id} />
          ))}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Organization */}
          {step === 2 && (
            <div className="space-y-4">
              <Tabs
                value={orgMode}
                onValueChange={(v) => setOrgMode(v as "create" | "join")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create Organization</TabsTrigger>
                  <TabsTrigger value="join">Join with Invite</TabsTrigger>
                </TabsList>
                <TabsContent value="create" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input
                        id="orgName"
                        value={formData.orgName}
                        onChange={(e) =>
                          setFormData({ ...formData, orgName: e.target.value })
                        }
                        placeholder="Acme Inc."
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You will be the owner of this organization and can invite
                      team members later.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="join" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="inviteCode">Invite Code</Label>
                      <Input
                        id="inviteCode"
                        value={formData.inviteCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inviteCode: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="XXXX-XXXX"
                        className="font-mono"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the invite code you received from your organization.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 3: Services Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select the services you&apos;re interested in (optional)
              </p>
              <div className="grid gap-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceToggle(service.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedServices.includes(service.id)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                      <div className="text-right">
                        {service.price && (
                          <span className="text-sm font-medium">
                            ${(service.price / 100).toFixed(2)}/mo
                          </span>
                        )}
                        <div
                          className={`mt-1 w-5 h-5 rounded border ${
                            selectedServices.includes(service.id)
                              ? "bg-primary border-primary"
                              : "border-gray-300"
                          } flex items-center justify-center ml-auto`}
                        >
                          {selectedServices.includes(service.id) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Loading services...
                  </p>
                )}
              </div>
            </div>
          )}

          {state?.message && !state.success && (
            <p className="text-sm text-red-600 mt-4">{state.message}</p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
          >
            Continue
          </Button>
        ) : (
          <form action={formAction}>
            <input type="hidden" name="name" value={formData.name} />
            <input type="hidden" name="phone" value={formData.phone} />
            <input type="hidden" name="orgMode" value={orgMode} />
            <input type="hidden" name="orgName" value={formData.orgName} />
            <input
              type="hidden"
              name="inviteCode"
              value={formData.inviteCode}
            />
            {selectedServices.map((id) => (
              <input key={id} type="hidden" name="services" value={id} />
            ))}
            <Button type="submit">Complete Setup</Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}
