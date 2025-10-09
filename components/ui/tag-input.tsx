"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

type TagInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  addLabel?: string;
  className?: string;
};

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  disabled,
  addLabel = "Add",
  className,
}: TagInputProps) {
  const [text, setText] = React.useState("");

  const addCurrent = React.useCallback(() => {
    const t = text.trim();
    if (!t) return;
    const next = Array.from(new Set([...value, t]));
    onChange(next);
    setText("");
  }, [text, value, onChange]);

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCurrent();
    }
    if (e.key === "Backspace" && !text && value.length) {
      // Convenience: backspace removes last tag
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <Button type="button" onClick={addCurrent} disabled={disabled} variant="secondary">
          <Plus className="h-4 w-4 mr-1" /> {addLabel}
        </Button>
      </div>
      {!!value.length && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((v, i) => (
            <Badge key={`${v}-${i}`} variant="outline" className="flex items-center gap-1">
              <span>{v}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="ml-1 opacity-70 hover:opacity-100"
                aria-label={`Remove ${v}`}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}