
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

interface TextFormattingState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: string;
}

interface TextFormatToolbarProps {
  textFormatting: TextFormattingState;
  onTextFormattingChange: (newState: TextFormattingState) => void;
}

const TextFormatToolbar = ({
  textFormatting,
  onTextFormattingChange
}: TextFormatToolbarProps) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={textFormatting.bold ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onTextFormattingChange({
                ...textFormatting,
                bold: !textFormatting.bold
              })}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>太字</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={textFormatting.italic ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onTextFormattingChange({
                ...textFormatting,
                italic: !textFormatting.italic
              })}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>斜体</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={textFormatting.underline ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onTextFormattingChange({
                ...textFormatting,
                underline: !textFormatting.underline
              })}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>下線</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="h-8 border-r border-gray-200 mx-1" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={textFormatting.align === "left" ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onTextFormattingChange({
                ...textFormatting,
                align: "left"
              })}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>左揃え</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={textFormatting.align === "center" ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onTextFormattingChange({
                ...textFormatting,
                align: "center"
              })}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>中央揃え</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={textFormatting.align === "right" ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onTextFormattingChange({
                ...textFormatting,
                align: "right"
              })}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>右揃え</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={textFormatting.align === "justify" ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onTextFormattingChange({
                ...textFormatting,
                align: "justify"
              })}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>両端揃え</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default TextFormatToolbar;
