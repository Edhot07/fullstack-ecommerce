"use client"

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
    className?: string;
}
export default function SearchField({className}: SearchFieldProps) {
    const router = useRouter();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const form = e.currentTarget;
        console.log("This is form, ", form)
        const q = (form.q as HTMLInputElement).value.trim();
        if(!q) return;
        router.push(`/shop?q=${encodeURIComponent(q)}`);
    }
  return (
    <form onSubmit={handleSubmit}
        method="GET"
        action="/shop"
    className={cn("grow", className)}>

    <div className="relative">
      <Input name="q" placeholder="Search" className="pe-10" />
      <SearchIcon type="submit" className="absolute size-5 top-1/2 -translate-y-1/2 right-3 transform "/>
    </div>
    </form>
  )
}
