import { UseFormReturn } from "react-hook-form";
import { useVapiAssistants } from "@/modules/plugins/hooks/use-vapi-data";
import { Input } from "@workspace/ui/components/input";
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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface VapiFormFieldsProps {
  form: UseFormReturn<FormSchema>;
};

export const VapiFormFields = ({
  form,
}: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants();
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
    </>
  )
};