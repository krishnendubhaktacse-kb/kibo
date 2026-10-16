import { UseFormReturn } from "react-hook-form";
import { useVapiAssistants, useVapiPhoneNumbers } from "@/modules/plugins/hooks/use-vapi-data";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FormSchema } from "../../types";

interface VapiFormFieldsProps {
  form: UseFormReturn<FormSchema>;
};

export const VapiFormFields = ({
  form,
}: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants();
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } = useVapiPhoneNumbers();
  const disabled = form.formState.isSubmitting;

  return (
    <>
        <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Voice Assistant</FormLabel>
                <Select 
                    disabled={assistantsLoading || disabled}
                    onValueChange={field.onChange}
                    value={field.value}
                >
                    <FormControl>
                        <SelectTrigger className="w-fit min-w-0">
                            <SelectValue>
                                {assistants.find(
                                    (assistant) => assistant.id === field.value
                                )?.name || (
                                    assistantsLoading
                                    ? "Loading assistants..."
                                    : "Select an assistant"
                                )}
                                </SelectValue>
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-max min-w-[var(--radix-select-trigger-width)]">
                        <SelectItem value="none">None</SelectItem>
                        {assistants.map((assistant)=>(
                            <SelectItem key={assistant.id} value={assistant.id}>
                                {assistant.name || "Unnamed Assistant"} -{" "}
                                {assistant.model?.model || "Unknown model"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormDescription>
                    The Vapi assistant to use for voice  calls
                </FormDescription>
                <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Display Phone Number</FormLabel>
                <Select 
                    disabled={phoneNumbersLoading || disabled}
                    onValueChange={field.onChange}
                    value={field.value}
                >
                    <FormControl>
                        <SelectTrigger className="w-fit min-w-0">
                            <SelectValue 
                                placeholder={
                                    assistantsLoading
                                    ? "Loading phone numbers..."
                                    : "Select a phone number"
                                }
                            />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-max min-w-[var(--radix-select-trigger-width)]">
                        <SelectItem value="none">None</SelectItem>
                        {phoneNumbers.map((phone)=>(
                            <SelectItem key={phone.id} value={phone.number || phone.id}>
                                {phone.number || "Unknown"} -{""}
                                {phone.name || "Unnamed"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormDescription>
                    Phone number to display in the widget
                </FormDescription>
                <FormMessage />
            </FormItem>
        )}
        />
    </>
  )
};