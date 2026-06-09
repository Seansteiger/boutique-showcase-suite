export interface CategoryNode {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    parent_id: string | null;
    created_at: string;
    children: CategoryNode[];
}

export function mapCategoriesToTree(categories: any[]): CategoryNode[] {
    const categoryMap: { [key: string]: CategoryNode } = {};
    const tree: CategoryNode[] = [];

    // First pass: create nodes
    categories.forEach(cat => {
        categoryMap[cat.id] = { ...cat, children: [] };
    });

    // Second pass: link parents and children
    categories.forEach(cat => {
        if (cat.parent_id && categoryMap[cat.parent_id]) {
            categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
        } else {
            tree.push(categoryMap[cat.id]);
        }
    });

    return tree;
}

/**
 * Flattens the tree into a list with depth information for rendering
 */
export function flattenCategoryTree(nodes: CategoryNode[], depth: number = 0): (CategoryNode & { depth: number })[] {
    let result: (CategoryNode & { depth: number })[] = [];
    nodes.forEach(node => {
        result.push({ ...node, depth });
        if (node.children.length > 0) {
            result = result.concat(flattenCategoryTree(node.children, depth + 1));
        }
    });
    return result;
}
