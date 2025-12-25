import Image from '@tiptap/extension-image';
import { ReactRenderer } from '@tiptap/react';
import { ImageResizeComponent } from './image-resize-component';

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute('width');
          return width ? parseInt(width, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute('height');
          return height ? parseInt(height, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, editor }) => {
      const component = new ReactRenderer(ImageResizeComponent, {
        props: {
          node,
          updateAttributes: (attrs: { width?: number; height?: number }) => {
            editor.commands.updateAttributes(this.name, attrs);
          },
        },
        editor,
      });

      return {
        dom: component.element,
        contentDOM: null,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) {
            return false;
          }
          component.updateProps({
            node: updatedNode,
            updateAttributes: (attrs: { width?: number; height?: number }) => {
            editor.commands.updateAttributes(this.name, attrs);
          },
          });
          return true;
        },
        destroy: () => {
          component.destroy();
        },
      };
    };
  },
}).configure({
  inline: true,
  allowBase64: false,
});

