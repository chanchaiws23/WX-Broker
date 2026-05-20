"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Plus, ExternalLink } from "lucide-react";

interface Broker {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  website: string;
  brokerType: string;
}

export default function HomePage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 500);

  const fetchBrokers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (type !== "all") params.set("type", type);

      const res = await fetch(`/api/brokers?${params.toString()}`);
      const data = await res.json();
      setBrokers(data.brokers || []);
    } catch {
      setBrokers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, type]);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  const getBadgeVariant = (brokerType: string) => {
    switch (brokerType) {
      case "cfd":
        return "default";
      case "crypto":
        return "secondary";
      case "stock":
        return "outline";
      case "bond":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Woxo Brokers</h1>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/create">
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Create Broker
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Broker List</h2>
          <p className="text-muted-foreground">Find and compare trading brokers</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="all">All Types</option>
            <option value="cfd">CFD</option>
            <option value="bond">Bond</option>
            <option value="stock">Stock</option>
            <option value="crypto">Crypto</option>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading brokers...</p>
          </div>
        ) : brokers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No brokers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker) => (
              <Link
                key={broker.id}
                href={`/broker/${broker.slug}`}
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {broker.logoUrl ? (
                          <img
                            src={broker.logoUrl}
                            alt={broker.name}
                            className="w-10 h-10 rounded object-contain bg-gray-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {broker.name[0]}
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{broker.name}</CardTitle>
                        </div>
                      </div>
                      <Badge variant={getBadgeVariant(broker.brokerType)}>
                        {broker.brokerType.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {broker.description}
                    </p>
                    <div className="flex items-center text-xs text-blue-600 hover:underline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Details
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
