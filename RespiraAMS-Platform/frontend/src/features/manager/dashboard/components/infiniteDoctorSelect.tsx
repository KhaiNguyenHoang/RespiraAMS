"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useInfiniteDoctors } from "../queries"

interface Props {
    value: string | null;
    onChange: (id: string | null) => void;
}

export function InfiniteDoctorSelect({ value, onChange }: Props) {
    const [open, setOpen] = React.useState(false)
    const { ref, inView } = useInView()

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteDoctors()

    React.useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage, hasNextPage])

    const allDoctors = React.useMemo(() => {
        return data?.pages.flatMap(page => page.items) || []
    }, [data])

    const selectedDoctor = allDoctors.find(d => d.id === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto py-3 bg-white"
                >
                    {value ? (
                        <div className="flex flex-col items-start text-left">
                            <span className="font-semibold text-[#0c3660]">
                                {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                            </span>
                            <span className="text-xs text-zinc-500 font-normal mt-0.5">
                                {selectedDoctor?.email} • {selectedDoctor?.phoneNumber}
                            </span>
                        </div>
                    ) : (
                        <span className="text-zinc-500">All Doctors</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-75 p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search doctor (local)..." />
                    <CommandEmpty>No doctor found.</CommandEmpty>
                    <CommandList className="max-h-75 overflow-y-auto">
                        <CommandGroup>
                            <CommandItem
                                value="all"
                                onSelect={() => {
                                    onChange(null)
                                    setOpen(false)
                                }}
                                className="cursor-pointer"
                            >
                                <Check className={cn("mr-2 h-4 w-4", value === null ? "opacity-100" : "opacity-0")} />
                                <span className="font-semibold">All Doctors</span>
                            </CommandItem>

                            {allDoctors.map((doc) => (
                                <CommandItem
                                    key={doc.id}
                                    value={doc.id}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? null : doc.id)
                                        setOpen(false)
                                    }}
                                    className="cursor-pointer flex items-start py-3"
                                >
                                    <Check className={cn("mr-2 h-4 w-4 mt-1", value === doc.id ? "opacity-100 text-primary" : "opacity-0")} />
                                    <div className="flex flex-col flex-1">
                                        <span className="font-semibold text-zinc-900">
                                            {doc.firstName} {doc.lastName}
                                        </span>
                                        <span className="text-xs text-zinc-500 mt-1">
                                            Email: {doc.email}
                                        </span>
                                        <span className="text-xs text-zinc-500">
                                            Phone: {doc.phoneNumber}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}

                            {hasNextPage && (
                                <div ref={ref} className="p-4 flex justify-center items-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                                </div>
                            )}

                            {!hasNextPage && !isLoading && allDoctors.length > 0 && (
                                <p className="text-center text-xs text-zinc-400 py-3">End of list.</p>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}