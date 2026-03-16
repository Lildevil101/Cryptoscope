import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0B0F]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <img 
            src={import.meta.env.BASE_URL + 'images/logo.png'} 
            className="w-24 h-24 rounded-3xl shadow-[0_0_40px_rgba(0,255,136,0.4)]" 
            alt="CryptoScope Logo"
          />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-gradient mb-2 tracking-wide">
          CryptoScope
        </h1>
        <p className="text-muted-foreground font-medium mb-12">
          See the Market Clearly
        </p>

        <div className="w-10 h-10 border-4 border-card border-t-primary rounded-full animate-spin" />
      </motion.div>
    </motion.div>
  );
}
