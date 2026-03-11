import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlignLeft,
  Check,
  Clock,
  Copy,
  ExternalLink,
  History,
  ImageIcon,
  Link2,
  Loader2,
  Sparkles,
  Type,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { PinterestPinContent } from "../backend.d";
import { useAllGeneratedPins, useGeneratePins } from "../hooks/useQueries";

const POSTING_TIMES = [
  {
    region: "US",
    slot: "Morning Peak",
    local: "8:00 – 11:00 AM EST",
    ist: "6:30 – 9:30 PM IST",
    color: "us",
  },
  {
    region: "US",
    slot: "Afternoon",
    local: "2:00 – 4:00 PM EST",
    ist: "12:30 – 2:30 AM IST (+1)",
    color: "us",
  },
  {
    region: "US",
    slot: "Evening Peak",
    local: "8:00 – 11:00 PM EST",
    ist: "6:30 – 9:30 AM IST (+1)",
    color: "us",
  },
  {
    region: "US",
    slot: "Weekend Morning",
    local: "9:00 AM – 12:00 PM PST (Sat/Sun)",
    ist: "10:30 PM – 1:30 AM IST (+1)",
    color: "us",
  },
  {
    region: "UK",
    slot: "Morning",
    local: "8:00 – 10:00 AM GMT",
    ist: "1:30 – 3:30 PM IST",
    color: "uk",
  },
  {
    region: "UK",
    slot: "Lunch",
    local: "12:00 – 2:00 PM GMT",
    ist: "5:30 – 7:30 PM IST",
    color: "uk",
  },
  {
    region: "UK",
    slot: "Evening",
    local: "7:00 – 9:00 PM GMT",
    ist: "12:30 – 2:30 AM IST (+1)",
    color: "uk",
  },
  {
    region: "UK",
    slot: "Summer (BST)",
    local: "8:00 – 10:00 AM BST",
    ist: "12:30 – 2:30 PM IST",
    color: "uk",
  },
];

function CopyButton({
  text,
  "data-ocid": ocid,
}: {
  text: string;
  "data-ocid"?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      data-ocid={ocid}
      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-accent"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

function LoadingSkeleton() {
  return (
    <div
      data-ocid="url.loading_state"
      className="flex flex-col items-center gap-6 py-16"
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-7 w-7 text-primary animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <p className="font-display font-semibold text-lg text-foreground">
          Generating your Pinterest pins…
        </p>
        <p className="text-sm text-muted-foreground">
          Analyzing your blog content and crafting SEO-optimized pins
        </p>
      </div>
      <div className="w-full max-w-md space-y-3">
        {["a", "b", "c"].map((key, i) => (
          <div
            key={key}
            className="h-14 rounded-lg bg-gradient-to-r from-muted via-secondary to-muted animate-shimmer"
            style={{
              backgroundSize: "200% 100%",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PinGenerator() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [results, setResults] = useState<PinterestPinContent | null>(null);
  const queryClient = useQueryClient();
  const { data: history } = useAllGeneratedPins();
  const generateMutation = useGeneratePins();

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerate = async () => {
    setUrlError("");
    if (!url.trim()) {
      setUrlError("Please enter a blog URL");
      return;
    }
    if (!validateUrl(url.trim())) {
      setUrlError("Please enter a valid URL (e.g. https://yourblog.com/post)");
      return;
    }
    try {
      const data = await generateMutation.mutateAsync(url.trim());
      setResults(data);
      queryClient.invalidateQueries({ queryKey: ["allGeneratedPins"] });
    } catch {
      // error shown via mutation state
    }
  };

  const handleHistoryClick = (item: PinterestPinContent) => {
    setUrl(item.originalUrl);
    setResults(item);
  };

  const recentHistory = history?.slice(-5).reverse() ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <img
            src="/assets/generated/pingen-logo-transparent.dim_80x80.png"
            alt="PinGen"
            className="h-9 w-9 object-contain"
          />
          <div>
            <h1 className="font-display font-bold text-xl leading-tight text-foreground">
              Pinterest Pin Generator
            </h1>
            <p className="text-xs text-muted-foreground">
              SEO-optimized pins from any blog URL
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Hero + Input */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-6"
        >
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3" /> AI-Powered
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground leading-tight">
              Turn Any Blog Post Into{" "}
              <span className="text-primary">5 Pinterest Pins</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Paste your blog URL and get SEO titles, keyword-rich descriptions,
              image prompts, and optimal posting times — all in seconds.
            </p>
          </div>

          {/* URL Input */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-1.5">
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    data-ocid="url.input"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    placeholder="https://yourblog.com/amazing-post"
                    className={`pl-10 h-12 text-base border-2 transition-colors ${
                      urlError
                        ? "border-destructive focus-visible:ring-destructive"
                        : "focus-visible:border-primary"
                    }`}
                  />
                </div>
                {urlError && (
                  <p
                    data-ocid="url.error_state"
                    className="flex items-center gap-1.5 text-sm text-destructive"
                  >
                    <AlertCircle className="h-3.5 w-3.5" /> {urlError}
                  </p>
                )}
              </div>
              <Button
                type="button"
                data-ocid="url.submit_button"
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="h-12 px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {generateMutation.isPending ? "Generating…" : "Generate Pins"}
                </span>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Loading */}
        <AnimatePresence>
          {generateMutation.isPending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {generateMutation.isError && !generateMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="url.error_state"
            className="max-w-2xl mx-auto"
          >
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="flex items-center gap-3 py-4">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Generation failed
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {generateMutation.error?.message ||
                      "Please check the URL and try again."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results && !generateMutation.isPending && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3">
                  Generated Pins
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Tabs defaultValue="titles" className="w-full">
                <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-muted rounded-xl mb-6">
                  <TabsTrigger
                    value="titles"
                    data-ocid="results.tab"
                    className="flex items-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-primary rounded-lg"
                  >
                    <Type className="h-3.5 w-3.5" />
                    <span>Titles</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="descriptions"
                    data-ocid="results.tab"
                    className="flex items-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-primary rounded-lg"
                  >
                    <AlignLeft className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Descriptions</span>
                    <span className="sm:hidden">Desc</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="prompts"
                    data-ocid="results.tab"
                    className="flex items-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-primary rounded-lg"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Image Prompts</span>
                    <span className="sm:hidden">Images</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="times"
                    data-ocid="results.tab"
                    className="flex items-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-primary rounded-lg"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Post Times</span>
                    <span className="sm:hidden">Times</span>
                  </TabsTrigger>
                </TabsList>

                {/* Titles Tab */}
                <TabsContent value="titles" className="space-y-3">
                  {results.titles.map((title, i) => (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Card
                        data-ocid={`titles.item.${i + 1}`}
                        className="shadow-card hover:shadow-card-hover transition-shadow"
                      >
                        <CardContent className="flex items-center gap-3 py-4">
                          <span className="text-xs font-bold text-primary bg-accent w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <p className="flex-1 font-medium text-foreground">
                            {title}
                          </p>
                          <CopyButton
                            text={title}
                            data-ocid={`titles.copy_button.${i + 1}`}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                {/* Descriptions Tab */}
                <TabsContent value="descriptions" className="space-y-4">
                  {results.descriptions.map((desc, i) => (
                    <motion.div
                      key={desc}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Card
                        data-ocid={`descriptions.item.${i + 1}`}
                        className="shadow-card hover:shadow-card-hover transition-shadow"
                      >
                        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                          <span className="text-xs font-bold text-primary bg-accent px-2 py-0.5 rounded">
                            Description {i + 1}
                          </span>
                          <CopyButton
                            text={`${desc}\n\n${(results.hashtags[i] ?? []).map((h) => `#${h}`).join(" ")}`}
                            data-ocid={`descriptions.copy_button.${i + 1}`}
                          />
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-3">
                          <p className="text-sm text-foreground leading-relaxed">
                            {desc}
                          </p>
                          {results.hashtags[i] &&
                            results.hashtags[i].length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {results.hashtags[i].map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground cursor-default transition-colors"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                {/* Image Prompts Tab */}
                <TabsContent value="prompts" className="space-y-4">
                  {results.imagePrompts.map((prompt, i) => (
                    <motion.div
                      key={prompt.topText}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Card
                        data-ocid={`prompts.item.${i + 1}`}
                        className="shadow-card hover:shadow-card-hover transition-shadow"
                      >
                        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                          <span className="text-xs font-bold text-primary bg-accent px-2 py-0.5 rounded">
                            Image Prompt {i + 1}
                          </span>
                          <CopyButton
                            text={`Top Text: ${prompt.topText}\nBottom Text (CTA): ${prompt.bottomText}\nImage Prompt: ${prompt.imagePrompt}`}
                            data-ocid={`prompts.copy_button.${i + 1}`}
                          />
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-3">
                          <div className="space-y-2">
                            <div className="rounded-lg border border-border bg-muted/50 p-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Top Text (Headline)
                              </p>
                              <p className="font-semibold text-foreground">
                                {prompt.topText}
                              </p>
                            </div>
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Bottom Text (CTA)
                              </p>
                              <p className="font-semibold text-primary">
                                {prompt.bottomText}
                              </p>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Image Prompt
                              </p>
                              <p className="text-sm text-foreground leading-relaxed">
                                {prompt.imagePrompt}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                {/* Posting Times Tab */}
                <TabsContent value="times">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-chart-1" />
                        <span className="text-xs text-muted-foreground font-medium">
                          US (EST/PST)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-chart-2" />
                        <span className="text-xs text-muted-foreground font-medium">
                          UK (GMT/BST)
                        </span>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground italic">
                        All IST times shown
                      </span>
                    </div>

                    <Card className="shadow-card overflow-hidden">
                      <Table data-ocid="times.table">
                        <TableHeader>
                          <TableRow className="bg-muted/60 hover:bg-muted/60">
                            <TableHead className="font-semibold text-foreground w-16">
                              Region
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Slot
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Local Time
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              IST Time
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {POSTING_TIMES.map((row) => (
                            <TableRow
                              key={`${row.region}-${row.slot}`}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell>
                                <Badge
                                  className={`text-xs font-bold ${
                                    row.color === "us"
                                      ? "bg-chart-1 text-primary-foreground hover:bg-chart-1"
                                      : "bg-chart-2 text-primary-foreground hover:bg-chart-2"
                                  }`}
                                >
                                  {row.region}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-sm">
                                {row.slot}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {row.local}
                              </TableCell>
                              <TableCell className="text-sm font-semibold text-foreground">
                                {row.ist}
                              </TableCell>
                            </TableRow>
                          ))}
                          {results.timeRecommendations?.map((rec) => (
                            <TableRow
                              key={`${rec.region}-${rec.time}`}
                              className="hover:bg-muted/30 bg-accent/30"
                            >
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {rec.region}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-sm">
                                {rec.typeOfDay}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {rec.time}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground italic">
                                AI Recommended
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>

                    <p className="text-xs text-muted-foreground text-center">
                      ⏰ All times shown in{" "}
                      <strong>IST (Indian Standard Time, UTC+5:30)</strong>.
                      (+1) indicates the next calendar day.
                    </p>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Recent History */}
        {recentHistory.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground">
                Recent Generations
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentHistory.slice(0, 5).map((item, i) => (
                <button
                  type="button"
                  key={item.originalUrl}
                  data-ocid={`recent.item.${i + 1}`}
                  onClick={() => handleHistoryClick(item)}
                  className="inline-flex items-center gap-1.5 text-xs bg-card border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-accent transition-all max-w-xs truncate"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item.originalUrl}</span>
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
