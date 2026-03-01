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
import { createRedditStory } from "@/lib/actions/reddit-stories";
import { Story} from "@/db/schema";
import { toast } from "sonner";


interface ManufacturerFormProps {
    story?: Story
}

const manufacturerFormSchema = z.object({
    story: z.string().min(1, "минимум 1")
});

export function RedditStory({ story }: ManufacturerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof manufacturerFormSchema>>({
        resolver: zodResolver(manufacturerFormSchema),
        defaultValues: {
           story: story?.story

        },
    });

    async function onSubmit(values: z.infer<typeof manufacturerFormSchema>) {
        setLoading(true);
        try {
            await createRedditStory({ ...values});
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
                    name="story"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название производителя</FormLabel>
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