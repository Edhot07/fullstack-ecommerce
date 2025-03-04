"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { queryProducts } from "@/wix-api/products";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import Link from "next/link";

interface SearchFieldProps {
  className?: string;
}

export default function SearchField({ className }: SearchFieldProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState<any[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const q = useDebounce(search, 200);

  // Fetch data when `q` changes
  useEffect(() => {
    if (q.length > 0) {
      (async () => {
        try {
          const { query } = await queryProducts(wixBrowserClient, { q });
          const result = (await query.ascending().find()).items;
          setDatas(result);
          setIsSuggestionsVisible(true);
        } catch (error) {
          console.error("Error fetching data:", error);
          setDatas([]);
          setIsSuggestionsVisible(false);
        }
      })();
    } else {
      setDatas([]);
      setIsSuggestionsVisible(false);
    }
  }, [q]);

  // Handle clicks outside the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  // Memoize the suggestions list to avoid re-rendering unnecessarily
  const suggestionsList = useMemo(() => {
    return datas.map((product, index) => (
      <li key={index}>
        <Link
          href={`/shop?q=${encodeURIComponent(product.slug)}`}
          onClick={() => setIsSuggestionsVisible(false)}
        >
          {product.name}
        </Link>
      </li>
    ));
  }, [datas]);

  return (
    <form
      onSubmit={handleSubmit}
      method="GET"
      action="/shop"
      className={cn("grow", className)}
    >
      <div className="relative" ref={searchContainerRef}>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          name="q"
          placeholder="Search"
          className="pe-10"
          autoComplete="off"
        />
        <SearchIcon
          type="submit"
          className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform"
        />
        {isSuggestionsVisible && (
          <div className="bordermt-1 absolute left-0 top-full z-50 mt-1 max-h-52 w-full rounded-b-lg bg-secondary shadow-md">
            <ul className="list-none truncate break-all px-2 py-2">
              {suggestionsList}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}