/* @flow */

export type Transform =
    | { perspective: number }
    | { scale: number }
    | { scaleX: number }
    | { scaleY: number }
    | { translateX: number }
    | { translateY: number }
    | { rotate: string }
    | { rotateX: string }
    | { rotateY: string }
    | { rotateZ: string }
    | { skewX: string }
    | { skewY: string };

export type TransformPropTypes = {|
    transform?: Array<Transform>
|};

export type FontVariant =
    | 'small-caps'
    | 'oldstyle-nums'
    | 'lining-nums'
    | 'tabular-nums'
    | 'proportional-nums';

export type LayoutPropTypes = {|
    display?: 'flex' | 'none',
    width?: number | string,
    height?: number | string,
    top?: number | string,
    left?: number | string,
    right?: number | string,
    bottom?: number | string,
    minWidth?: number | string,
    maxWidth?: number | string,
    minHeight?: number | string,
    maxHeight?: number | string,
    margin?: number | string,
    marginVertical?: number | string,
    marginHorizontal?: number | string,
    marginTop?: number | string,
    marginBottom?: number | string,
    marginLeft?: number | string,
    marginRight?: number | string,
    padding?: number | string,
    paddingVertical?: number | string,
    paddingHorizontal?: number | string,
    paddingTop?: number | string,
    paddingBottom?: number | string,
    paddingLeft?: number | string,
    paddingRight?: number | string,
    borderWidth?: number,
    borderTopWidth?: number,
    borderRightWidth?: number,
    borderBottomWidth?: number,
    borderLeftWidth?: number,
    position?: 'absolute' | 'relative',
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse',
    flexWrap?: 'wrap' | 'nowrap',
    justifyContent?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around',
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
    alignSelf?:
        | 'auto'
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'stretch'
        | 'baseline',
    alignContent?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'stretch'
        | 'space-between'
        | 'space-around',
    overflow?: 'visible' | 'hidden' | 'scroll',
    flex?: number,
    flexGrow?: number,
    flexShrink?: number,
    flexBasis?: number | string,
    aspectRatio?: number,
    zIndex?: number,
    direction?: 'inherit' | 'ltr' | 'rtl'
|};

export type ShadowPropTypes = {|
    shadowColor?: string,
    shadowOffset?: {|
        width?: number,
        height?: number
    |},
    shadowOpacity?: number,
    shadowRadius?: number
|};

export type ExtraViewStylePropTypes = {|
    backfaceVisibility?: 'visible' | 'hidden',
    backgroundColor?: string,
    borderColor?: string,
    borderTopColor?: string,
    borderRightColor?: string,
    borderBottomColor?: string,
    borderLeftColor?: string,
    borderRadius?: number,
    borderTopLeftRadius?: number,
    borderTopRightRadius?: number,
    borderBottomLeftRadius?: number,
    borderBottomRightRadius?: number,
    borderStyle?: 'solid' | 'dotted' | 'dashed',
    borderWidth?: number,
    borderTopWidth?: number,
    borderRightWidth?: number,
    borderBottomWidth?: number,
    borderLeftWidth?: number,
    opacity?: number,
    elevation?: number
|};

export type ExtraTextStylePropTypes = {|
    color?: string,
    fontFamily?: string,
    fontSize?: number,
    fontStyle?: 'normal' | 'italic',
    fontWeight?:
        | 'normal'
        | 'bold'
        | '100'
        | '200'
        | '300'
        | '400'
        | '500'
        | '600'
        | '700'
        | '800'
        | '900',
    fontVariant?: Array<FontVariant>,
    textShadowOffset?: {|
        width?: number,
        height?: number
    |},
    textShadowRadius?: number,
    textShadowColor?: string,
    letterSpacing?: number,
    lineHeight?: number,
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify',
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center',
    includeFontPadding?: boolean,
    textDecorationLine?:
        | 'none'
        | 'underline'
        | 'line-through'
        | 'underline line-through',
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed',
    textDecorationColor?: string,
    writingDirection?: 'auto' | 'ltr' | 'rtl'
|};

export type ImageResizeModeEnum = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
    repeat: 'repeat'
};

export type ExtraImageStylePropTypes = {|
    resizeMode?: $Keys<ImageResizeModeEnum>,
    backfaceVisibility?: 'visible' | 'hidden',
    backgroundColor?: string,
    borderColor?: string,
    borderWidth?: number,
    borderRadius?: number,
    overflow?: 'visible' | 'hidden',
    tintColor?: string,
    opacity?: number,
    overlayColor?: string,
    borderTopLeftRadius?: number,
    borderTopRightRadius?: number,
    borderBottomLeftRadius?: number,
    borderBottomRightRadius?: number
|};

export type ViewStylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraViewStylePropTypes
|};

export type TextStylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraViewStylePropTypes,
    ...ExtraTextStylePropTypes
|};

export type ImageStylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraImageStylePropTypes
|};

export type StylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraImageStylePropTypes,
    ...ExtraTextStylePropTypes,
    ...ExtraViewStylePropTypes
|};

export type TypographyStyle = {
    ...LayoutPropTypes,
    fontFamily?: string,
    fontWeight?: '300' | '400' | '500',
    fontSize?: number,
    letterSpacing?: number,
    color?: null | string,
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'
};
