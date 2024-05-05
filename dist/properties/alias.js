const borderAliases = {
    borderWidth: ['borderBottomWidth', 'borderTopWidth', 'borderLeftWidth', 'borderRightWidth'],
    borderXWidth: ['borderLeftWidth', 'borderRightWidth'],
    borderYWidth: ['borderTopWidth', 'borderBottomWidth'],
};
const flexAliases = {
    ...borderAliases,
    inset: ['positionTop', 'positionLeft', 'positionRight', 'positionBottom'],
    padding: ['paddingBottom', 'paddingTop', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    margin: ['marginBottom', 'marginTop', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    gap: ['gapRow', 'gapColumn'],
};
const panelAliases = {
    borderRadius: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'],
    borderTopRadius: ['borderTopLeftRadius', 'borderTopRightRadius'],
    borderLeftRadius: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
    borderRightRadius: ['borderTopRightRadius', 'borderBottomRightRadius'],
    borderBottomRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
};
const scrollbarAliases = {
    scrollbarBorderRadius: [
        'scrollbarBorderTopLeftRadius',
        'scrollbarBorderTopRightRadius',
        'scrollbarBorderBottomLeftRadius',
        'scrollbarBorderBottomRightRadius',
    ],
    scrollbarBorderTopRadius: ['scrollbarBorderTopLeftRadius', 'scrollbarBorderTopRightRadius'],
    scrollbarBorderLeftRadius: ['scrollbarBorderTopLeftRadius', 'scrollbarBorderBottomLeftRadius'],
    scrollbarBorderRightRadius: ['scrollbarBorderTopRightRadius', 'scrollbarBorderBottomRightRadius'],
    scrollbarBorderBottomRadius: ['scrollbarBorderBottomLeftRadius', 'scrollbarBorderBottomRightRadius'],
    scrollbarBorderWidth: [
        'scrollbarBorderBottomWidth',
        'scrollbarBorderTopWidth',
        'scrollbarBorderLeftWidth',
        'scrollbarBorderRightWidth',
    ],
    scrollbarBorderXWidth: ['scrollbarBorderLeftWidth', 'scrollbarBorderRightWidth'],
    scrollbarBorderYWidth: ['scrollbarBorderTopWidth', 'scrollbarBorderBottomWidth'],
};
const caretAliases = {
    caretBorderRadius: [
        'caretBorderTopLeftRadius',
        'caretBorderTopRightRadius',
        'caretBorderBottomLeftRadius',
        'caretBorderBottomRightRadius',
    ],
    caretBorderTopRadius: ['caretBorderTopLeftRadius', 'caretBorderTopRightRadius'],
    caretBorderLeftRadius: ['caretBorderTopLeftRadius', 'caretBorderBottomLeftRadius'],
    caretBorderRightRadius: ['caretBorderTopRightRadius', 'caretBorderBottomRightRadius'],
    caretBorderBottomRadius: ['caretBorderBottomLeftRadius', 'caretBorderBottomRightRadius'],
    caretBorderWidth: ['caretBorderBottomWidth', 'caretBorderTopWidth', 'caretBorderLeftWidth', 'caretBorderRightWidth'],
    caretBorderXWidth: ['caretBorderLeftWidth', 'caretBorderRightWidth'],
    caretBorderYWidth: ['caretBorderTopWidth', 'caretBorderBottomWidth'],
};
const selectionAliases = {
    selectionBorderRadius: [
        'selectionBorderTopLeftRadius',
        'selectionBorderTopRightRadius',
        'selectionBorderBottomLeftRadius',
        'selectionBorderBottomRightRadius',
    ],
    selectionBorderTopRadius: ['selectionBorderTopLeftRadius', 'selectionBorderTopRightRadius'],
    selectionBorderLeftRadius: ['selectionBorderTopLeftRadius', 'selectionBorderBottomLeftRadius'],
    selectionBorderRightRadius: ['selectionBorderTopRightRadius', 'selectionBorderBottomRightRadius'],
    selectionBorderBottomRadius: ['selectionBorderBottomLeftRadius', 'selectionBorderBottomRightRadius'],
    selectionBorderWidth: [
        'selectionBorderBottomWidth',
        'selectionBorderTopWidth',
        'selectionBorderLeftWidth',
        'selectionBorderRightWidth',
    ],
    selectionBorderXWidth: ['selectionBorderLeftWidth', 'selectionBorderRightWidth'],
    selectionBorderYWidth: ['selectionBorderTopWidth', 'selectionBorderBottomWidth'],
};
const transformAliases = {
    transformScale: ['transformScaleX', 'transformScaleY', 'transformScaleZ'],
};
export const allAliases = Object.assign({}, flexAliases, panelAliases, scrollbarAliases, transformAliases, caretAliases, selectionAliases);
