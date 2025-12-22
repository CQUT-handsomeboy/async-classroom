import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  text: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ text, className = '' }) => {
  // 解析文本中的数学公式
  const renderTextWithMath = (text: string) => {
    // 匹配行内公式 $...$
    const inlinePattern = /\$([^$]+)\$/g;
    // 匹配块级公式 $$...$$
    const blockPattern = /\$\$([^$]+)\$\$/g;
    
    let parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // 先处理块级公式
    const blockMatches = Array.from(text.matchAll(blockPattern));
    if (blockMatches.length > 0) {
      blockMatches.forEach((match, index) => {
        const beforeMatch = text.slice(lastIndex, match.index);
        if (beforeMatch) {
          parts.push(renderInlineMath(beforeMatch, `before-block-${index}`));
        }
        
        parts.push(
          <div key={`block-${index}`} className="my-3 text-center">
            <BlockMath math={match[1].trim()} />
          </div>
        );
        
        lastIndex = (match.index || 0) + match[0].length;
      });
      
      const remaining = text.slice(lastIndex);
      if (remaining) {
        parts.push(renderInlineMath(remaining, 'remaining'));
      }
      
      return parts;
    }
    
    // 如果没有块级公式，只处理行内公式
    return renderInlineMath(text, 'inline-only');
  };
  
  const renderInlineMath = (text: string, key: string) => {
    const inlinePattern = /\$([^$]+)\$/g;
    const matches = Array.from(text.matchAll(inlinePattern));
    
    if (matches.length === 0) {
      return <span key={key}>{text}</span>;
    }
    
    let parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    matches.forEach((match, index) => {
      const beforeMatch = text.slice(lastIndex, match.index);
      if (beforeMatch) {
        parts.push(<span key={`${key}-text-${index}`}>{beforeMatch}</span>);
      }
      
      parts.push(
        <InlineMath key={`${key}-math-${index}`} math={match[1].trim()} />
      );
      
      lastIndex = (match.index || 0) + match[0].length;
    });
    
    const remaining = text.slice(lastIndex);
    if (remaining) {
      parts.push(<span key={`${key}-remaining`}>{remaining}</span>);
    }
    
    return <span key={key}>{parts}</span>;
  };
  
  return (
    <div className={className}>
      {renderTextWithMath(text)}
    </div>
  );
};

export default MathRenderer;