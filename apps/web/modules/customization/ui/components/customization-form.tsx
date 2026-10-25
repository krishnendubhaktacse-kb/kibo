import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "convex/react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { VapiFormFields } from "./vapi-form-fields";
import { FormSchema } from "../../types";
import { widgetSettingsSchema } from "../../schemas";

type WidgetSettings = Doc<"widgetSettings">;
 
interface CustomizationFormProps {
   initialData?: WidgetSettings | null;
   hasVapiPlugin: boolean
};

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
    const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);
    const saveAllManualPhoneNumbers = useMutation(
  api.private.manualPhoneNumbers.saveAll,
);

const savedContacts = useQuery(api.private.manualPhoneNumbers.getAll);

type ContactRow = {
  name: string;
  phoneNumber: string;
};

const [contacts, setContacts] = useState<ContactRow[]>([
  { name: "", phoneNumber: "" },
]);

useEffect(() => {
  if (savedContacts === undefined) return;

  setContacts(
    savedContacts.length > 0
      ? savedContacts.map((contact) => ({
          name: contact.name,
          phoneNumber: contact.phoneNumber,
        }))
      : [{ name: "", phoneNumber: "" }],
  );
}, [savedContacts]);

    const form = useForm<FormSchema>({
        resolver: zodResolver(widgetSettingsSchema),
        defaultValues: {
        greetMessage:
            initialData?.greetMessage || "Hi! How can I help you today?",
        defaultSuggestions: {
            suggestion1: initialData?.defaultSuggestions.suggestion1 || "",
            suggestion2: initialData?.defaultSuggestions.suggestion2 || "",
            suggestion3: initialData?.defaultSuggestions.suggestion3 || "",
        },
        vapiSettings: {
            assistantId: initialData?.vapiSettings.assistantId || "",
            phoneNumber: initialData?.vapiSettings.phoneNumber || "",
        },
        },
    });

    const onSubmit = async (values: FormSchema) => {
  if (savedContacts === undefined) {
    toast.error("Please wait for contact numbers to load");
    return;
  }

  const filledContacts = contacts.filter(
    (contact) =>
      contact.name.trim() || contact.phoneNumber.trim(),
  );

  if (
    filledContacts.some(
      (contact) =>
        !contact.name.trim() || !contact.phoneNumber.trim(),
    )
  ) {
    toast.error("Enter both a contact name and phone number for each row");
    return;
  }

  try {
    const vapiSettings: WidgetSettings["vapiSettings"] = {
      assistantId:
        values.vapiSettings.assistantId === "none"
          ? ""
          : values.vapiSettings.assistantId,
      phoneNumber:
        values.vapiSettings.phoneNumber === "none"
          ? ""
          : values.vapiSettings.phoneNumber,
    };

    await upsertWidgetSettings({
      greetMessage: values.greetMessage,
      defaultSuggestions: values.defaultSuggestions,
      vapiSettings,
    });

    await saveAllManualPhoneNumbers({
      contacts: filledContacts.map((contact) => ({
        name: contact.name.trim(),
        phoneNumber: contact.phoneNumber.trim(),
      })),
    });

    toast.success("Widget settings saved");
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong while saving settings");
  }
};

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>
              Configure basic chat widget behavior and messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
            control={form.control}
            name="greetMessage"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Greeting Message</FormLabel>
                <FormControl>
                    <Textarea 
                        {...field}
                        placeholder="Welcome message shown when chat open"
                        rows={3}
                    />
                </FormControl>
                <FormDescription>
                    The first message customers see when they open the chat
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <Separator />

                <div className="space-y-4">
                    <div>
                    <h3 className="mb-4 text-sm">
                        Default Suggestions
                    </h3>
                    <p className="mb-4 text-muted-foreground text-sm">
                        Quick reply suggestions shown to customers to help guide the conversation
                    </p>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="defaultSuggestions.suggestion1"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Suggestion 1</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder="e.g., How do I get started?"
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="defaultSuggestions.suggestion2"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Suggestion 2</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder="e.g., What are yours pricing plans?"
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="defaultSuggestions.suggestion3"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Suggestion 3</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder="e.g., I need help with my account"
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            
                    </div>
                    </div>
                </div>

        </CardContent>
        </Card>
        {hasVapiPlugin && (
            <Card>
                <CardHeader>
                <CardTitle>Voice Assistant Settings</CardTitle>
                <CardDescription>
                    Configure voice calling features powered by Vapi
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <VapiFormFields form={form}/>
                </CardContent>
            </Card>
            )}

            <Card>
            <CardHeader>
                <CardTitle>Contact Numbers</CardTitle>
                <CardDescription>
                Add and manage multiple contact numbers displayed in your widget.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {contacts.map((contact, index) => (
                <div key={index} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                    <FormLabel>Contact {index + 1}</FormLabel>

                    {contacts.length > 1 && (
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove contact ${index + 1}`}
                        disabled={form.formState.isSubmitting}
                        onClick={() =>
                            setContacts((current) =>
                            current.filter((_, i) => i !== index),
                            )
                        }
                        >
                        <Trash2 className="size-4" />
                        </Button>
                    )}
                    </div>

                    <Input
                    value={contact.name}
                    placeholder="Contact name, e.g. Customer Support"
                    disabled={form.formState.isSubmitting}
                    onChange={(event) =>
                        setContacts((current) =>
                        current.map((item, i) =>
                            i === index
                            ? { ...item, name: event.target.value }
                            : item,
                        ),
                        )
                    }
                    />
                  <div className="flex items-center gap-3">
                    <PhoneInput
                      defaultCountry="IN"
                      international
                      countryCallingCodeEditable={false}
                      value={contact.phoneNumber || undefined}
                      onChange={(value) =>
                        setContacts((current) =>
                          current.map((item, i) =>
                            i === index
                              ? { ...item, phoneNumber: value || "" }
                              : item,
                          ),
                        )
                      }
                      disabled={form.formState.isSubmitting}
                      className="phone-input flex-1"
                      placeholder="Enter phone number"
                    />
                  </div>

                </div>
                ))}

                <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Add contact number"
                disabled={form.formState.isSubmitting}
                onClick={() =>
                    setContacts((current) => [
                    ...current,
                    { name: "", phoneNumber: "" },
                    ])
                }
                >
                <Plus className="size-4" />
                </Button>
            </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button disabled={form.formState.isSubmitting} type="submit">    
                    Save Settings
                </Button>
            </div>
      </form>
    </Form>
  );
};