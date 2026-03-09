"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useReadContract } from "wagmi"
import { parseEther, parseUnits, encodeFunctionData, type Address } from "viem"
import { baseSepolia } from "wagmi/chains"
import { usePrivy, useSendTransaction, useWallets } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { CONTRACT_ADDRESS, USDC_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { erc20ABI } from "@/lib/erc20-abi"
import { uploadJSONToIPFS } from "@/lib/ipfs"
import { uploadFileToCloudinary } from "@/lib/claudinary"

const formSchema = z.object({
    question: z.string().min(10, { message: "Question must be at least 10 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    image: z.any().refine((file) => file instanceof File || (typeof file !== 'string'), { message: "Image file is required." }),
    category: z.string().min(1, { message: "Category is required." }),
    customCategory: z.string().optional(),
    resolutionSource: z.string().min(3, { message: "Resolution source is required." }),
    liquidity: z.coerce.number().min(1, { message: "Initial liquidity must be at least 1." }),
    startDate: z.string().min(1, "Start date is required").refine(val => new Date(val) > new Date(), { message: "Start date must be in the future." }),
    endDate: z.string().min(1, "End date is required").refine(val => new Date(val) > new Date(), { message: "End date must be in the future." }),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date.",
    path: ["endDate"],
}).refine((data) => {
    if (data.category === "Other") {
        return data.customCategory && data.customCategory.trim().length > 0;
    }
    return true;
}, {
    message: "Custom category is required when 'Other' is selected.",
    path: ["customCategory"],
});

type FormValues = z.infer<typeof formSchema>;

export function MarketCreationForm() {
    const router = useRouter()
    const { authenticated, login, ready, user } = usePrivy()
    const { sendTransaction } = useSendTransaction()
    const { wallets } = useWallets()

    const walletAddress = (user?.wallet?.address as `0x${string}` | undefined)
    const wallet = wallets?.[0]

    const [approveHash, setApproveHash] = useState<string | null>(null)
    const [isApprovePending, setIsApprovePending] = useState(false)
    const [createHash, setCreateHash] = useState<string | null>(null)
    const [isCreatePending, setIsCreatePending] = useState(false)
    const [createStep, setCreateStep] = useState<string>("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            description: "",
            category: "",
            customCategory: "",
            resolutionSource: "",
            liquidity: 100,
            startDate: "",
            endDate: "",
        },
    })

    const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
    const liquidity = watch("liquidity")
    const imageFile = watch("image")
    const category = watch("category")

    useEffect(() => {
        if (imageFile instanceof File) {
            const previewUrl = URL.createObjectURL(imageFile)
            setImagePreview(previewUrl)
            return () => URL.revokeObjectURL(previewUrl)
        } else {
            setImagePreview(null)
        }
    }, [imageFile])

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS as Address,
        abi: erc20ABI,
        functionName: "allowance",
        args: [walletAddress as Address, CONTRACT_ADDRESS as Address],
        query: { enabled: !!walletAddress }
    })

    useEffect(() => {
        if (approveHash && !isApprovePending) {
            setTimeout(() => {
                refetchAllowance()
            }, 2000)
        }
    }, [approveHash, isApprovePending, refetchAllowance])

    const isAllowanceSufficient = allowance ? allowance >= parseEther(liquidity?.toString() || "0") : false

    async function handleApprove() {
        if (!ready) {
            toast.error("Wallet is initializing, please wait...")
            return
        }
        if (!authenticated) {
            toast.info("Please connect your wallet first")
            login()
            return
        }
        if (!wallet || !walletAddress) {
            toast.error("Wallet not available. Please reconnect your wallet.")
            return
        }

        try {
            setIsApprovePending(true)
            const approveAmount = parseEther(liquidity.toString())
            const data = encodeFunctionData({
                abi: erc20ABI,
                functionName: "approve",
                args: [CONTRACT_ADDRESS as Address, approveAmount],
            })

            const { hash } = await sendTransaction(
                { to: USDC_ADDRESS as Address, data, chainId: baseSepolia.id },
                { address: wallet.address as `0x${string}` }
            )

            setApproveHash(hash)
            toast.success("Approval transaction sent!")
            setIsApprovePending(false)
        } catch (error: any) {
            setIsApprovePending(false)
            toast.error(`Failed to approve USDC: ${error?.message || "Unknown error"}`)
        }
    }

    async function onSubmit(values: FormValues) {
        if (!ready) return toast.error("Wallet is initializing, please wait...")
        if (!authenticated) {
            toast.info("Please connect your wallet first");
            return login();
        }
        if (!walletAddress) return toast.error("Wallet address not available. Please reconnect.")
        if (!isAllowanceSufficient) return handleApprove();

        try {
            setIsCreatePending(true)

            // 1. Upload Image
            setCreateStep("Uploading image...")
            let imageUrl = "";
            if (values.image instanceof File) {
                const imageToast = toast.loading("Uploading image to Cloudinary...");
                try {
                    imageUrl = await uploadFileToCloudinary(values.image);
                    toast.dismiss(imageToast);
                    toast.success("Image uploaded successfully!");
                } catch (error) {
                    toast.dismiss(imageToast);
                    toast.error("Failed to upload image. Check your API keys.");
                    setIsCreatePending(false);
                    setCreateStep("");
                    return;
                }
            }

            // 2. Upload Metadata
            setCreateStep("Uploading metadata...")
            const metadataToast = toast.loading("Uploading metadata to IPFS...");
            const metadata = {
                question: values.question,
                description: values.description,
                image: imageUrl,
                imageSource: "cloudinary",
                category: values.category === "Other" && values.customCategory ? values.customCategory : values.category,
                resolutionSource: values.resolutionSource
            };

            let metadataCid = "";
            try {
                metadataCid = await uploadJSONToIPFS(metadata);
                toast.dismiss(metadataToast);
                toast.success("Metadata uploaded successfully!");
            } catch (error) {
                toast.dismiss(metadataToast);
                toast.error("Failed to upload metadata.");
                setIsCreatePending(false);
                setCreateStep("");
                return;
            }

            // 3. Create Market
            setCreateStep("Creating market...")
            const createToast = toast.loading("Creating market on blockchain...");

            let startTime = Math.floor(new Date(values.startDate).getTime() / 1000)
            const endTime = Math.floor(new Date(values.endDate).getTime() / 1000)
            const now = Math.floor(Date.now() / 1000)

            if (startTime <= now) {
                startTime = now + 60
            }

            if (!wallet) {
                toast.dismiss(createToast);
                toast.error("Wallet not available. Please reconnect.")
                setIsCreatePending(false);
                setCreateStep("");
                return;
            }

            const createMarketData = encodeFunctionData({
                abi: LMSRABI as any,
                functionName: 'createMarket',
                args: [
                    parseUnits(values.liquidity.toString(), 6),
                    BigInt(startTime),
                    BigInt(endTime),
                    values.question,
                    metadataCid
                ],
            })

            const { hash: txHash } = await sendTransaction(
                { to: CONTRACT_ADDRESS as Address, data: createMarketData, chainId: baseSepolia.id },
                { address: wallet.address as `0x${string}` }
            )

            setCreateHash(txHash)
            toast.dismiss(createToast)
            toast.success("🎊 Market created successfully!")
            setIsCreatePending(false)
            setCreateStep("")

            form.reset()
            setImagePreview(null)

            setTimeout(() => {
                router.push("/")
            }, 2000)
        } catch (error: any) {
            setIsCreatePending(false)
            setCreateStep("")
            toast.error(`Failed to create market: ${error?.message || "Unknown error"}`)
        }
    }

    const inputClasses = "w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-input focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
    const labelClasses = "block text-label mb-2"

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
                <h3 className="text-heading-3 border-b border-border pb-2 text-foreground">1. Market Details</h3>

                <div>
                    <label className={labelClasses}>Question</label>
                    <input
                        {...register("question")}
                        placeholder="e.g. Will BTC hit $100k by 2025?"
                        className={inputClasses}
                    />
                    {errors.question && <p className="text-destructive text-sm mt-1">{errors.question.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Description</label>
                    <textarea
                        {...register("description")}
                        placeholder="Provide context and resolution criteria..."
                        className={`${inputClasses} min-h-[100px] resize-y`}
                    />
                    {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Category</label>
                    <select
                        {...register("category")}
                        className={inputClasses}
                        onChange={(e) => {
                            setValue("category", e.target.value);
                            if (e.target.value !== "Other") setValue("customCategory", "");
                        }}
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Crypto">Crypto</option>
                        <option value="Politics">Politics</option>
                        <option value="Sports">Sports</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Technology">Technology</option>
                        <option value="Economics">Economics</option>
                        <option value="World Events">World Events</option>
                        <option value="Other">Other (Custom)</option>
                    </select>
                    {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
                </div>

                {category === "Other" && (
                    <div>
                        <label className={labelClasses}>Custom Category</label>
                        <input
                            {...register("customCategory")}
                            placeholder="Enter your custom category"
                            className={inputClasses}
                        />
                        {errors.customCategory && <p className="text-destructive text-sm mt-1">{errors.customCategory.message}</p>}
                    </div>
                )}

                <div>
                    <label className={labelClasses}>Market Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className={`${inputClasses} cursor-pointer file:cursor-pointer file:text-primary file:border-0 file:bg-transparent file:font-semibold text-foreground`}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setValue("image", file, { shouldValidate: true });
                        }}
                    />
                    {imagePreview && (
                        <div className="mt-3">
                            <img src={imagePreview} alt="Preview" className="rounded-lg border border-border max-w-full h-auto max-h-64 object-contain" />
                        </div>
                    )}
                    {errors.image && <p className="text-destructive text-sm mt-1">{errors.image?.message as string}</p>}
                </div>
            </div>

            {/* Section 2: Resolution & Timeline */}
            <div className="space-y-4">
                <h3 className="text-heading-3 border-b border-border pb-2 text-foreground">2. Resolution & Timeline</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClasses}>Resolution Source</label>
                        <input
                            {...register("resolutionSource")}
                            placeholder="e.g. Binance API, CoinGecko"
                            className={inputClasses}
                        />
                        {errors.resolutionSource && <p className="text-destructive text-sm mt-1">{errors.resolutionSource.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Start Date</label>
                        <input
                            type="datetime-local"
                            {...register("startDate")}
                            className={inputClasses}
                        />
                        {errors.startDate && <p className="text-destructive text-sm mt-1">{errors.startDate.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>End Date</label>
                        <input
                            type="datetime-local"
                            {...register("endDate")}
                            className={inputClasses}
                        />
                        {errors.endDate && <p className="text-destructive text-sm mt-1">{errors.endDate.message}</p>}
                    </div>
                </div>
            </div>

            {/* Section 3: Funding */}
            <div className="space-y-4">
                <h3 className="text-heading-3 border-b border-border pb-2 text-foreground">3. Liquidity</h3>
                <div>
                    <label className={labelClasses}>Initial Liquidity (USDC)</label>
                    <input
                        type="number"
                        {...register("liquidity")}
                        className={inputClasses}
                    />
                    <p className="text-sm text-muted-foreground mt-1.5">Higher liquidity means less slippage for traders.</p>
                    {errors.liquidity && <p className="text-destructive text-sm mt-1">{errors.liquidity.message}</p>}
                </div>
            </div>

            <div className="pt-4">
                {isAllowanceSufficient ? (
                    <button
                        type="submit"
                        disabled={isCreatePending}
                        className="w-full text-btn bg-primary text-primary-foreground hover:bg-primary/90 transition-colors h-12 rounded-lg font-semibold flex items-center justify-center disabled:opacity-50"
                    >
                        {isCreatePending ? (createStep || "Processing...") : "Create Market"}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleApprove}
                        disabled={isApprovePending}
                        className="w-full text-btn bg-success text-white hover:bg-success/90 transition-colors h-12 rounded-lg font-semibold flex items-center justify-center disabled:opacity-50"
                    >
                        {isApprovePending ? "Processing Approval..." : "Approve USDC"}
                    </button>
                )}
            </div>

            {createHash && <div className="p-3 rounded bg-success/10 border border-success/20 text-xs text-success break-all">Create Tx: {createHash}</div>}
            {approveHash && <div className="p-3 rounded bg-info/10 border border-info/20 text-xs text-info break-all">Approve Tx: {approveHash}</div>}
            {createHash && !isCreatePending && <div className="text-center text-success font-bold text-lg">Market Creation Transaction Sent!</div>}
        </form>
    )
}
