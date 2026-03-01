'use client';
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createVoice} from "@/lib/actions/voices";
import { Voice} from "@/db/schema";
import { toast } from "sonner";


interface VoiceFormProps {
    voice?: Voice
}

const voiceFormSchema = z.object({
    voiceName: z.string().min(1, "минимум 1")
});

export function VoiceStory({ voice }: VoiceFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof voiceFormSchema>>({
        resolver: zodResolver(voiceFormSchema),
        defaultValues: {
           voiceName: voice?.voiceName,

        },
    });

    async function onSubmit(values: z.infer<typeof voiceFormSchema>) {
        setLoading(true);
        try {
            await createVoice({ ...values});
            setLoading(false);
            router.refresh();
        } catch (error) {
            toast.error("Произошла Неизвестная ошибка")
            console.error("Error submitting form:", error);
            setLoading(false);
            router.refresh();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="voiceName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название голоса</FormLabel>
                            <FormControl>
                                <Input placeholder="Название производителя" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  сделать
                </Button>
            </form>
        </Form>
    )
}