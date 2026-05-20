import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Globe } from "lucide-react";

interface Broker {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  website: string;
  brokerType: string;
}

async function getBroker(slug: string): Promise<Broker | null> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:3001";
    const res = await fetch(
      `${apiUrl}/api/brokers/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.broker || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const broker = await getBroker(slug);

  if (!broker) {
    return {
      title: "Broker Not Found | Woxo Brokers",
      description: "The requested broker could not be found.",
    };
  }

  return {
    title: `${broker.name} | Woxo Brokers`,
    description: broker.description,
    openGraph: {
      title: `${broker.name} | Woxo Brokers`,
      description: broker.description,
      images: broker.logoUrl ? [broker.logoUrl] : [],
    },
  };
}

export default async function BrokerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const broker = await getBroker(slug);

  if (!broker) {
    notFound();
  }

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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Woxo Brokers</h1>
          <Link href="/create">
            <Button size="sm">Create Broker</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Brokers
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {broker.logoUrl ? (
                <img
                  src={broker.logoUrl}
                  alt={broker.name}
                  className="w-16 h-16 rounded-lg object-contain bg-gray-100 p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/64";
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                  {broker.name[0]}
                </div>
              )}
              <div>
                <CardTitle className="text-2xl mb-1">{broker.name}</CardTitle>
                <Badge variant={getBadgeVariant(broker.brokerType)}>
                  {broker.brokerType.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{broker.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Website
              </h3>
              <a
                href={broker.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                <Globe className="w-4 h-4 mr-2" />
                {broker.website}
              </a>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Slug: <span className="font-mono">{broker.slug}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
