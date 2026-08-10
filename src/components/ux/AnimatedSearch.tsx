import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { Magnifer } from "@solar-icons/react";

interface AnimatedSearchProps {
  onSearch: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string; 
}

export default function AnimatedSearch({ 
  onSearch, 
  isLoading = false, 
  placeholder = "Buscar dispositivo...",
  initialValue = ""
}: AnimatedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(initialValue);

  useEffect(() => {
    if (initialValue) {
      setSearchValue(initialValue);
      setIsExpanded(true);
    }
  }, [initialValue]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue);
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="search-input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut",
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="overflow-hidden"
          >
            <Input
              autoFocus
              size="md"
              radius="full"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              endContent={
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchValue.trim()}
                  className="flex items-center justify-center"
                >
                  <Magnifer weight="BoldDuotone" size={18} />
                </button>
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="search-button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              isIconOnly
              aria-label="Buscar"
              onClick={() => setIsExpanded(true)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-content text-default-500 hover:bg-default-100 transition-colors dark:bg-default/20 bg-zinc-100"
            >
              <Magnifer weight="BoldDuotone" size={20} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}