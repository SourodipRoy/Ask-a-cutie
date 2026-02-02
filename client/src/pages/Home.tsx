import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { insertRequestSchema, type InsertRequest, encodeData } from "@shared/schema";
import { Heart, Send, Sparkles, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  
  const form = useForm<InsertRequest>({
    resolver: zodResolver(insertRequestSchema),
    defaultValues: {
      question: "Will you go out with me?",
      message: "Yayyy! I can't wait! ❤️",
    },
  });

  const onSubmit = (data: InsertRequest) => {
    try {
      const encoded = encodeData(data);
      const url = `${window.location.origin}/q/${encoded}`;
      setCreatedUrl(url);
      toast({
        title: "Created with love! 💖",
        description: "Your special link is ready to share.",
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong creating the link.",
        variant: "destructive",
      });
    }
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!createdUrl) return;
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard. Send it to your special someone!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-primary/10 animate-pulse">
          <Heart size={120} fill="currentColor" />
        </div>
        <div className="absolute bottom-20 right-20 text-primary/10 animate-bounce" style={{ animationDuration: '3s' }}>
          <Heart size={80} fill="currentColor" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-card rounded-3xl p-8 md:p-12 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="text-primary w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl mb-2 text-primary font-handwriting">
            Ask a cutie!
          </h1>
          <p className="text-muted-foreground font-sans">
            Create a playful question for someone special.
          </p>
          <p className="text-muted-foreground font-sans text-sm"> Dev: @sourodiproy89 aka Equilibrium 🎀</p>
        </div>

        <AnimatePresence mode="wait">
          {!createdUrl ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80 ml-1">The Question</label>
                <input
                  {...form.register("question")}
                  placeholder="e.g. Will you be my Valentine?"
                  className="w-full px-6 py-4 rounded-xl bg-white border-2 border-pink-100 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-muted-foreground/50"
                />
                {form.formState.errors.question && (
                  <p className="text-destructive text-sm ml-1">{form.formState.errors.question.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80 ml-1">The Success Message</label>
                <textarea
                  {...form.register("message")}
                  placeholder="What they'll see when they say Yes!"
                  rows={3}
                  className="w-full px-6 py-4 rounded-xl bg-white border-2 border-pink-100 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium resize-none placeholder:text-muted-foreground/50"
                />
                {form.formState.errors.message && (
                  <p className="text-destructive text-sm ml-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
              >
                Create Link <Send size={20} />
              </motion.button>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold text-green-800">Ready to Share!</h3>
                <p className="text-green-700 text-sm">Send this link to make their day.</p>
              </div>

              <div className="relative">
                <input 
                  readOnly 
                  value={createdUrl} 
                  className="w-full pl-6 pr-14 py-4 rounded-xl bg-secondary border border-border text-muted-foreground font-mono text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-2 bottom-2 p-2 bg-white rounded-lg shadow-sm hover:shadow border border-border text-primary transition-all"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(createdUrl, '_blank')}
                  className="py-3 px-6 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                >
                  Test Link
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCreatedUrl(null)}
                  className="py-3 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  Create New
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
