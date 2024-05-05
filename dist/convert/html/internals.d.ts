import { Node as ConversionNode, HTMLElement } from 'node-html-parser';
import { ConversionColorMap, ConversionPropertyTypes } from './properties.js';
import { MeshPhongMaterial, MeshPhysicalMaterial } from 'three';
export type ConversionGenerateComponent<T> = (renderAs: string, custom: boolean, properties: Record<string, unknown>, index: number, children?: Array<T | string>) => T | string;
export type ConversionComponentData = {
    defaultProperties?: Record<string, unknown>;
    skipIfEmpty?: boolean;
    propertyTypes: ConversionPropertyTypes;
    renderAs: string;
    children?: 'none' | 'text';
};
export { Node as ConversionNode } from 'node-html-parser';
export type ConversionComponentMap = Record<string, ConversionComponentData>;
export declare function convertHtml<T>(text: string, generate: ConversionGenerateComponent<T>, colorMap?: ConversionColorMap, componentMap?: ConversionComponentMap): T | string | undefined;
export declare class PlasticMaterial extends MeshPhongMaterial {
    constructor();
}
export declare class GlassMaterial extends MeshPhysicalMaterial {
    constructor();
}
export declare class MetalMaterial extends MeshPhysicalMaterial {
    constructor();
}
export declare function parseHtml(text: string, colorMap?: ConversionColorMap): {
    element: HTMLElement;
    classes: Map<string, any>;
};
export declare function convertParsedHtml<T>(element: ConversionNode, classes: Map<string, any>, generate: ConversionGenerateComponent<T>, colorMap?: ConversionColorMap, componentMap?: ConversionComponentMap): string | T | undefined;
export declare const conversionPropertyTypes: {
    Inheriting: {
        textAlign: string[][];
        verticalAlign: string[][];
        color: string[];
        opacity: string[];
        letterSpacing: string[];
        lineHeight: string[];
        fontSize: string[];
        wordBreak: string[][];
        fontFamily: string[];
        fontWeight: (string | string[])[];
        scrollbarOpacity: string[];
        scrollbarColor: string[];
        scrollbarWidth: string[];
        scrollbarBorderRightWidth: string[];
        scrollbarBorderTopWidth: string[];
        scrollbarBorderLeftWidth: string[];
        scrollbarBorderBottomWidth: string[];
        scrollbarBorderTopLeftRadius: string[];
        scrollbarBorderTopRightRadius: string[];
        scrollbarBorderBottomLeftRadius: string[];
        scrollbarBorderBottomRightRadius: string[];
        scrollbarBorderColor: string[];
        scrollbarBorderBend: string[];
        scrollbarBorderOpacity: string[];
        scrollbarBorderRadius: string[];
        scrollbarBorderTopRadius: string[];
        scrollbarBorderLeftRadius: string[];
        scrollbarBorderRightRadius: string[];
        scrollbarBorderBottomRadius: string[];
        scrollbarBorderWidth: string[];
        scrollbarBorderXWidth: string[];
        scrollbarBorderYWidth: string[];
        caretOpacity: string[];
        caretColor: string[];
        caretWidth: string[];
        caretBorderRightWidth: string[];
        caretBorderTopWidth: string[];
        caretBorderLeftWidth: string[];
        caretBorderBottomWidth: string[];
        caretBorderTopLeftRadius: string[];
        caretBorderTopRightRadius: string[];
        caretBorderBottomLeftRadius: string[];
        caretBorderBottomRightRadius: string[];
        caretBorderColor: string[];
        caretBorderBend: string[];
        caretBorderOpacity: string[];
        selectionOpacity: string[];
        selectionColor: string[];
        selectionBorderRightWidth: string[];
        selectionBorderTopWidth: string[];
        selectionBorderLeftWidth: string[];
        selectionBorderBottomWidth: string[];
        selectionBorderTopLeftRadius: string[];
        selectionBorderTopRightRadius: string[];
        selectionBorderBottomLeftRadius: string[];
        selectionBorderBottomRightRadius: string[];
        selectionBorderColor: string[];
        selectionBorderBend: string[];
        selectionBorderOpacity: string[];
        caretBorderRadius: string[];
        caretBorderTopRadius: string[];
        caretBorderLeftRadius: string[];
        caretBorderRightRadius: string[];
        caretBorderBottomRadius: string[];
        caretBorderWidth: string[];
        caretBorderXWidth: string[];
        caretBorderYWidth: string[];
        selectionBorderRadius: string[];
        selectionBorderTopRadius: string[];
        selectionBorderLeftRadius: string[];
        selectionBorderRightRadius: string[];
        selectionBorderBottomRadius: string[];
        selectionBorderWidth: string[];
        selectionBorderXWidth: string[];
        selectionBorderYWidth: string[];
    };
    Container: {}[];
    Icon: {}[];
    Image: ({
        textAlign: string[][];
        verticalAlign: string[][];
        color: string[];
        opacity: string[];
        letterSpacing: string[];
        lineHeight: string[];
        fontSize: string[];
        wordBreak: string[][];
        fontFamily: string[];
        fontWeight: (string | string[])[];
        scrollbarOpacity: string[];
        scrollbarColor: string[];
        scrollbarWidth: string[];
        scrollbarBorderRightWidth: string[];
        scrollbarBorderTopWidth: string[];
        scrollbarBorderLeftWidth: string[];
        scrollbarBorderBottomWidth: string[];
        scrollbarBorderTopLeftRadius: string[];
        scrollbarBorderTopRightRadius: string[];
        scrollbarBorderBottomLeftRadius: string[];
        scrollbarBorderBottomRightRadius: string[];
        scrollbarBorderColor: string[];
        scrollbarBorderBend: string[];
        scrollbarBorderOpacity: string[];
        scrollbarBorderRadius: string[];
        scrollbarBorderTopRadius: string[];
        scrollbarBorderLeftRadius: string[];
        scrollbarBorderRightRadius: string[];
        scrollbarBorderBottomRadius: string[];
        scrollbarBorderWidth: string[];
        scrollbarBorderXWidth: string[];
        scrollbarBorderYWidth: string[];
        caretOpacity: string[];
        caretColor: string[];
        caretWidth: string[];
        caretBorderRightWidth: string[];
        caretBorderTopWidth: string[];
        caretBorderLeftWidth: string[];
        caretBorderBottomWidth: string[];
        caretBorderTopLeftRadius: string[];
        caretBorderTopRightRadius: string[];
        caretBorderBottomLeftRadius: string[];
        caretBorderBottomRightRadius: string[];
        caretBorderColor: string[];
        caretBorderBend: string[];
        caretBorderOpacity: string[];
        selectionOpacity: string[];
        selectionColor: string[];
        selectionBorderRightWidth: string[];
        selectionBorderTopWidth: string[];
        selectionBorderLeftWidth: string[];
        selectionBorderBottomWidth: string[];
        selectionBorderTopLeftRadius: string[];
        selectionBorderTopRightRadius: string[];
        selectionBorderBottomLeftRadius: string[];
        selectionBorderBottomRightRadius: string[];
        selectionBorderColor: string[];
        selectionBorderBend: string[];
        selectionBorderOpacity: string[];
        caretBorderRadius: string[];
        caretBorderTopRadius: string[];
        caretBorderLeftRadius: string[];
        caretBorderRightRadius: string[];
        caretBorderBottomRadius: string[];
        caretBorderWidth: string[];
        caretBorderXWidth: string[];
        caretBorderYWidth: string[];
        selectionBorderRadius: string[];
        selectionBorderTopRadius: string[];
        selectionBorderLeftRadius: string[];
        selectionBorderRightRadius: string[];
        selectionBorderBottomRadius: string[];
        selectionBorderWidth: string[];
        selectionBorderXWidth: string[];
        selectionBorderYWidth: string[];
    } | {
        positionType: string[][];
        positionTop: string[];
        positionLeft: string[];
        positionRight: string[];
        positionBottom: string[];
        alignContent: string[][];
        alignItems: string[][];
        alignSelf: string[][];
        flexDirection: string[][];
        flexWrap: string[][];
        justifyContent: string[][];
        marginTop: (string | string[])[];
        marginLeft: (string | string[])[];
        marginRight: (string | string[])[];
        marginBottom: (string | string[])[];
        flexBasis: (string | string[])[];
        flexGrow: string[];
        flexShrink: string[];
        width: (string | string[])[];
        height: (string | string[])[];
        minWidth: string[];
        minHeight: string[];
        maxWidth: string[];
        maxHeight: string[];
        aspectRatio: string[];
        borderTopWidth: string[];
        borderLeftWidth: string[];
        borderRightWidth: string[];
        borderBottomWidth: string[];
        overflow: string[][];
        display: string[][];
        paddingTop: string[];
        paddingLeft: string[];
        paddingRight: string[];
        paddingBottom: string[];
        gapRow: string[];
        gapColumn: string[];
        borderTopLeftRadius: string[];
        borderTopRightRadius: string[];
        borderBottomLeftRadius: string[];
        borderBottomRightRadius: string[];
        backgroundOpacity: string[];
        backgroundColor: string[];
        borderColor: string[];
        borderBend: string[];
        borderOpacity: string[];
        zIndexOffset: string[];
        transformTranslateX: string[];
        transformTranslateY: string[];
        transformTranslateZ: string[];
        transformRotateX: string[];
        transformRotateY: string[];
        transformRotateZ: string[];
        transformScaleX: string[];
        transformScaleY: string[];
        transformScaleZ: string[];
        transformOriginX: string[][];
        transformOriginY: string[][];
        receiveShadow: string[];
        castShadow: string[];
        visibility: string[][];
        inset: string[];
        padding: string[];
        paddingX: string[];
        paddingY: string[];
        margin: (string | string[])[];
        marginX: (string | string[])[];
        marginY: (string | string[])[];
        gap: string[];
        borderWidth: string[];
        borderXWidth: string[];
        borderYWidth: string[];
        borderRadius: string[];
        borderTopRadius: string[];
        borderLeftRadius: string[];
        borderRightRadius: string[];
        borderBottomRadius: string[];
        transformScale: string[];
        cursor: string[];
    } | {
        keepAspectRatio: string[];
        objectFit: string[][];
        src: string[];
    })[];
    Input: ({
        textAlign: string[][];
        verticalAlign: string[][];
        color: string[];
        opacity: string[];
        letterSpacing: string[];
        lineHeight: string[];
        fontSize: string[];
        wordBreak: string[][];
        fontFamily: string[];
        fontWeight: (string | string[])[];
        scrollbarOpacity: string[];
        scrollbarColor: string[];
        scrollbarWidth: string[];
        scrollbarBorderRightWidth: string[];
        scrollbarBorderTopWidth: string[];
        scrollbarBorderLeftWidth: string[];
        scrollbarBorderBottomWidth: string[];
        scrollbarBorderTopLeftRadius: string[];
        scrollbarBorderTopRightRadius: string[];
        scrollbarBorderBottomLeftRadius: string[];
        scrollbarBorderBottomRightRadius: string[];
        scrollbarBorderColor: string[];
        scrollbarBorderBend: string[];
        scrollbarBorderOpacity: string[];
        scrollbarBorderRadius: string[];
        scrollbarBorderTopRadius: string[];
        scrollbarBorderLeftRadius: string[];
        scrollbarBorderRightRadius: string[];
        scrollbarBorderBottomRadius: string[];
        scrollbarBorderWidth: string[];
        scrollbarBorderXWidth: string[];
        scrollbarBorderYWidth: string[];
        caretOpacity: string[];
        caretColor: string[];
        caretWidth: string[];
        caretBorderRightWidth: string[];
        caretBorderTopWidth: string[];
        caretBorderLeftWidth: string[];
        caretBorderBottomWidth: string[];
        caretBorderTopLeftRadius: string[];
        caretBorderTopRightRadius: string[];
        caretBorderBottomLeftRadius: string[];
        caretBorderBottomRightRadius: string[];
        caretBorderColor: string[];
        caretBorderBend: string[];
        caretBorderOpacity: string[];
        selectionOpacity: string[];
        selectionColor: string[];
        selectionBorderRightWidth: string[];
        selectionBorderTopWidth: string[];
        selectionBorderLeftWidth: string[];
        selectionBorderBottomWidth: string[];
        selectionBorderTopLeftRadius: string[];
        selectionBorderTopRightRadius: string[];
        selectionBorderBottomLeftRadius: string[];
        selectionBorderBottomRightRadius: string[];
        selectionBorderColor: string[];
        selectionBorderBend: string[];
        selectionBorderOpacity: string[];
        caretBorderRadius: string[];
        caretBorderTopRadius: string[];
        caretBorderLeftRadius: string[];
        caretBorderRightRadius: string[];
        caretBorderBottomRadius: string[];
        caretBorderWidth: string[];
        caretBorderXWidth: string[];
        caretBorderYWidth: string[];
        selectionBorderRadius: string[];
        selectionBorderTopRadius: string[];
        selectionBorderLeftRadius: string[];
        selectionBorderRightRadius: string[];
        selectionBorderBottomRadius: string[];
        selectionBorderWidth: string[];
        selectionBorderXWidth: string[];
        selectionBorderYWidth: string[];
    } | {
        positionType: string[][];
        positionTop: string[];
        positionLeft: string[];
        positionRight: string[];
        positionBottom: string[];
        alignContent: string[][];
        alignItems: string[][];
        alignSelf: string[][];
        flexDirection: string[][];
        flexWrap: string[][];
        justifyContent: string[][];
        marginTop: (string | string[])[];
        marginLeft: (string | string[])[];
        marginRight: (string | string[])[];
        marginBottom: (string | string[])[];
        flexBasis: (string | string[])[];
        flexGrow: string[];
        flexShrink: string[];
        width: (string | string[])[];
        height: (string | string[])[];
        minWidth: string[];
        minHeight: string[];
        maxWidth: string[];
        maxHeight: string[];
        aspectRatio: string[];
        borderTopWidth: string[];
        borderLeftWidth: string[];
        borderRightWidth: string[];
        borderBottomWidth: string[];
        overflow: string[][];
        display: string[][];
        paddingTop: string[];
        paddingLeft: string[];
        paddingRight: string[];
        paddingBottom: string[];
        gapRow: string[];
        gapColumn: string[];
        borderTopLeftRadius: string[];
        borderTopRightRadius: string[];
        borderBottomLeftRadius: string[];
        borderBottomRightRadius: string[];
        backgroundOpacity: string[];
        backgroundColor: string[];
        borderColor: string[];
        borderBend: string[];
        borderOpacity: string[];
        zIndexOffset: string[];
        transformTranslateX: string[];
        transformTranslateY: string[];
        transformTranslateZ: string[];
        transformRotateX: string[];
        transformRotateY: string[];
        transformRotateZ: string[];
        transformScaleX: string[];
        transformScaleY: string[];
        transformScaleZ: string[];
        transformOriginX: string[][];
        transformOriginY: string[][];
        receiveShadow: string[];
        castShadow: string[];
        visibility: string[][];
        inset: string[];
        padding: string[];
        paddingX: string[];
        paddingY: string[];
        margin: (string | string[])[];
        marginX: (string | string[])[];
        marginY: (string | string[])[];
        gap: string[];
        borderWidth: string[];
        borderXWidth: string[];
        borderYWidth: string[];
        borderRadius: string[];
        borderTopRadius: string[];
        borderLeftRadius: string[];
        borderRightRadius: string[];
        borderBottomRadius: string[];
        transformScale: string[];
        cursor: string[];
    } | {
        disabled: string[];
        value: string[];
        tabIndex: string[];
        multiline: string[];
        defaultValue: string[];
    })[];
    Svg: ({
        textAlign: string[][];
        verticalAlign: string[][];
        color: string[];
        opacity: string[];
        letterSpacing: string[];
        lineHeight: string[];
        fontSize: string[];
        wordBreak: string[][];
        fontFamily: string[];
        fontWeight: (string | string[])[];
        scrollbarOpacity: string[];
        scrollbarColor: string[];
        scrollbarWidth: string[];
        scrollbarBorderRightWidth: string[];
        scrollbarBorderTopWidth: string[];
        scrollbarBorderLeftWidth: string[];
        scrollbarBorderBottomWidth: string[];
        scrollbarBorderTopLeftRadius: string[];
        scrollbarBorderTopRightRadius: string[];
        scrollbarBorderBottomLeftRadius: string[];
        scrollbarBorderBottomRightRadius: string[];
        scrollbarBorderColor: string[];
        scrollbarBorderBend: string[];
        scrollbarBorderOpacity: string[];
        scrollbarBorderRadius: string[];
        scrollbarBorderTopRadius: string[];
        scrollbarBorderLeftRadius: string[];
        scrollbarBorderRightRadius: string[];
        scrollbarBorderBottomRadius: string[];
        scrollbarBorderWidth: string[];
        scrollbarBorderXWidth: string[];
        scrollbarBorderYWidth: string[];
        caretOpacity: string[];
        caretColor: string[];
        caretWidth: string[];
        caretBorderRightWidth: string[];
        caretBorderTopWidth: string[];
        caretBorderLeftWidth: string[];
        caretBorderBottomWidth: string[];
        caretBorderTopLeftRadius: string[];
        caretBorderTopRightRadius: string[];
        caretBorderBottomLeftRadius: string[];
        caretBorderBottomRightRadius: string[];
        caretBorderColor: string[];
        caretBorderBend: string[];
        caretBorderOpacity: string[];
        selectionOpacity: string[];
        selectionColor: string[];
        selectionBorderRightWidth: string[];
        selectionBorderTopWidth: string[];
        selectionBorderLeftWidth: string[];
        selectionBorderBottomWidth: string[];
        selectionBorderTopLeftRadius: string[];
        selectionBorderTopRightRadius: string[];
        selectionBorderBottomLeftRadius: string[];
        selectionBorderBottomRightRadius: string[];
        selectionBorderColor: string[];
        selectionBorderBend: string[];
        selectionBorderOpacity: string[];
        caretBorderRadius: string[];
        caretBorderTopRadius: string[];
        caretBorderLeftRadius: string[];
        caretBorderRightRadius: string[];
        caretBorderBottomRadius: string[];
        caretBorderWidth: string[];
        caretBorderXWidth: string[];
        caretBorderYWidth: string[];
        selectionBorderRadius: string[];
        selectionBorderTopRadius: string[];
        selectionBorderLeftRadius: string[];
        selectionBorderRightRadius: string[];
        selectionBorderBottomRadius: string[];
        selectionBorderWidth: string[];
        selectionBorderXWidth: string[];
        selectionBorderYWidth: string[];
    } | {
        positionType: string[][];
        positionTop: string[];
        positionLeft: string[];
        positionRight: string[];
        positionBottom: string[];
        alignContent: string[][];
        alignItems: string[][];
        alignSelf: string[][];
        flexDirection: string[][];
        flexWrap: string[][];
        justifyContent: string[][];
        marginTop: (string | string[])[];
        marginLeft: (string | string[])[];
        marginRight: (string | string[])[];
        marginBottom: (string | string[])[];
        flexBasis: (string | string[])[];
        flexGrow: string[];
        flexShrink: string[];
        width: (string | string[])[];
        height: (string | string[])[];
        minWidth: string[];
        minHeight: string[];
        maxWidth: string[];
        maxHeight: string[];
        aspectRatio: string[];
        borderTopWidth: string[];
        borderLeftWidth: string[];
        borderRightWidth: string[];
        borderBottomWidth: string[];
        overflow: string[][];
        display: string[][];
        paddingTop: string[];
        paddingLeft: string[];
        paddingRight: string[];
        paddingBottom: string[];
        gapRow: string[];
        gapColumn: string[];
        borderTopLeftRadius: string[];
        borderTopRightRadius: string[];
        borderBottomLeftRadius: string[];
        borderBottomRightRadius: string[];
        backgroundOpacity: string[];
        backgroundColor: string[];
        borderColor: string[];
        borderBend: string[];
        borderOpacity: string[];
        zIndexOffset: string[];
        transformTranslateX: string[];
        transformTranslateY: string[];
        transformTranslateZ: string[];
        transformRotateX: string[];
        transformRotateY: string[];
        transformRotateZ: string[];
        transformScaleX: string[];
        transformScaleY: string[];
        transformScaleZ: string[];
        transformOriginX: string[][];
        transformOriginY: string[][];
        receiveShadow: string[];
        castShadow: string[];
        visibility: string[][];
        inset: string[];
        padding: string[];
        paddingX: string[];
        paddingY: string[];
        margin: (string | string[])[];
        marginX: (string | string[])[];
        marginY: (string | string[])[];
        gap: string[];
        borderWidth: string[];
        borderXWidth: string[];
        borderYWidth: string[];
        borderRadius: string[];
        borderTopRadius: string[];
        borderLeftRadius: string[];
        borderRightRadius: string[];
        borderBottomRadius: string[];
        transformScale: string[];
        cursor: string[];
    } | {
        keepAspectRatio: string[];
        src: string[];
    })[];
    Text: {}[];
    VideoContainer: ({
        textAlign: string[][];
        verticalAlign: string[][];
        color: string[];
        opacity: string[];
        letterSpacing: string[];
        lineHeight: string[];
        fontSize: string[];
        wordBreak: string[][];
        fontFamily: string[];
        fontWeight: (string | string[])[];
        scrollbarOpacity: string[];
        scrollbarColor: string[];
        scrollbarWidth: string[];
        scrollbarBorderRightWidth: string[];
        scrollbarBorderTopWidth: string[];
        scrollbarBorderLeftWidth: string[];
        scrollbarBorderBottomWidth: string[];
        scrollbarBorderTopLeftRadius: string[];
        scrollbarBorderTopRightRadius: string[];
        scrollbarBorderBottomLeftRadius: string[];
        scrollbarBorderBottomRightRadius: string[];
        scrollbarBorderColor: string[];
        scrollbarBorderBend: string[];
        scrollbarBorderOpacity: string[];
        scrollbarBorderRadius: string[];
        scrollbarBorderTopRadius: string[];
        scrollbarBorderLeftRadius: string[];
        scrollbarBorderRightRadius: string[];
        scrollbarBorderBottomRadius: string[];
        scrollbarBorderWidth: string[];
        scrollbarBorderXWidth: string[];
        scrollbarBorderYWidth: string[];
        caretOpacity: string[];
        caretColor: string[];
        caretWidth: string[];
        caretBorderRightWidth: string[];
        caretBorderTopWidth: string[];
        caretBorderLeftWidth: string[];
        caretBorderBottomWidth: string[];
        caretBorderTopLeftRadius: string[];
        caretBorderTopRightRadius: string[];
        caretBorderBottomLeftRadius: string[];
        caretBorderBottomRightRadius: string[];
        caretBorderColor: string[];
        caretBorderBend: string[];
        caretBorderOpacity: string[];
        selectionOpacity: string[];
        selectionColor: string[];
        selectionBorderRightWidth: string[];
        selectionBorderTopWidth: string[];
        selectionBorderLeftWidth: string[];
        selectionBorderBottomWidth: string[];
        selectionBorderTopLeftRadius: string[];
        selectionBorderTopRightRadius: string[];
        selectionBorderBottomLeftRadius: string[];
        selectionBorderBottomRightRadius: string[];
        selectionBorderColor: string[];
        selectionBorderBend: string[];
        selectionBorderOpacity: string[];
        caretBorderRadius: string[];
        caretBorderTopRadius: string[];
        caretBorderLeftRadius: string[];
        caretBorderRightRadius: string[];
        caretBorderBottomRadius: string[];
        caretBorderWidth: string[];
        caretBorderXWidth: string[];
        caretBorderYWidth: string[];
        selectionBorderRadius: string[];
        selectionBorderTopRadius: string[];
        selectionBorderLeftRadius: string[];
        selectionBorderRightRadius: string[];
        selectionBorderBottomRadius: string[];
        selectionBorderWidth: string[];
        selectionBorderXWidth: string[];
        selectionBorderYWidth: string[];
    } | {
        positionType: string[][];
        positionTop: string[];
        positionLeft: string[];
        positionRight: string[];
        positionBottom: string[];
        alignContent: string[][];
        alignItems: string[][];
        alignSelf: string[][];
        flexDirection: string[][];
        flexWrap: string[][];
        justifyContent: string[][];
        marginTop: (string | string[])[];
        marginLeft: (string | string[])[];
        marginRight: (string | string[])[];
        marginBottom: (string | string[])[];
        flexBasis: (string | string[])[];
        flexGrow: string[];
        flexShrink: string[];
        width: (string | string[])[];
        height: (string | string[])[];
        minWidth: string[];
        minHeight: string[];
        maxWidth: string[];
        maxHeight: string[];
        aspectRatio: string[];
        borderTopWidth: string[];
        borderLeftWidth: string[];
        borderRightWidth: string[];
        borderBottomWidth: string[];
        overflow: string[][];
        display: string[][];
        paddingTop: string[];
        paddingLeft: string[];
        paddingRight: string[];
        paddingBottom: string[];
        gapRow: string[];
        gapColumn: string[];
        borderTopLeftRadius: string[];
        borderTopRightRadius: string[];
        borderBottomLeftRadius: string[];
        borderBottomRightRadius: string[];
        backgroundOpacity: string[];
        backgroundColor: string[];
        borderColor: string[];
        borderBend: string[];
        borderOpacity: string[];
        zIndexOffset: string[];
        transformTranslateX: string[];
        transformTranslateY: string[];
        transformTranslateZ: string[];
        transformRotateX: string[];
        transformRotateY: string[];
        transformRotateZ: string[];
        transformScaleX: string[];
        transformScaleY: string[];
        transformScaleZ: string[];
        transformOriginX: string[][];
        transformOriginY: string[][];
        receiveShadow: string[];
        castShadow: string[];
        visibility: string[][];
        inset: string[];
        padding: string[];
        paddingX: string[];
        paddingY: string[];
        margin: (string | string[])[];
        marginX: (string | string[])[];
        marginY: (string | string[])[];
        gap: string[];
        borderWidth: string[];
        borderXWidth: string[];
        borderYWidth: string[];
        borderRadius: string[];
        borderTopRadius: string[];
        borderLeftRadius: string[];
        borderRightRadius: string[];
        borderBottomRadius: string[];
        transformScale: string[];
        cursor: string[];
    } | {
        keepAspectRatio: string[];
        objectFit: string[][];
        src: string[];
        volume: string[];
        preservesPitch: string[];
        playbackRate: string[];
        muted: string[];
        loop: string[];
        autoplay: string[];
    })[];
};
export declare function kebabToCamelCase(name: string): string;
export * from './properties.js';