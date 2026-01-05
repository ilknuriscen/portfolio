/**
 * SVG Optimizer Utility
 * Optimizes inline SVG icons by removing unnecessary attributes
 */

class SVGOptimizer {
    constructor(options = {}) {
        this.svgSelector = options.svgSelector || 'svg';
        this.removeAttributes = options.removeAttributes || [
            'id',
            'class',
            'data-name',
            'xmlns:xlink',
            'xml:space'
        ];
        this.optimizedSVGs = new Set();
    }

    init() {
        this.optimizeAllSVGs();
    }

    optimizeAllSVGs() {
        const svgs = document.querySelectorAll(this.svgSelector);
        svgs.forEach(svg => this.optimizeSVG(svg));
    }

    optimizeSVG(svg) {
        if (this.optimizedSVGs.has(svg)) return;

        // Remove unnecessary attributes
        this.removeAttributes.forEach(attr => {
            svg.removeAttribute(attr);
        });

        // Optimize child elements
        this.optimizeChildren(svg);

        // Add optimized marker
        this.optimizedSVGs.add(svg);
    }

    optimizeChildren(element) {
        const children = element.children;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            // Remove unnecessary attributes from child elements
            this.removeAttributes.forEach(attr => {
                child.removeAttribute(attr);
            });

            // Recursively optimize nested elements
            if (child.children.length > 0) {
                this.optimizeChildren(child);
            }

            // Optimize numeric attributes (round to 2 decimals)
            this.optimizeNumericAttributes(child);
        }
    }

    optimizeNumericAttributes(element) {
        const numericAttrs = ['x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'y1', 'x2', 'y2'];

        numericAttrs.forEach(attr => {
            if (element.hasAttribute(attr)) {
                const value = parseFloat(element.getAttribute(attr));
                if (!isNaN(value)) {
                    // Round to 2 decimal places
                    const rounded = Math.round(value * 100) / 100;
                    element.setAttribute(attr, rounded);
                }
            }
        });

        // Optimize stroke-width and similar numeric properties
        const style = element.getAttribute('style');
        if (style) {
            const optimizedStyle = style.replace(/(\d+\.\d{3,})/g, (match) => {
                return (Math.round(parseFloat(match) * 100) / 100).toString();
            });
            element.setAttribute('style', optimizedStyle);
        }
    }

    getOptimizationStats() {
        return {
            optimizedSVGs: this.optimizedSVGs.size,
            totalSVGs: document.querySelectorAll(this.svgSelector).length
        };
    }

    destroy() {
        this.optimizedSVGs.clear();
    }
}

// Export for use in tests and modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGOptimizer;
}
