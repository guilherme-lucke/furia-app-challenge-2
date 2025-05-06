
import React, { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from './badge';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

const TagInput = ({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder = 'Adicionar...',
  suggestions = [],
  className = ''
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      onAddTag(suggestion);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      !tags.includes(suggestion) && 
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={`flex flex-wrap gap-2 p-2 border border-furia-gold/50 rounded-md bg-furia-black/50 focus-within:ring-1 focus-within:ring-furia-gold/70 ${className}`}>
      {tags.map((tag, index) => (
        <Badge 
          key={index} 
          variant="outline"
          className="bg-furia-black border-furia-gold/50 text-white flex items-center gap-1 px-2 py-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemoveTag(index)}
            className="ml-1 text-white/70 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      <div className="relative flex-1 min-w-[120px]">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="w-full bg-transparent border-none outline-none p-1 text-white"
        />
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 left-0 right-0 mt-1 max-h-60 overflow-auto bg-furia-black border border-furia-gold/50 rounded-md shadow-lg">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-furia-gold/10 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
