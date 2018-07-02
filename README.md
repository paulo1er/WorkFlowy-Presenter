# WorkFlowy-Presenter

Presenter for workflowy.com.

It convert list from WorkFlowy to a presentable text for giving a talk.

## Functionality

### Presenter mode

Change the CSS of workflowy.com for only keep the useful information.

- display the tag
- keep a minimal header
- display the path from root to your current item
- put forward the title

### Lock Content

By activate this option you can't modify the content of workflowy.

### Preview styles

This option is used to apply some style to only one item by tag.

For example :

- Lorem Ipsum #wfe-font-style:Italic #wfe-font-weight:Bold

Will be display  

- **_Lorem Ipsum #wfe-font-style:Italic #wfe-font-weight:Bold_**

All the tags are :
- #wfe-background
- #wfe-font-color
- #wfe-font-face
- #wfe-font-weight
- #wfe-font-style
- #wfe-text-decoration
- #wfe-font-size
- #wfe-text-align

### Render LaTeX

This option display LaTeX code.
- in line $ Code $
- in block \\[ Code \\]

 __WARNING : This option have a bug and can create some undesirable text in your WorkFlowy.__

The bug appear when you edit the WorkFlowy content and the LaTeX rendering is active.

If the bug appear, Ctrl+z will delete the undesirable text.

### Other

In Presenter mode you can
- use PageDown or Ctrl+ArrowDown to go to the next item.
- use PageUp or Ctrl+ArrowUp to go to the previous item.

In the header of presenter mode, the button '<' is used to go to the parent of the curent item.
