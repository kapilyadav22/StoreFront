import { products } from "@/data/products";

export type SearchResult = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  matchType: "name" | "description" | "category" | "tag";
};

export function searchProducts(query: string, limit: number = 10): SearchResult[] {
  if (!query.trim()) return [];
  
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];
  
  for (const product of products) {
    if (product.name.toLowerCase().includes(q)) {
      results.push({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        tags: product.tags || [],
        matchType: "name"
      });
      continue;
    }
    
    if (product.description.toLowerCase().includes(q)) {
      results.push({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        tags: product.tags || [],
        matchType: "description"
      });
      continue;
    }
    
    if (product.category.toLowerCase().includes(q)) {
      results.push({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        tags: product.tags || [],
        matchType: "category"
      });
      continue;
    }
    
    if (product.tags?.some(tag => tag.toLowerCase().includes(q))) {
      results.push({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        tags: product.tags || [],
        matchType: "tag"
      });
    }
  }
  
  const unique = results.filter((result, index, self) => 
    index === self.findIndex(r => r.id === result.id)
  );
  
  return unique.slice(0, limit);
}

export function getSearchSuggestions(query: string): string[] {
  if (!query.trim()) return [];
  
  const suggestions = new Set<string>();
  const q = query.toLowerCase().trim();
  
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    if (cat.toLowerCase().includes(q)) {
      suggestions.add(cat);
    }
  });
  
  const allTags = products.flatMap(p => p.tags || []);
  const uniqueTags = [...new Set(allTags)];
  uniqueTags.forEach(tag => {
    if (tag.toLowerCase().includes(q)) {
      suggestions.add(tag);
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
}
