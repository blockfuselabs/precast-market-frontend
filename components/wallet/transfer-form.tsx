"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { isAddress } from "viem"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Loader2, Send } from "lucide-react"

const formSchema = z.object({
    recipient: z.string().refine((val) => isAddress(val), {
        message: "Invalid address",
    }),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Required",
    }),
    token: z.enum(["ETH", "USDC"]),
})

export function TransferForm() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipient: "",
            amount: "",
            token: "ETH",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setTimeout(() => {
            console.log("Transferring:", values)
            setIsLoading(false)
            form.reset()
        }, 2000)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-medium text-muted-foreground">Quick Transfer</h3>
            </div>

            <div className="flex-1 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-medium text-white/70">Select Asset</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 rounded-2xl bg-white/5 border-white/5 text-white focus:ring-0 focus:ring-offset-0 focus:border-white/20 transition-all hover:bg-white/10">
                                                <SelectValue placeholder="Select asset" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl border-white/10 bg-black/90 backdrop-blur-xl text-white">
                                            <SelectItem value="ETH" className="focus:bg-white/10 focus:text-white cursor-pointer">Ethereum (ETH)</SelectItem>
                                            <SelectItem value="USDC" className="focus:bg-white/10 focus:text-white cursor-pointer">USD Coin (USDC)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-400" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="recipient"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-medium text-white/70">Recipient</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0x..."
                                            {...field}
                                            className="h-11 rounded-2xl bg-white/5 border-white/5 text-white font-mono text-sm placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-white/20 transition-all hover:bg-white/10"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-400" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-medium text-white/70">Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg font-light">$</div>
                                            <Input
                                                type="number"
                                                step="0.000001"
                                                placeholder="0.00"
                                                {...field}
                                                className="h-14 pl-8 rounded-2xl bg-white/5 border-white/5 text-2xl font-bold text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-white/20 transition-all hover:bg-white/10"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-white/50 uppercase">
                                                {form.watch("token")}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-400" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-fuchsia-900/20 mt-4 transition-all active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span className="text-sm">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm">Confirm Transfer</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
